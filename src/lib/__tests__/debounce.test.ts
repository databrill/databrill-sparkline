import { debounce } from "../debounce";

jest.useFakeTimers();

describe("debounce", () => {
	it("must debounce handler", async () => {
		const handler = jest.fn();
		const call = debounce(handler, 100);

		call();
		call();
		jest.runAllTimers();

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("mustn't be called if cancel function fired", () => {
		const handler = jest.fn();
		const call = debounce(handler, 100);

		call();
		call();
		call.cancel();
		jest.runAllTimers();

		expect(handler).not.toHaveBeenCalled();
	});
});
