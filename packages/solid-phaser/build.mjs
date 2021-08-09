import path from "path";
import { build } from "vite";
import solidPlugin from "vite-plugin-solid";
import typescript from "@rollup/plugin-typescript";

const imports = [
  {
    lib: path.resolve(process.cwd(), "src/index.ts"),
    name: "index",
    outDir: "dist",
    typescript: {
      include: ["src/**/*"],
    },
  },
  {
    lib: path.resolve(process.cwd(), "src/test/index.ts"),
    name: "test",
    outDir: "dist/test",
    typescript: {
      include: ["src/test/**/*"],
      // this will throw a warning, but it's the only way to
      // get vite to write to dist/test without doing dist/test/test
      rootDir: "src/test",
    },
  },
];

imports.forEach(async (item, i) => {
  await build({
    configFile: false,
    build: {
      outDir: item.outDir,
      watch: process.env.WATCH,
      lib: {
        entry: item.lib,
        name: item.name,
        formats: ["cjs", "es"],
        fileName: (format) => `${item.name}.${format}.js`,
      },
      rollupOptions: {
        external: ["phaser", "solid-js", "solid-testing-library"],
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
      {
        ...typescript({
          declaration: true,
          emitDeclarationOnly: true,
          outDir: item.outDir,
          jsx: "preserve",
          jsxImportSource: "solid-js",
          ...item.typescript,
        }),
        apply: "build",
      },
    ],
  });
});
