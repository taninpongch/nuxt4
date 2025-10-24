import { defineConfig } from "vite";
import * as path from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import inject from "@rollup/plugin-inject";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [vue(), dts(), cssInjectedByJsPlugin()],
  build: {
    minify: true,
    lib: {
      entry: path.resolve("index.ts"),
      name: "Ui",
      fileName: "ui"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }, resolve: {
    alias: {
      "@": path.resolve(__dirname)
    }
  }
});