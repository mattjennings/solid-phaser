require("./main");
require("./cli");
require("./test");
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
