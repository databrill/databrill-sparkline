import { render } from "@testing-library/react";
import { ScatterPlot } from "../ScatterPlot";

describe("ScatterPlot", () => {
	it("must accept custom classes", () => {
		const className = "jest";
		const { container } = render(
			<ScatterPlot className={className} size={64} x={[1]} y={[1]} />
		);
		const component = container.getElementsByClassName(className)[0];

		expect(component).toBeInTheDocument();
	});
});
