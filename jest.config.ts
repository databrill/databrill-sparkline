export default {
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!**/.husky/**",
		"!**/.storybook/**",
		"!**/node_modules/**",
	],
	moduleDirectories: ["node_modules", "src"],
	preset: "ts-jest",
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
	testEnvironment: "jsdom",
};
