import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
});
