import { render } from "@testing-library/react";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
	it("must render correctly", () => {
		const left = 0;
		const top = 0;
		const value = 0;
		const { container } = render(
			<Tooltip hidden={false} left={left} top={top} value={value} />
		);
		const component = container.getElementsByTagName("div")[0];

		expect(component?.innerHTML).toBe(`${value}`);
		expect(component?.style.left).toBe(`${left}px`);
		expect(component?.style.top).toBe(`${top}px`);
	});

	it("mustn't render if hidden", () => {
		const { container } = render(<Tooltip hidden left={0} top={0} value={0} />);
		const component = container.getElementsByTagName("div")[0];

		expect(component).toBeUndefined();
	});
});
