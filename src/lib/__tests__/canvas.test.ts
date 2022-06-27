import {
	clear,
	drawCircle,
	drawLine,
	drawRectangle,
	drawRectangleOutline,
	drawText,
	renderBarChart,
	renderScatterPlot,
	setup,
} from "../canvas";

describe("canvas", () => {
	it("must draw a circle", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawCircle({ canvas, size: 4, x: 0, y: 0 });
		clear({ canvas });

		expect(canvas.toDataURL()).toBe(blank.toDataURL());
	});

	it("must draw a circle", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawCircle({ canvas, size: 4, x: 0, y: 0 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});

	it("must draw a line", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawLine({ canvas, fromX: 10, fromY: 10, toX: 20, toY: 20 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});

	it("must draw a rectangle", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawRectangle({ canvas, height: 4, width: 4, x: 0, y: 0 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});

	it("must draw a rectangle outline", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawRectangleOutline({ canvas, height: 4, width: 4, x: 0, y: 0 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});

	it("must draw a text", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		drawText({ canvas, value: "Jest", x: 10, y: 10 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});

	it("must render a bar chart in a canvas", () => {
		const canvas = renderBarChart({ layers: [], size: 64 });

		expect(canvas).toBeDefined();
	});

	it("must render a scatter plot in a canvas", () => {
		const canvas = renderScatterPlot({ layers: [], size: 64 });

		expect(canvas).toBeDefined();
	});

	it("must setup size", () => {
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas, height, width });

		expect(canvas.height).toBe(height);
		expect(canvas.width).toBe(width);
	});
});
