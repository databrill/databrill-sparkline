import createBarChart from "../createBarChart";
import drawImage from "../drawImage";

describe("drawImage", () => {
	it("must draw bar chart", () => {
		const blank = document.createElement("canvas");
		const height = 50;
		const width = 92;
		const canvas = document.createElement("canvas");
		canvas.setAttribute("height", `${height}`);
		canvas.setAttribute("width", `${width}`);

		const image = createBarChart({
			barWidth: 20,
			gap: 0,
			height,
			values: [0, 1, 2, 3],
			width,
		});

		// eslint-disable-next-line
		// @ts-ignore
		drawImage({ component: image, container: canvas });

		expect(canvas.toDataURL()).not.toBe(blank.toDataURL());
	});
});
