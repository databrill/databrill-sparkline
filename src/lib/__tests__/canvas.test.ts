import { draw, setup } from "lib/canvas";

describe("canvas", () => {
	it("must setup size", () => {
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas, height, width });
		draw({ canvas, color: "black", height: 4, width: 4, x: 0, y: 0 });

		expect(canvas.height).toBe(height);
		expect(canvas.width).toBe(width);
	});

	it("must draw a square", () => {
		const blank = document.createElement("canvas");
		const canvas = document.createElement("canvas");
		const height = 50;
		const width = 92;

		setup({ canvas: blank, height, width });
		setup({ canvas, height, width });
		draw({ canvas, color: "black", height: 4, width: 4, x: 0, y: 0 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});
});
