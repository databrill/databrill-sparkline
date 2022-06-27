import { render } from "@testing-library/react";
import { ScatterPlot } from "../ScatterPlot";

describe("ScatterPlot", () => {
	it("must accept custom classes", () => {
		const className = "jest";
		const { container } = render(<ScatterPlot className={className} layers={[]} size={64} />);
		const component = container.getElementsByClassName(className)[0];

		expect(component).toBeInTheDocument();
	});
});
