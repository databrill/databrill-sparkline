import { useDebounceCallback } from "hooks/useDebounceCallback";
import { calculateBarChartItems } from "lib/calcs";
import { drawRectangle, setup } from "lib/canvas";
import { BarChartLayer } from "models/BarChartLayer";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface BarChartProps {
	readonly annotationColor?: string;
	readonly barColor?: string;
	readonly barGap?: number;
	readonly barWidth?: number;
	readonly className?: string;
	readonly highlightColor?: string;
	readonly layers: readonly BarChartLayer[];
	readonly min?: number;
	readonly size: number;
	readonly zeroColor?: string;
}

export const BarChart = memo(
	({
		annotationColor = "blue",
		barColor = "black",
		barGap = 0,
		barWidth = 20,
		className,
		highlightColor = "red",
		layers,
		min: forceMin,
		size: canvasHeight,
		zeroColor = "black",
	}: BarChartProps): JSX.Element => {
		const [showTooltip, setShowTooltip] = useState<boolean>(false);
		const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null);
		const ref = useRef<HTMLCanvasElement>(null);

		const items = useMemo(
			() =>
				calculateBarChartItems({
					annotationColor,
					barColor,
					barGap,
					barWidth,
					canvasHeight,
					forceMin,
					layers,
					zeroColor,
				}),
			[annotationColor, barColor, barGap, barWidth, canvasHeight, forceMin, layers, zeroColor]
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
					const color = active && item.type === "bar" ? highlightColor : item.color;
					drawRectangle({ ...item, canvas, color });
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
			const barsLayer = layers.find((layer) => layer.type === "bars");
			const barsLayerLength = barsLayer?.values.length ?? 0;
			const canvasWidth = (barsLayerLength - 1) * (barWidth + barGap) + barWidth;

			setup({ canvas: ref.current, height: canvasHeight, width: canvasWidth });
		}, [barGap, barWidth, canvasHeight, layers]);

		useEffect(() => {
			items.forEach((item) => drawRectangle({ ...item, canvas: ref.current }));
		}, [items]);

		return (
			<div className={className} style={{ display: "inline-flex", position: "relative" }}>
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
