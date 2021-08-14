const { solidPlugin } = require("esbuild-plugin-solid");
const esbuild = require("esbuild");
const { performance } = require("perf_hooks");
const { green, red } = require("kleur");
const start = performance.now();
const { Worker } = require("worker_threads");

const external = [
  ...Object.keys(require("../../package.json").dependencies),
  ...Object.keys(require("../../package.json").peerDependencies),
  "path",
  "fs",
];

module.exports = ({ name, entry, outdir }) => {
  //Create new worker
  const worker = new Worker("./scripts/build/types-worker.js", {
    workerData: {
      name,
      entry,
      outdir,
      dev: process.env.NODE_ENV !== "production",
    },
  });

  //Listen for a message from worker
  worker.postMessage("build");
  worker.on("error", (error) => {
    console.error(red(error.stack));
  });

  esbuild
    .build({
      plugins: [solidPlugin()],
      platform: "node",
      format: "cjs",
      incremental: process.env.NODE_ENV !== "production",
      bundle: true,
      outdir,
      sourcemap: true,
      watch:
        process.env.NODE_ENV === "production"
          ? false
          : {
              onRebuild: () => {
                console.log(green(`Rebuilt CLI`));
              },
            },
      external,
      entryPoints: [entry],
      outdir,
    })
    .then(({ stop }) => {
      console.log(
        green(`Built ${name} in ${Math.floor(performance.now() - start)}ms`)
      );

      process.on("exit", () => {
        if (stop) {
          stop();
        }
      });
    });
};
