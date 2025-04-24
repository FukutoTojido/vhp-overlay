import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	plugins: [tailwindcss()],
	build: {
		target: "esnext", //browsers can handle the latest ES features
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
});
