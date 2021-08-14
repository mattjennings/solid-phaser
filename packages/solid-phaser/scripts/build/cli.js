const path = require("path");
const build = require("./build.js");

build({
  name: "cli",
  entry: path.resolve(__dirname, "../../src/cli/index.ts"),
  outdir: path.join(__dirname, "../../dist/cli"),
});
