import { setup } from "lib/canvas";

describe("canvas", () => {
	it("must increase width if gap", () => {
		const canvas = document.createElement("canvas");
		const canvasWithGap = document.createElement("canvas");
		const gap = 4;
		const itemColor = "black";
		const itemWidth = 20;
		const items = [0, 1, 2, 3];

		setup({
			canvas,
			gap: 0,
			height: 100,
			itemColor,
			items,
			itemWidth,
			width: 80,
		});

		setup({
			canvas: canvasWithGap,
			gap,
			height: 100,
			itemColor,
			items,
			itemWidth,
			width: 92,
		});

		expect(canvas).toHaveAttribute("width", `${items.length * itemWidth}`);
		expect(canvasWithGap).toHaveAttribute("width", `${items.length * (itemWidth + gap) - gap}`);
	});

	it("must draw bar chart", () => {
		const blank = document.createElement("canvas");
		const height = 50;
		const width = 92;
		const canvas = document.createElement("canvas");
		canvas.setAttribute("height", `${height}`);
		canvas.setAttribute("width", `${width}`);

		setup({
			canvas,
			gap: 0,
			height: 100,
			itemColor: "black",
			items: [1, 2, 3, 4],
			itemWidth: 20,
			width: 80,
		});

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});
});
