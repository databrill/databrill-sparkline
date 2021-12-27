import useDebounceCallback from "hooks/useDebounceCallback";
import { drawRectangle, setup } from "lib/canvas";
import { isValid } from "lib/color";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface BarChartProps {
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly gap?: number;
	readonly highlightColor?: string;
	readonly size: number;
	readonly values: readonly number[];
}

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
		const [tooltip, setTooltip] = useState<TooltipProps | null>(null);
		const height = size;
		const width = (values.length - 1) * (barWidth + gap) + barWidth;
		const ref = useRef<HTMLCanvasElement>(null);

		const items = useMemo(() => {
			const itemColor = isValid(color) ? color : "black";
			const itemGap = gap > 0 ? gap : 0;
			const max = Math.max(...values);
			const min = Math.min(...values);
			const range = max + -min;

			return values.map((value, index) => {
				const itemHeight = Math.round((Math.abs(value) * height) / range);
				const itemWidth = barWidth;

				return {
					color: itemColor,
					height: itemHeight,
					value,
					width: itemWidth,
					x: index * (itemGap + itemWidth),
					y: Math.round(
						value > 0
							? (Math.abs(min) * height) / range
							: (Math.abs(min) * height) / range - itemHeight
					),
				};
			});
		}, [barWidth, color, gap, height, values]);

		const handleMouseMove = useDebounceCallback(
			(event: MouseEvent<HTMLCanvasElement>): void => {
				const canvas = ref.current;
				const bound = canvas?.getBoundingClientRect();
				const x = event.clientX - (bound?.left ?? 0) - (canvas?.clientLeft ?? 0);
				const y = event.clientY - (bound?.top ?? 0) - (canvas?.clientTop ?? 0);
				const current = items.find((item) => x >= item.x && x <= item.x + item.width);

				if (current)
					setTooltip({ hidden: false, left: x + 8, top: y - 16, value: current?.value });
				else setTooltip(null);

				items.forEach((item) => {
					const active = current?.x === item.x;
					drawRectangle({ ...item, canvas, color: active ? highlightColor : item.color });
				});
			},
			[highlightColor, items]
		);

		const handleMouseOut = useCallback(() => {
			handleMouseMove.cancel();
			items.forEach((item) => drawRectangle({ ...item, canvas: ref.current }));
			setTooltip(null);
		}, [handleMouseMove, items]);

		useEffect(() => {
			setup({ canvas: ref.current, height, width });
		}, [height, width]);

		useEffect(() => {
			items.forEach((item) => drawRectangle({ ...item, canvas: ref.current }));
		}, [items]);

		return (
			<div className={className} style={{ display: "inline-flex", position: "relative" }}>
				<canvas onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} ref={ref} />
				<Tooltip {...tooltip} />
			</div>
		);
	}
);
