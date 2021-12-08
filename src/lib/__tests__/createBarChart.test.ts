import createBarChart from "../createBarChart";

describe("createBarChat", () => {
	it("must have n bars with specific size", () => {
		const values = [0, 1, 2, 3];
		const element = createBarChart({ barWidth: 20, gap: 0, height: 100, values, width: 80 });
		const bars = element?.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect");

		expect(bars?.length).toBe(values.length);
		expect(bars?.[0].getAttribute("height")).toBe("0%");
		expect(bars?.[1].getAttribute("height")).toContain("33.33");
		expect(bars?.[2].getAttribute("height")).toContain("66.66");
		expect(bars?.[3].getAttribute("height")).toBe("100%");
	});

	it("must increase width if gap", () => {
		const barWidth = 20;
		const gap = 4;
		const values = [0, 1, 2, 3];
		const element = createBarChart({ barWidth, gap: 0, height: 100, values, width: 80 });
		const elementWithGap = createBarChart({ barWidth, gap, height: 100, values, width: 92 });

		expect(element).toHaveAttribute("width", `${barWidth * values.length}`);
		expect(elementWithGap).toHaveAttribute(
			"width",
			`${(barWidth + gap) * values.length - gap}`
		);
	});

	it("mustn't render if no values", () => {
		const element = createBarChart({
			barWidth: 20,
			gap: 4,
			height: 100,
			values: [],
			width: 92,
		});

		expect(element).toBeNull();
	});
});
