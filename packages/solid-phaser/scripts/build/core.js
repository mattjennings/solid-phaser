const path = require("path");
const build = require("./build.js");

build({
  name: "core",
  entry: path.resolve(__dirname, "../../src/core/index.ts"),
  outdir: path.join(__dirname, "../../dist"),
});
