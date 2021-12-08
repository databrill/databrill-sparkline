import { isValid } from "../color";

describe("isColor", () => {
	it("must validate colors", () => {
		expect(isValid("")).toBeFalsy();
		expect(isValid("unknown")).toBeFalsy();
		expect(isValid("#000")).toBeTruthy();
		expect(isValid("rgb(255, 255, 255)")).toBeTruthy();
	});
});
