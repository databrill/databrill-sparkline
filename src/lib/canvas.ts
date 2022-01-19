/* eslint-disable @typescript-eslint/ban-ts-comment */

import { calculateBarChartItems } from "./calcs";

interface DrawCircleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly x: number;
	readonly y: number;
	readonly size: number;
}

interface DrawLineProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly fromX: number;
	readonly fromY: number;
	readonly toX: number;
	readonly toY: number;
}

interface DrawRectangleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly height: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
}

interface DrawTextProps {
	readonly align?: "center" | "left" | "right";
	readonly canvas: HTMLCanvasElement | null;
	readonly color?: string;
	readonly value: string;
	readonly x: number;
	readonly y: number;
}

export interface RenderBarChartProps {
	readonly barGap?: number;
	readonly barWidth?: number;
	readonly color?: string;
	readonly highlightColor?: string;
	readonly min?: number;
	readonly size: number;
	readonly values: readonly number[];
	readonly zeroColor?: string;
}

interface SetupProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly height: number;
	readonly width: number;
}

export const drawCircle = (props: DrawCircleProps): void => {
	const { canvas, color = "black", size, x, y } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, size / 2, 0, 2 * Math.PI, false);
	context.fill();
	context.restore();
};

export const drawLine = (props: DrawLineProps): void => {
	const { canvas, color = "black", fromX, fromY, toX, toY } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.beginPath();
	context.strokeStyle = color;
	context.moveTo(fromX, fromY);
	context.lineTo(toX, toY);
	context.stroke();
	context.restore();
};

export const drawRectangle = (props: DrawRectangleProps): void => {
	const { canvas, color = "black", height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.restore();
};

export const drawRectangleOutline = (props: DrawRectangleProps): void => {
	const { canvas, color = "black", height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.strokeStyle = color;
	context.strokeRect(x, y, width, height);
	context.restore();
};

export const drawText = (props: DrawTextProps): void => {
	const { align = "left", canvas, color = "black", value, x, y } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.fillStyle = color;
	context.font = "14px Arial";
	context.textAlign = align;
	context.translate(x, y);
	context.scale(1, -1);
	context.fillText(value, 0, 0);
	context.restore();
};

export const setup = (props: SetupProps): void => {
	const { canvas, height, width } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	canvas.setAttribute("height", `${height}px`);
	canvas.setAttribute("width", `${width}px`);
	context.translate(0, height);
	context.scale(1, -1);
};

export const renderBarChart = ({
	barGap = 0,
	barWidth = 8,
	color = "black",
	highlightColor = "red",
	min: forceMin,
	size: canvasHeight,
	values,
	zeroColor = "black",
}: RenderBarChartProps): HTMLCanvasElement => {
	const canvas = document.createElement("canvas");
	// prettier-ignore
	const items = calculateBarChartItems({ barGap, barWidth, canvasHeight, color, forceMin, values, zeroColor });
	const portal = document.getElementById("portal-root");
	const tooltip = document.createElement("div");
	const canvasWidth = (values.length - 1) * (barGap + barWidth) + barWidth;

	setup({ canvas, height: canvasHeight, width: canvasWidth });
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
		// prettier-ignore
		const current = items.find((item) => x >= item.x + canvasLeft + canvasClientLeft && x <= item.x + item.width + canvasLeft + canvasClientLeft);

		if (current) {
			tooltip.innerHTML = current.value.toString();
			tooltip.setAttribute("aria-label", current.value.toString());
			tooltip.style.setProperty("left", `${x + 8}px`);
			tooltip.style.setProperty("top", `${y - 16}px`);
			portal?.appendChild(tooltip);
		} else {
			tooltip?.remove();
		}

		// @ts-ignore
		items.forEach((item) => {
			const active = current?.x === item.x;
			drawRectangle({ ...item, canvas, color: active ? highlightColor : item.color });
		});
	});

	canvas.addEventListener("mouseout", () => {
		// @ts-ignore
		items.forEach((item) => drawRectangle({ ...item, canvas }));
		tooltip?.remove();
	});

	items.forEach((item) => drawRectangle({ ...item, canvas }));

	return canvas;
};
