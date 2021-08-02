import { Component, createEffect } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import Game from "./phaser/Game";
import Scene, { useScene } from "./phaser/Scene";
import Text from "./phaser/Text";
import { createSignal } from "solid-js";

const App: Component = () => {
  return (
    <Game width={500} height={500}>
      <Scene key="main" asdf={true}>
        <Children />
      </Scene>
    </Game>
  );
};

function Children() {
  const scene = useScene();
  const [style, setStyle] = createSignal({
    fontSize: "64px",
    fontFamily: "Arial",
    color: "#ffffff",
    align: "center",
    backgroundColor: "#ff0000",
  });

  const [color, setColor] = createSignal("#ff0000");

  return (
    <Text
      x={0}
      y={0}
      text="hello"
      onUpdate={(self) => {
        self.x += 1;
      }}
      style={{
        color: color(),
      }}
    />
  );
}
export default App;
