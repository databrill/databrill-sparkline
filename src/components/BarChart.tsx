import { draw, setup } from "lib/canvas";
import { isValid } from "lib/color";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef } from "react";

export interface BarChartProps {
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly gap?: number;
	readonly highlightColor?: string;
	readonly size: number;
	readonly values: readonly number[];
}

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export const BarChart = memo(
	({
		barWidth = 20,
		className,
		color = "black",
		gap = 0,
		highlightColor = "red",
		size,
		values,
	}: BarChartProps): JSX.Element => {
		const height = size;
		const width = (values.length - 1) * (barWidth + gap) + barWidth;
		const ref = useRef<HTMLCanvasElement>(null);

		const items = useMemo(() => {
			const itemColor = isValid(color) ? color : "black";
			const itemGap = gap > 0 ? gap : 0;
			const max = Math.max(...values);
			const min = Math.min(...values);
			const range = Math.abs(max) + Math.abs(min);

			return values.map((value, index) => {
				const itemHeight = (Math.abs(value) * height) / range;
				const itemWidth = barWidth;

				return {
					color: itemColor,
					height: itemHeight,
					value,
					width: itemWidth,
					x: index === 0 ? index * itemWidth : index * (itemGap + itemWidth),
					y:
						value > 0
							? (Math.abs(min) * height) / range
							: (Math.abs(min) * height) / range - itemHeight,
				};
			});
		}, [barWidth, color, gap, height, values]);

		const handleMouseMove = useCallback(
			(event: MouseEvent<HTMLCanvasElement>): void => {
				const canvas = ref.current;
				const x = event.clientX;

				items.forEach((item, index) => {
					const current = x >= item.x && x <= item.x + item.width + gap * index;
					draw({ ...item, canvas, color: current ? highlightColor : item.color });
				});
			},
			[gap, highlightColor, items]
		);

		const handleMouseOut = useCallback(() => {
			items.forEach((item) => draw({ ...item, canvas: ref.current }));
		}, [items]);

		useEffect(() => {
			setup({ canvas: ref.current, height, width });
		}, [height, width]);

		useEffect(() => {
			items.forEach((item) => draw({ ...item, canvas: ref.current }));
		}, [height, items, width]);

		return (
			<canvas
				className={className}
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
				ref={ref}
			/>
		);
	}
);
