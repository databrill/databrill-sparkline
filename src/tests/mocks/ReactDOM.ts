jest.mock("react-dom", () => ({
	...jest.requireActual("react-dom"),
	createPortal: jest.fn((element) => element),
}));

export {};
