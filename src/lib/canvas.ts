interface DrawProps {
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

export const draw = (props: DrawProps): void => {
	const { canvas, color, height, x, y, width } = props;
	const context = canvas?.getContext("2d");

	if (!(canvas && context)) return;

	context.save();
	context.fillStyle = color;
	context.clearRect(x, y, width, height);
	context.fillRect(x, y, width, height);
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
