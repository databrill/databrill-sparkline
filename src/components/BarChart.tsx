import useDebounceCallback from "hooks/useDebounceCallback";
import { drawRectangle, setup } from "lib/canvas";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface BarChartProps {
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly gap?: number;
	readonly highlightColor?: string;
	readonly min?: number;
	readonly size: number;
	readonly values: readonly number[];
	readonly zeroColor?: string;
}

export const BarChart = memo(
	({
		barWidth = 20,
		className,
		color = "black",
		gap = 0,
		highlightColor = "red",
		min: forceMin,
		size,
		values,
		zeroColor = "black",
	}: BarChartProps): JSX.Element => {
		const [showTooltip, setShowTooltip] = useState<boolean>(false);
		const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null);
		const height = size;
		const minBarHeight = 1;
		const ref = useRef<HTMLCanvasElement>(null);
		const width = (values.length - 1) * (barWidth + gap) + barWidth;

		const items = useMemo(() => {
			const itemGap = gap > 0 ? gap : 0;
			const max = Math.max(...values);
			const min = forceMin ?? Math.min(...values);
			const range = max - min;

			if (max <= 0 && min < 0) {
				return values.map((value, index) => {
					const itemHeight = Math.abs(Math.round(((value - max) * height) / range));

					return {
						color: value === 0 ? zeroColor : color,
						height: itemHeight + minBarHeight,
						value,
						width: barWidth,
						x: index * (itemGap + barWidth),
						y: height - itemHeight - minBarHeight,
					};
				});
			} else if (min >= 0) {
				return values.map((value, index) => {
					const itemHeight = Math.abs(Math.round(((value - min) * height) / range));

					return {
						color: value === 0 ? zeroColor : color,
						height: itemHeight + minBarHeight,
						value,
						width: barWidth,
						x: index * (itemGap + barWidth),
						y: 0,
					};
				});
			} else {
				return values.map((value, index) => {
					const itemHeight = Math.abs(Math.round((value * height) / range));
					const zero = Math.round(((range - Math.abs(max)) * height) / range);

					return {
						color: value === 0 ? zeroColor : color,
						height: value >= 0 ? itemHeight + minBarHeight : itemHeight,
						value,
						width: barWidth,
						x: index * (itemGap + barWidth),
						y: value < 0 ? zero - itemHeight : zero,
					};
				});
			}
		}, [barWidth, color, forceMin, gap, height, values, zeroColor]);

		const handleMouseMove = useDebounceCallback(
			(event: MouseEvent<HTMLCanvasElement>): void => {
				const canvas = ref.current;
				const canvasPosition = canvas?.getBoundingClientRect();
				const canvasClientLeft = canvas?.clientLeft ?? 0;
				const canvasLeft = canvasPosition?.left ?? 0;

				const x = event.clientX;
				const y = event.clientY;
				const current = items.find(
					(item) =>
						x >= item.x + canvasLeft + canvasClientLeft &&
						x <= item.x + item.width + canvasLeft + canvasClientLeft
				);

				if (current) {
					setTooltipProps({ left: x + 8, top: y - 16, value: current?.value });
					setShowTooltip(true);
				} else {
					setShowTooltip(false);
				}

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
			setShowTooltip(false);
		}, [handleMouseMove, items]);

		useEffect(() => {
			setup({ canvas: ref.current, height, width });
		}, [height, width]);

		useEffect(() => {
			items.forEach((item) => drawRectangle({ ...item, canvas: ref.current }));
		}, [items]);

		return (
			<div className={className} style={{ display: "inline-flex" }}>
				<canvas onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} ref={ref} />
				{showTooltip ? (
					<Tooltip
						left={tooltipProps?.left}
						top={tooltipProps?.top}
						value={tooltipProps?.value}
					/>
				) : null}
			</div>
		);
	}
);
