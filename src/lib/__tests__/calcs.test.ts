import { calculateBarChartItems } from "../calcs";

describe("calcs", () => {
	const barGap = 1;
	const barWidth = 1;
	const canvasHeight = 48;
	const color = "black";
	const zeroColor = "blue";

	it("must calculate bar chart items correctly when both", () => {
		const values = [0, -0.1, 0.2, -0.3];
		const input = { barGap, barWidth, canvasHeight, color, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: barWidth, x: 0, y: 29 },
			{ color: "black", height: 10, value: -0.1, width: barWidth, x: 2, y: 19 },
			{ color: "black", height: 19, value: 0.2, width: barWidth, x: 4, y: 29 },
			{ color: "black", height: 29, value: -0.3, width: barWidth, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when negative", () => {
		const values = [0, -0.1, -0.2, -0.3];
		const input = { barGap, barWidth, canvasHeight, color, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: barWidth, x: 0, y: 48 },
			{ color: "black", height: 16, value: -0.1, width: barWidth, x: 2, y: 32 },
			{ color: "black", height: 32, value: -0.2, width: barWidth, x: 4, y: 16 },
			{ color: "black", height: 48, value: -0.3, width: barWidth, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when positive", () => {
		const values = [0, 0.1, 0.2, 0.3];
		const input = { barGap, barWidth, canvasHeight, color, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: 1, x: 0, y: 0 },
			{ color: "black", height: 16, value: 0.1, width: 1, x: 2, y: 0 },
			{ color: "black", height: 32, value: 0.2, width: 1, x: 4, y: 0 },
			{ color: "black", height: 48, value: 0.3, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when zero", () => {
		const values = [0, 0, 0, 0];
		const input = { barGap, barWidth, canvasHeight, color, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: 1, x: 0, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 2, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 4, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});
});
