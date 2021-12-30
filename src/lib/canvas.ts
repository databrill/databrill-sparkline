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
	readonly size: number;
	readonly values: readonly number[];
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

	canvas.height = height;
	canvas.width = width;
	context.translate(0, height);
	context.scale(1, -1);
};

export const renderBarChart = (props: RenderBarChartProps): HTMLCanvasElement => {
	const { barWidth = 8, color = "black", gap = 0, size, values } = props;
	const canvas = document.createElement("canvas");
	const height = size;
	let items = [];
	const width = (values.length - 1) * (barWidth + gap) + barWidth;
	const max = Math.max(...values);
	const min = Math.min(...values);
	const range = max - min;

	setup({ canvas, height, width });

	if (max < 0 || (max === 0 && min < 0)) {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round(((value - max) * height) / range) || 2);

			return {
				color,
				height: itemHeight,
				value,
				width: barWidth,
				x: index * (barWidth + gap),
				y: height - itemHeight,
			};
		});
	} else if (min >= 0) {
		items = values.map((value, index) => ({
			color,
			height: Math.round(((value - min) * height) / range) || 2,
			value,
			width: barWidth,
			x: index * (barWidth + gap),
			y: 0,
		}));
	} else {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round((value * height) / range)) || 2;
			const zero = Math.round(((range - Math.abs(max)) * height) / range);

			return {
				color,
				height: itemHeight,
				value,
				width: barWidth,
				x: index * (barWidth + gap),
				y: value < 0 ? zero - itemHeight : zero,
			};
		});
	}

	items.forEach((item) => drawRectangle({ ...item, canvas }));

	return canvas;
};
