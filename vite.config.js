import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.join(import.meta.dirname, "src", "Main.res.mjs"),
      },
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        // chunkFileNames: '[name].js',
        // assetFileNames: '[name].[ext]'
      },
    },
  },
});
