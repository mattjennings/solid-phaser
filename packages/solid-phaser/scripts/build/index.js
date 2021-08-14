const build = require("./build");
const path = require("path");

build({
  name: "main",
  entry: path.resolve(__dirname, "../../src/index.ts"),
  outdir: path.join(__dirname, "../../dist"),
});

build({
  name: "cli",
  entry: path.resolve(__dirname, "../../src/cli/index.ts"),
  outdir: path.join(__dirname, "../../dist/cli"),
});

build({
  name: "test",
  entry: path.resolve(__dirname, "../../src/test/index.ts"),
  outdir: path.join(__dirname, "../../dist/test"),
});

build({
  name: "router",
  entry: path.resolve(__dirname, "../../src/router/index.ts"),
  outdir: path.join(__dirname, "../../dist/router"),
});

const { red } = require("kleur");
// generate types
const { Worker } = require("worker_threads");

const dev = process.env.NODE_ENV !== "production";

const worker = new Worker("./scripts/build/types-worker.js", {
  workerData: {
    dev,
  },
});

worker.postMessage("build");
worker.on("error", (error) => {
  console.error(red(error.stack));

  if (!dev) {
    process.exit(1);
  }
});
