require("./main");
require("./cli");
require("./test");

// generate types
const { Worker } = require("worker_threads");

const worker = new Worker("./scripts/build/types-worker.js", {
  workerData: {
    dev: process.env.NODE_ENV !== "production",
  },
});

worker.postMessage("build");
worker.on("error", (error) => {
  console.error(red(error.stack));
});
