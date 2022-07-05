import { BarChartLayer } from "models/BarChartLayer";
import { ScatterPlotItem } from "models/ScatterPlotItem";
import { ScatterPlotLayer } from "models/ScatterPlotLayer";
import { calculateBarChartItems, calculateScatterPlotItems } from "./calcs";

export interface ClearProps {
	readonly canvas: HTMLCanvasElement | null;
}

export interface DrawCircleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly x: number;
	readonly y: number;
	readonly size: number;
}

export interface DrawLineProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly fromX: number;
	readonly fromY: number;
	readonly strokeWidth?: number;
	readonly toX: number;
	readonly toY: number;
}

export interface DrawRectangleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly height: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
}

export interface DrawTextProps {
	readonly align?: "center" | "left" | "right";
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly value: string;
	readonly x: number;
	readonly y: number;
}

export interface RenderBarChartProps {
	readonly annotationColor?: string;
	readonly barColor?: string;
	readonly barGap?: number;
	readonly barWidth?: number;
	readonly highlightColor?: string;
	readonly layers: readonly BarChartLayer[];
	readonly min?: number;
	readonly size: number;
	readonly valueFormatter?: (value: number, index: number) => string;
	readonly zeroColor?: string;
}

export interface RenderScatterPlotProps {
	readonly backgroundColor?: string;
	readonly layers: readonly ScatterPlotLayer[];
	readonly max?: [x?: number, y?: number];
	readonly min?: [x?: number, y?: number];
	readonly size: number;
	readonly valueFormatter?: (value: [x: number, y: number], index: number) => string;
}

export interface SetupProps {
	readonly backgroundColor?: string;
	readonly canvas: HTMLCanvasElement | null;
	readonly height: number;
	readonly width: number;
}

export function clear(props: ClearProps): void {
	const { canvas } = props;
	const context = canvas?.getContext("2d");

	if (!canvas || !context) return;

	context.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
}

export function drawCircle(props: DrawCircleProps): void {
	const { canvas, color = "black", size, x, y } = props;
	const context = canvas?.getContext("2d");

	if (!context) return;

	context.save();
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, size / 2, 0, 2 * Math.PI, false);
	context.fill();
	context.restore();
}

export function drawLine(props: DrawLineProps): void {
	const { canvas, color = "black", fromX, fromY, strokeWidth, toX, toY } = props;
	const context = canvas?.getContext("2d");

	if (!context) return;

	context.save();
	context.beginPath();
	context.lineWidth = strokeWidth ?? 1;
	context.strokeStyle = color;
	context.moveTo(fromX, fromY);
	context.lineTo(toX, toY);
	context.stroke();
	context.restore();
}

export function drawRectangle(props: DrawRectangleProps): void {
	const { canvas, color = "black", height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!context) return;

	context.save();
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.restore();
}

export function drawRectangleOutline(props: DrawRectangleProps): void {
	const { canvas, color = "black", height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!context) return;

	context.save();
	context.strokeStyle = color;
	context.strokeRect(x, y, width, height);
	context.restore();
}

export function drawText(props: DrawTextProps): void {
	const { align = "left", canvas, color = "black", value, x, y } = props;
	const context = canvas?.getContext("2d");

	if (!context) return;

	context.save();
	context.fillStyle = color;
	context.font = "14px Arial";
	context.textAlign = align;
	context.translate(x, y);
	context.scale(1, -1);
	context.fillText(value, 0, 0);
	context.restore();
}

export function setup(props: SetupProps): void {
	const { backgroundColor, canvas, height, width } = props;
	const context = canvas?.getContext("2d");

	if (!canvas || !context) return;

	canvas.setAttribute("height", `${height}px`);
	canvas.setAttribute("width", `${width}px`);
	if (backgroundColor) canvas.style.setProperty("background-color", backgroundColor);
	context.translate(0, height);
	context.scale(1, -1);
}

export function renderBarChart({
	annotationColor = "blue",
	barColor = "black",
	barGap = 0,
	barWidth = 8,
	highlightColor = "red",
	layers,
	min: forceMin,
	size: canvasHeight,
	valueFormatter,
	zeroColor = "black",
}: RenderBarChartProps): HTMLCanvasElement {
	const barsLayer = layers.find((layer) => layer.type === "bars");
	const barsLayerLength = barsLayer?.values.length ?? 0;
	const canvas = document.createElement("canvas");
	const canvasWidth = (barsLayerLength - 1) * (barGap + barWidth) + barWidth;
	const items = calculateBarChartItems({
		annotationColor,
		barColor,
		barGap,
		barWidth,
		canvasHeight,
		forceMin,
		layers,
		valueFormatter,
		zeroColor,
	});
	const portal = document.getElementById("portal-root");
	const tooltip = document.createElement("div");

	setup({ backgroundColor: "white", canvas, height: canvasHeight, width: canvasWidth });
	tooltip.style.setProperty("background-color", "rgba(60, 60, 60, 0.75)");
	tooltip.style.setProperty("color", "white");
	tooltip.style.setProperty("font-size", "12px");
	tooltip.style.setProperty("padding", "2px 8px");
	tooltip.style.setProperty("position", "absolute");
	tooltip.style.setProperty("text-align", "center");

	canvas.addEventListener("mousemove", (event) => {
		const canvasPosition = canvas.getBoundingClientRect();
		const canvasClientLeft = canvas.clientLeft ?? 0;
		const canvasLeft = canvasPosition.left ?? 0;
		const x = event.clientX;
		const y = event.clientY;
		const current = items.find(
			(item) =>
				x >= item.x + canvasLeft + canvasClientLeft &&
				x <= item.x + item.width + canvasLeft + canvasClientLeft
		);

		if (current) {
			tooltip.innerHTML = current.value.toString();
			tooltip.setAttribute("aria-label", current.value.toString());
			tooltip.style.setProperty("left", `${x + 8}px`);
			tooltip.style.setProperty("top", `${y - 16}px`);
			portal?.appendChild(tooltip);
		} else {
			tooltip?.remove();
		}

		items.forEach((item) => {
			const active = current?.x === item.x;
			const color = active && item.type === "bar" ? highlightColor : item.color;
			drawRectangle({ ...item, canvas, color });
		});
	});

	canvas.addEventListener("mouseout", () => {
		items.forEach((item) => drawRectangle({ ...item, canvas }));
		tooltip?.remove();
	});

	items.forEach((item) => drawRectangle({ ...item, canvas }));

	return canvas;
}

export function renderScatterPlot({
	backgroundColor = "white",
	layers,
	max: forceMax,
	min: forceMin,
	size: canvasSize,
	valueFormatter,
}: RenderScatterPlotProps): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	const items = calculateScatterPlotItems({
		canvasSize,
		forceMax,
		forceMin,
		layers,
		valueFormatter,
	});
	const portal = document.getElementById("portal-root");
	const tooltip = document.createElement("div");

	setup({ backgroundColor, canvas, height: canvasSize, width: canvasSize });
	tooltip.style.setProperty("background-color", "rgba(60, 60, 60, 0.75)");
	tooltip.style.setProperty("color", "white");
	tooltip.style.setProperty("font-size", "12px");
	tooltip.style.setProperty("padding", "2px 8px");
	tooltip.style.setProperty("position", "absolute");
	tooltip.style.setProperty("text-align", "center");

	const render = (items: readonly ScatterPlotItem[]) => {
		items.forEach((item) => {
			if (item.type === "line") drawLine({ ...item, canvas });
			else if (item.type === "plot") drawCircle({ ...item, canvas });
		});
	};

	canvas.addEventListener("mousemove", (event) => {
		const canvasPosition = canvas.getBoundingClientRect();
		const canvasLeft = canvasPosition?.left ?? 0;
		const canvasTop = canvasPosition?.top ?? 0;
		const x = event.clientX;
		const y = event.clientY;
		const current = items.find(
			(item) =>
				item.type === "plot" &&
				x >= item.x - item.size / 2 + canvasLeft &&
				x <= item.x + item.size / 2 + canvasLeft &&
				canvasSize + canvasTop - y >= item.y - item.size / 2 &&
				canvasSize + canvasTop - y <= item.y + item.size / 2
		);

		if (current && current.type === "plot") {
			tooltip.innerHTML = current.value.toString();
			tooltip.setAttribute("aria-label", current.value.toString());
			tooltip.style.setProperty("left", `${x + 8}px`);
			tooltip.style.setProperty("top", `${y - 16}px`);
			portal?.appendChild(tooltip);
		} else {
			tooltip?.remove();
		}

		clear({ canvas });
		render(
			items.map((item) =>
				item.type === "plot"
					? {
							...item,
							color:
								current?.type === "plot" &&
								item.type === "plot" &&
								current.x === item.x
									? item.highlightColor
									: item.defaultColor,
					  }
					: item
			)
		);
	});

	canvas.addEventListener("mouseout", () => {
		clear({ canvas });
		render(
			items.map((item) =>
				item.type === "plot" ? { ...item, color: item.defaultColor } : item
			)
		);
		tooltip?.remove();
	});

	render(items);

	return canvas;
}
