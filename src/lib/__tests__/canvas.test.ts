import { draw, setup } from "lib/canvas";

describe("canvas", () => {
	it("must draw bar chart", () => {
		const blank = document.createElement("canvas");
		const height = 50;
		const width = 92;
		const canvas = document.createElement("canvas");
		canvas.setAttribute("height", `${height}`);
		canvas.setAttribute("width", `${width}`);

		setup({ canvas, height: 100, width: 80 });
		draw({ canvas, color: "black", height: 4, width: 4, x: 0, y: 0 });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});
});
