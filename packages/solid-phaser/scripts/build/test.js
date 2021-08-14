const path = require("path");
const build = require("./build.js");

build({
  name: "test",
  entry: path.resolve(__dirname, "../../src/test/index.ts"),
  outdir: path.join(__dirname, "../../dist/test"),
});
