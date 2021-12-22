import { drawCircle, setup } from "lib/canvas";
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
		const ref = useRef<HTMLCanvasElement>(null);

		const items = useMemo(() => {
			const itemColor = isValid(dotColor) ? dotColor : "black";
			const itemSize = Math.round(dotSize);
			const maxX = Math.max(...x);
			const maxY = Math.max(...y);

			return x.map((value, index) => ({
				color: itemColor,
				size: itemSize,
				x: Math.round((value * size) / maxX),
				y: Math.round(((y[index] ?? 0) * size) / maxY),
			}));
		}, [dotColor, dotSize, size, x, y]);

		useEffect(() => {
			setup({ canvas: ref.current, height: size, width: size });
		}, [size]);

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
