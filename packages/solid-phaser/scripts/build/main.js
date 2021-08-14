const path = require("path");
const build = require("./build.js");

build({
  name: "index",
  entry: path.resolve(__dirname, "../../src/index.ts"),
  outdir: path.join(__dirname, "../../dist"),
});
