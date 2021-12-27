import { drawCircle, drawLine, drawRectangleOutline, drawText, setup } from "lib/canvas";
import { isValid } from "lib/color";
import { memo, useEffect, useMemo, useRef } from "react";

export interface ScatterPlotProps {
	readonly className?: string;
	readonly dotColor?: string;
	readonly dotSize?: number;
	readonly size: number;
	readonly stepX?: number;
	readonly stepY?: number;
	readonly x: number[];
	readonly y: number[];
}

export const ScatterPlot = memo(
	({
		className,
		dotColor = "black",
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

		const items = useMemo(() => {
			const itemColor = isValid(dotColor) ? dotColor : "black";
			const position = size - gap - itemSize * 2 - 2;
			const rangeX = maxX + -minX;
			const rangeY = maxY + -minY;

			return x.map((value, index) => ({
				color: itemColor,
				size: itemSize,
				x: Math.round(((value + -minX) * position) / rangeX) + gap + itemSize,
				y: Math.round((((y[index] ?? 0) + -minY) * position) / rangeY) + gap + itemSize,
			}));
		}, [dotColor, itemSize, maxX, maxY, minX, minY, size, x, y]);

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
				<canvas ref={ref} />
			</div>
		);
	}
);
