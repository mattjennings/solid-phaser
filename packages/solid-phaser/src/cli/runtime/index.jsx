import * as manifest from "./manifest.js";
import { render } from "solid-js/web";

const Game = manifest.game.component;

render(() => <Game />, document.getElementById("#root"));
