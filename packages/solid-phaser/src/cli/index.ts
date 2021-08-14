import sade from "sade";
import dev from "./commands/dev";
// import build from "./commands/build";
const prog = sade("phelte");

prog.version("0.0.1");

prog.command("dev").option("--port, -p", "Port to listen on").action(dev);

// prog.command("build").action(build);

prog.parse(process.argv);
