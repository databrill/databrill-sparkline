import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import path from "path";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "Databrill Sparkline",
			fileName: (format) => `databrill-sparkline.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
				},
			},
		},
	},
	plugins: [dts(), react(), tsconfigPaths()],
});
