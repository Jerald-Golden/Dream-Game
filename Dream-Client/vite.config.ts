import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
        exclude: ["@react-three/rapier"],
    },
    assetsInclude: ["**/*.glb"],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: "dist",
    },
});
