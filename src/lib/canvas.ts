/* eslint-disable @typescript-eslint/ban-ts-comment */

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

interface RenderBarChartProps {
	readonly barWidth?: number;
	readonly color?: string;
	readonly gap?: number;
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
	barWidth = 8,
	color = "black",
	gap = 0,
	highlightColor = "red",
	min: forceMin,
	size,
	values,
	zeroColor = "black",
}: RenderBarChartProps): HTMLCanvasElement => {
	const canvas = document.createElement("canvas");
	const height = size;
	const minBarHeight = 1;
	// @ts-ignore
	let items = [];
	const max = Math.max(...values);
	const min = forceMin ?? Math.min(...values);
	const portal = document.getElementById("portal-root");
	const range = max - min;
	const tooltip = document.createElement("div");
	const width = (values.length - 1) * (barWidth + gap) + barWidth;

	setup({ canvas, height, width });
	tooltip.style.setProperty("background-color", "rgba(60, 60, 60, 0.75)");
	tooltip.style.setProperty("color", "white");
	tooltip.style.setProperty("font-size", "12px");
	tooltip.style.setProperty("padding", "2px 8px");
	tooltip.style.setProperty("position", "absolute");
	tooltip.style.setProperty("text-align", "center");

	if (max <= 0 && min < 0) {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round(((value - max) * height) / range));

			return {
				color: value === 0 ? zeroColor : color,
				height: itemHeight + minBarHeight,
				value,
				width: barWidth,
				x: index * (barWidth + gap),
				y: height - itemHeight - minBarHeight,
			};
		});
	} else if (min >= 0) {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round(((value - min) * height) / range));

			return {
				color: value === 0 ? zeroColor : color,
				height: itemHeight + minBarHeight,
				value,
				width: barWidth,
				x: index * (barWidth + gap),
				y: 0,
			};
		});
	} else {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round((value * height) / range));
			const zero = Math.round(((range - Math.abs(max)) * height) / range);

			return {
				color: value === 0 ? zeroColor : color,
				height: value >= 0 ? itemHeight + minBarHeight : itemHeight,
				value,
				width: barWidth,
				x: index * (barWidth + gap),
				y: value < 0 ? zero - itemHeight : zero,
			};
		});
	}

	canvas.addEventListener("mousemove", (event) => {
		const canvasPosition = canvas.getBoundingClientRect();
		const canvasClientLeft = canvas.clientLeft ?? 0;
		const canvasLeft = canvasPosition.left ?? 0;

		const x = event.clientX;
		const y = event.clientY;
		// @ts-ignore
		// prettier-ignore
		const current = items.find((item) => x >= item.x + canvasLeft + canvasClientLeft && x <= item.x + item.width + canvasLeft + canvasClientLeft);

		if (current) {
			tooltip.innerHTML = current.value;
			tooltip.setAttribute("aria-label", current.value);
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
