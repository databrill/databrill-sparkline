import { render } from "@testing-library/react";
import { BarChart } from "../BarChart";

describe("BarChart", () => {
	it("must accept custom classes", () => {
		const className = "jest";
		const { container } = render(<BarChart className={className} layers={[]} size={64} />);
		const component = container.getElementsByClassName(className)[0];

		expect(component).toBeInTheDocument();
	});
});
