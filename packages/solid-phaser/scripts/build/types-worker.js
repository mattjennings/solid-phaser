const { spawn } = require("child_process");
const { workerData } = require("worker_threads");
const { dev } = workerData;

const child = spawn(
  "tsc",
  [
    `--project`,
    `tsconfig.build.json`,
    ...(dev
      ? [
          `--tsBuildInfoFile`,
          `.tmp/ts`,
          `--incremental`,
          `--watch`,
          `--preserveWatchOutput`,
          `--pretty`,
        ]
      : []),
  ],
  {
    stdio: "inherit",
  }
);

child.on("exit", (code, signal) => {
  if (code) {
    throw Error(`Exit code ${code}`);
  } else if (signal) {
    throw Error(`Killed with signal ${signal}`);
  }
});
