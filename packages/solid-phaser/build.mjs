import path from "path";
import { build } from "vite";
import solidPlugin from "vite-plugin-solid";
import typescript from "@rollup/plugin-typescript";

const imports = [
  { lib: path.resolve(process.cwd(), "src/index.ts"), name: "solid-phaser" },
  {
    lib: path.resolve(process.cwd(), "src/test/index.ts"),
    name: "test/index",
  },
];

imports.forEach(async (item, i) => {
  await build({
    configFile: false,
    build: {
      watch: process.env.WATCH,
      lib: {
        entry: item.lib,
        name: item.name,
        formats: ["cjs", "es"],
        fileName: (format) => `${item.name}.${format}.js`,
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
    define: {
      // preserve process.env checks for consumer build
      "process.env.NODE_ENV": "process.env.NODE_ENV",
    },
    plugins: [
      solidPlugin(),
      i === 0
        ? {
            ...typescript({
              declaration: true,
              emitDeclarationOnly: true,
              outDir: "dist",
              jsx: "preserve",
              jsxImportSource: "solid-js",
              include: ["src/**/*"],
            }),
            apply: "build",
          }
        : null,
    ],
  });
});
