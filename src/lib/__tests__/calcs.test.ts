/* eslint-disable @typescript-eslint/prefer-as-const */

import { calculateBarChartItems } from "../calcs";

describe("calcs", () => {
	// prettier-ignore
	const common = { annotationColor: "blue", barColor: "black", barGap: 1, barWidth: 1, canvasHeight: 48, zeroColor: "blue" };

	it("must calculate bar chart items correctly when both", () => {
		const layers = [{ type: "bars" as "bars", values: [0, -0.1, 0.2, -0.3] }];
		const input = { ...common, layers };
		const output = [
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 0, y: 29 },
			{ color: "black", height: 10, type: "bar", value: -0.1, width: 1, x: 2, y: 19 },
			{ color: "black", height: 19, type: "bar", value: 0.2, width: 1, x: 4, y: 29 },
			{ color: "black", height: 29, type: "bar", value: -0.3, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when negative", () => {
		const layers = [{ type: "bars" as "bars", values: [0, -0.1, -0.2, -0.3] }];
		const input = { ...common, layers };
		const output = [
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 0, y: 48 },
			{ color: "black", height: 16, type: "bar", value: -0.1, width: 1, x: 2, y: 32 },
			{ color: "black", height: 32, type: "bar", value: -0.2, width: 1, x: 4, y: 16 },
			{ color: "black", height: 48, type: "bar", value: -0.3, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when positive", () => {
		const layers = [{ type: "bars" as "bars", values: [0, 0.1, 0.2, 0.3] }];
		const input = { ...common, layers };
		const output = [
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 0, y: 0 },
			{ color: "black", height: 16, type: "bar", value: 0.1, width: 1, x: 2, y: 0 },
			{ color: "black", height: 32, type: "bar", value: 0.2, width: 1, x: 4, y: 0 },
			{ color: "black", height: 48, type: "bar", value: 0.3, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when zero", () => {
		const layers = [{ type: "bars" as "bars", values: [0, 0, 0, 0] }];
		const input = { ...common, layers };
		const output = [
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 0, y: 0 },
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 2, y: 0 },
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 4, y: 0 },
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when multiple layers", () => {
		const layers = [
			{ type: "bars" as "bars", values: [0, 5, 10, 15] },
			{ type: "annotations" as "annotations", values: [0, 5, 10, 15] },
		];
		const input = { ...common, layers };
		const output = [
			{ color: "blue", height: 1, type: "bar", value: 0, width: 1, x: 0, y: 0 },
			{ color: "black", height: 16, type: "bar", value: 5, width: 1, x: 2, y: 0 },
			{ color: "black", height: 32, type: "bar", value: 10, width: 1, x: 4, y: 0 },
			{ color: "black", height: 48, type: "bar", value: 15, width: 1, x: 6, y: 0 },
			{ color: "blue", height: 1, type: "annotation", value: 0, width: 1, x: 0, y: 0 },
			{ color: "blue", height: 1, type: "annotation", value: 5, width: 1, x: 2, y: 15 },
			{ color: "blue", height: 1, type: "annotation", value: 10, width: 1, x: 4, y: 31 },
			{ color: "blue", height: 1, type: "annotation", value: 15, width: 1, x: 6, y: 47 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});
});
