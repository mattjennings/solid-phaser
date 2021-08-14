const { spawn } = require("child_process");
const { workerData } = require("worker_threads");
const { dev } = workerData;

spawn(
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
