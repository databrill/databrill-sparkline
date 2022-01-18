import useDebounceCallback from "hooks/useDebounceCallback";
import { calculateBarChartItems } from "lib/calcs";
import { drawRectangle, setup } from "lib/canvas";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface BarChartProps {
	readonly barGap?: number;
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly highlightColor?: string;
	readonly min?: number;
	readonly size: number;
	readonly values: readonly number[];
	readonly zeroColor?: string;
}

export const BarChart = memo(
	({
		barGap = 0,
		barWidth = 20,
		className,
		color = "black",
		highlightColor = "red",
		min: forceMin,
		size: height,
		values,
		zeroColor = "black",
	}: BarChartProps): JSX.Element => {
		const [showTooltip, setShowTooltip] = useState<boolean>(false);
		const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null);
		const ref = useRef<HTMLCanvasElement>(null);
		const width = (values.length - 1) * (barWidth + barGap) + barWidth;

		const items = useMemo(
			() =>
				calculateBarChartItems({
					barGap,
					barWidth,
					color,
					forceMin,
					height,
					values,
					zeroColor,
				}),
			[barGap, barWidth, color, forceMin, height, values, zeroColor]
		);

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
