import {
	drawCircle,
	drawLine,
	drawRectangle,
	drawRectangleOutline,
	drawText,
	setup,
} from "lib/canvas";
import { isValid } from "lib/color";
import { memo, useEffect, useMemo, useRef } from "react";

export interface ScatterPlotProps {
	readonly className?: string;
	readonly dotColor?: string;
	readonly dotSize?: number;
	readonly size: number;
	readonly x: number[];
	readonly y: number[];
}

export const ScatterPlot = memo(
	({ className, dotColor = "black", dotSize = 8, size, x, y }: ScatterPlotProps): JSX.Element => {
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
			const position = size - gap - itemSize * 2;

			return x.map((value, index) => ({
				color: itemColor,
				size: itemSize,
				x: Math.round((value * position) / maxX) + gap + itemSize,
				y: Math.round(((y[index] ?? 0) * position) / maxY) + gap + itemSize,
			}));
		}, [dotColor, itemSize, maxX, maxY, size, x, y]);

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
			const lines = Array(4).fill(undefined);
			const lineGapX = (plotWidth - itemSize * 2) / (lines.length - 1);
			const lineGapY = (plotHeight - itemSize * 2) / (lines.length - 1);

			lines.forEach((_, index) => {
				const fromX = gap + index * lineGapX + itemSize;
				const fromY = gap;
				const range = [minX, ((maxX - minX) / 4) * 2, ((maxX - minX) / 4) * 3, maxX];
				const toX = gap + index * lineGapX + itemSize;
				const toY = gap - gap / lines.length;
				const value = `${range[index]}`;

				drawLine({ canvas, fromX, fromY, toX, toY });
				drawText({ align: "center", canvas, value, x: toX, y: toY - fontSize - 4 });
			});

			lines.forEach((_, index) => {
				const fromX = gap;
				const fromY = gap + index * lineGapY + itemSize;
				const range = [minY, ((maxY - minY) / 4) * 2, ((maxY - minY) / 4) * 3, maxY];
				const toX = gap - gap / lines.length;
				const toY = gap + index * lineGapY + itemSize;
				const value = `${range[index]}`;

				drawLine({ canvas, fromX, fromY, toX, toY });
				drawText({ align: "right", canvas, value, x: toX - 4, y: toY - fontSize / 2 });
			});
		}, [itemSize, maxX, maxY, minX, minY, plotHeight, plotWidth]);

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
