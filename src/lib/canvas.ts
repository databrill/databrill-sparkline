import { isValid } from "./color";

interface DrawProps {
	readonly color: string;
	readonly context: CanvasRenderingContext2D;
	readonly height: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
}

interface SetupProps {
	readonly canvas: HTMLCanvasElement;
	gap: number;
	readonly height: number;
	readonly items: readonly number[];
	itemColor: string;
	itemWidth: number;
	readonly width: number;
}

export const draw = (props: DrawProps): void => {
	const { color, context, height, x, y, width } = props;

	context.save();
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.restore();
};

export const setup = (props: SetupProps): void => {
	const { canvas, height, items, width } = props;
	let { gap, itemColor, itemWidth } = props;
	const context = canvas.getContext("2d");
	const max = Math.max(...items);
	const min = Math.min(...items);
	const total = Math.abs(max) + Math.abs(min);

	if (gap < 0) gap = 0;
	if (!isValid(itemColor)) itemColor = "black";
	if (itemWidth < 1) itemWidth = 1;

	canvas.height = height;
	canvas.width = width;

	if (!context) return;

	context.clearRect(0, 0, width, height);
	context.translate(0, height);
	context.scale(1, -1);

	for (let index = 0; index < items.length; index++) {
		const item = items[index];
		const itemHeight = (Math.abs(item) * height) / total;
		const x = index === 0 ? index * itemWidth : index * (itemWidth + gap);
		const y =
			item > 0
				? (Math.abs(min) * height) / total
				: (Math.abs(min) * height) / total - itemHeight;

		draw({
			color: itemColor,
			context,
			height: itemHeight,
			x,
			y,
			width: itemWidth,
		});
	}
};
