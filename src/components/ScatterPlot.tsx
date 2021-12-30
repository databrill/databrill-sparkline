import useDebounceCallback from "hooks/useDebounceCallback";
import { drawCircle, drawLine, drawRectangleOutline, drawText, setup } from "lib/canvas";
import { memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface ScatterPlotProps {
	readonly className?: string;
	readonly dotColor?: string;
	readonly dotHighlightColor?: string;
	readonly dotSize?: number;
	readonly size: number;
	readonly stepX?: number;
	readonly stepY?: number;
	readonly x: readonly number[];
	readonly y: readonly number[];
}

export const ScatterPlot = memo(
	({
		className,
		dotColor = "black",
		dotHighlightColor = "red",
		dotSize = 8,
		size,
		stepX,
		stepY,
		x,
		y,
	}: ScatterPlotProps): JSX.Element => {
		const fontSize = 12;
		const itemSize = Math.round(dotSize);
		const gap = 24;
		const maxX = Math.max(...x);
		const maxY = Math.max(...y);
		const minX = Math.min(...x);
		const minY = Math.min(...y);
		const plotHeight = size - gap - 1;
		const plotWidth = size - gap - 1;
		const ref = useRef<HTMLCanvasElement>(null);
		const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

		const items = useMemo(() => {
			const position = size - gap - itemSize * 2 - 2;
			const rangeX = maxX - minX;
			const rangeY = maxY - minY;

			return x.map((value, index) => ({
				color: dotColor,
				size: itemSize,
				x: Math.round(((value - minX) * position) / rangeX) + gap + itemSize,
				y: Math.round((((y[index] ?? 0) - minY) * position) / rangeY) + gap + itemSize,
				value: `${value}, ${y[index] ?? 0}`,
			}));
		}, [dotColor, itemSize, maxX, maxY, minX, minY, size, x, y]);

		const handleMouseMove = useDebounceCallback(
			(event: MouseEvent<HTMLCanvasElement>): void => {
				const canvas = ref.current;
				const bound = canvas?.getBoundingClientRect();
				const x = event.clientX - (bound?.left ?? 0) - (canvas?.clientLeft ?? 0);
				const y = event.clientY - (bound?.top ?? 0) - (canvas?.clientTop ?? 0);
				const current = items.find((item) => x >= item.x && x <= item.x + item.size);

				if (current)
					setTooltip({ hidden: false, left: x + 8, top: y - 16, value: current?.value });
				else setTooltip(null);

				items.forEach((item) => {
					const active = current?.x === item.x;
					drawCircle({ ...item, canvas, color: active ? dotHighlightColor : item.color });
				});
			},
			[dotHighlightColor, items]
		);

		const handleMouseOut = useCallback(() => {
			handleMouseMove.cancel();
			items.forEach((item) => drawCircle({ ...item, canvas: ref.current }));
			setTooltip(null);
		}, [handleMouseMove, items]);

		useEffect(() => {
			const canvas = ref.current;
			const height = size;
			const width = size;

			setup({ canvas, height, width });
		}, [size]);

		useEffect(() => {
			const canvas = ref.current;
			const x = gap;
			const y = gap;

			drawRectangleOutline({ canvas, height: plotHeight, x, y, width: plotWidth });
		}, [plotHeight, plotWidth, size]);

		useEffect(() => {
			const canvas = ref.current;
			const defaultSliceX = maxX / 3;
			const defaultSliceY = maxY / 3;
			const linesX = Array(Math.round(maxX / (stepX ?? defaultSliceX))).fill(null);
			const linesY = Array(Math.round(maxY / (stepY ?? defaultSliceY))).fill(null);
			const lineGapX = (plotWidth - itemSize * 2) / linesX.length;
			const lineGapY = (plotHeight - itemSize * 2) / linesY.length;
			const rangeX = [
				minX,
				...linesX.map((_, index) => minX + (stepX ?? defaultSliceX) * (index + 1)),
			];
			const rangeY = [
				minY,
				...linesY.map((_, index) => minY + (stepY ?? defaultSliceY) * (index + 1)),
			];

			rangeX.forEach((item, index) => {
				const fromX = gap + index * lineGapX + itemSize;
				const fromY = gap;
				const toX = gap + index * lineGapX + itemSize;
				const toY = gap - 8;
				const value = `${item}`;

				drawLine({ canvas, fromX, fromY, toX, toY });
				drawText({ align: "center", canvas, value, x: toX, y: toY - fontSize - 4 });
			});

			rangeY.forEach((item, index) => {
				const fromX = gap;
				const fromY = gap + index * lineGapY + itemSize;
				const toX = gap - 8;
				const toY = gap + index * lineGapY + itemSize;
				const value = `${item}`;

				drawLine({ canvas, fromX, fromY, toX, toY });
				drawText({ align: "right", canvas, value, x: toX, y: toY - fontSize / 2 });
			});
		}, [itemSize, maxX, maxY, minX, minY, plotHeight, plotWidth, stepX, stepY]);

		useEffect(() => {
			items.forEach((item) => drawCircle({ ...item, canvas: ref.current }));
		}, [items]);

		return (
			<div className={className} style={{ display: "inline-flex", position: "relative" }}>
				<canvas onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} ref={ref} />
				<Tooltip
					hidden={tooltip?.hidden}
					left={tooltip?.left}
					top={tooltip?.top}
					value={tooltip?.value}
				/>
			</div>
		);
	}
);
