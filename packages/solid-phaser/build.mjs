import path from "path";
import { build } from "vite";
import fs from "fs";
import solidPlugin from "vite-plugin-solid";
import typescript from "@rollup/plugin-typescript";
import nodeExternals from "rollup-plugin-node-externals";

const pkg = JSON.parse(fs.readFileSync("./package.json").toString("utf8"));

const imports = [
  // {
  //   lib: path.resolve(process.cwd(), "src/core/index.ts"),
  //   name: "index",
  //   outDir: "dist",
  //   typescript: {
  //     include: ["src/**/*"],
  //     rootDir: "src/core",
  //   },
  // },
  // {
  //   lib: path.resolve(process.cwd(), "src/test/index.ts"),
  //   name: "index",
  //   outDir: "dist/test",
  //   typescript: {
  //     include: ["src/test/**/*"],
  //     rootDir: "src/test",
  //   },
  // },
  {
    lib: path.resolve(process.cwd(), "src/cli/index.ts"),
    name: "index",
    outDir: "dist/cli",
    formats: ["cjs"],
    target: "node12",
    typescript: {
      include: ["src/cli/**/*"],
      rootDir: "src/cli",
    },
  },
];

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

imports.forEach(async (item, i) => {
  await build({
    configFile: false,
    build: {
      target: item.target,
      outDir: item.outDir,
      watch: process.env.WATCH,
      minify: process.env.NODE_ENV === "production",

      lib: {
        entry: item.lib,
        name: item.name,
        formats: item.formats ?? ["cjs", "es"],
        fileName: (format) => `${item.name}.${format}.js`,
      },
      rollupOptions: {
        external,
        output: {
          sourcemap: true,
          globals: {
            phaser: "Phaser",
          },
        },
      },
    },
    optimizeDeps: {
      exclude: external,
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

          // the rootDir passed in here will cause warnings, but it's fine
          ...item.typescript,
        }),
        apply: "build",
      },
    ],
  });
});
