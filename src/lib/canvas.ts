interface DrawCircleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color: string;
	readonly x: number;
	readonly y: number;
	readonly size: number;
}

interface DrawRectangleProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly color: string;
	readonly height: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
}

interface SetupProps {
	readonly canvas: HTMLCanvasElement | null;
	readonly height: number;
	readonly width: number;
}

export const drawCircle = (props: DrawCircleProps): void => {
	const { canvas, color, size, x, y } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.fillStyle = color;
	context.arc(x, y, size / 2, 0, 2 * Math.PI, false);
	context.fill();
	context.restore();
};

export const drawRectangle = (props: DrawRectangleProps): void => {
	const { canvas, color, height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.fillStyle = color;
	context.rect(x, y, width, height);
	context.fill();
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
