import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      ...typescript({
        declaration: true,
        emitDeclarationOnly: true,
        outDir: "dist",
        jsx: "preserve",
        jsxImportSource: "solid-js",
        include: ["src/**/*"],
      }),
      apply: "build",
    },
  ],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "solid-phaser",
      fileName: (format) => `solid-phaser.${format}.js`,
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: ["phaser", "solid-js"],
      output: {
        sourcemap: true,

        globals: {
          phaser: "Phaser",
        },
      },
    },
  },
});
