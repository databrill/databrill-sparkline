import { calculateBarChartItems } from "../calcs";

describe("calcs", () => {
	it("must calculate bar chart items correctly when negative", () => {
		const barGap = 1;
		const barWidth = 1;
		const color = "black";
		const height = 48;
		const zeroColor = "blue";
		const values = [0, -0.1, 0.2, -0.3];
		const input = { barGap, barWidth, color, height, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: barWidth, x: 0, y: 29 },
			{ color: "black", height: 10, value: -0.1, width: barWidth, x: 2, y: 19 },
			{ color: "black", height: 20, value: 0.2, width: barWidth, x: 4, y: 29 },
			{ color: "black", height: 29, value: -0.3, width: barWidth, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when negative", () => {
		const barGap = 1;
		const barWidth = 1;
		const color = "black";
		const height = 48;
		const zeroColor = "blue";
		const values = [0, -0.1, -0.2, -0.3];
		const input = { barGap, barWidth, color, height, values, zeroColor };
		const output = [
			{ color: "blue", height: 1, value: 0, width: barWidth, x: 0, y: 47 },
			{ color: "black", height: 17, value: -0.1, width: barWidth, x: 2, y: 31 },
			{ color: "black", height: 33, value: -0.2, width: barWidth, x: 4, y: 15 },
			{ color: "black", height: 49, value: -0.3, width: barWidth, x: 6, y: -1 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when positive", () => {
		const input = {
			barGap: 1,
			barWidth: 1,
			color: "black",
			height: 48,
			values: [0, 0.1, 0.2, 0.3],
			zeroColor: "blue",
		};
		const output = [
			{ color: "blue", height: 1, value: 0, width: 1, x: 0, y: 0 },
			{ color: "black", height: 17, value: 0.1, width: 1, x: 2, y: 0 },
			{ color: "black", height: 33, value: 0.2, width: 1, x: 4, y: 0 },
			{ color: "black", height: 49, value: 0.3, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});

	it("must calculate bar chart items correctly when zero", () => {
		const input = {
			barGap: 1,
			barWidth: 1,
			color: "black",
			height: 48,
			values: [0, 0, 0, 0],
			zeroColor: "blue",
		};
		const output = [
			{ color: "blue", height: 1, value: 0, width: 1, x: 0, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 2, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 4, y: 0 },
			{ color: "blue", height: 1, value: 0, width: 1, x: 6, y: 0 },
		];

		expect(calculateBarChartItems(input)).toStrictEqual(output);
	});
});
