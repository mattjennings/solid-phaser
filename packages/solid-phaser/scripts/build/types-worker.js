const { spawn } = require("child_process");
const { parentPort, workerData } = require("worker_threads");
const { yellow, red } = require("kleur");
const path = require("path");

const { name, outdir, entry, dev } = workerData;

const rootDir = path.parse(entry).dir;

console.log({ entry, outdir });
const child = spawn(
  "tsc",
  [
    entry,
    `--emitDeclarationOnly`,
    `--declaration`,
    `--esModuleInterop`,
    `--jsx`,
    `preserve`,
    `--jsxImportSource`,
    `solid-js`,
    `--outDir`,
    outdir,
    `--rootDir`,
    rootDir,
    ...(dev
      ? [`--tsBuildInfoFile`, `.tmp/ts/${name}`, `--incremental`, `--watch`]
      : []),
  ],
  {
    stdio: "inherit",
  }
);
