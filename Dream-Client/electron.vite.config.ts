import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "electron/main/index.ts"),
                },
            },
        },
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "electron/preload/index.ts"),
                },
            },
        },
    },
    renderer: {
        root: ".",
        base: "./",
        plugins: [react(), tsconfigPaths()],
        optimizeDeps: {
            exclude: ["@react-three/rapier"],
        },
        assetsInclude: ["**/*.glb"],
        server: {
            port: 3000,
        },
        build: {
            outDir: "out/renderer",
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "index.html"),
                },
            },
        },
    },
});
