import { Component } from "solid-js";
import Game from "./phaser/Game";
import Scene from "./phaser/Scene";
import Test from "./Test";

const App: Component = () => {
  return (
    <>
      <Game
        width={256}
        height={224}
        render={{ pixelArt: true }}
        scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
      >
        <Scene
          key="main"
          assets={{
            aseprite: [
              {
                key: "assets/sprites/player",
                atlasURL: "assets/sprites/player.json",
              },
            ],
          }}
          create={(scene) => {
            scene.anims.createFromAseprite("assets/sprites/player");
          }}
        >
          <Test />
        </Scene>
      </Game>
    </>
  );
};

export default App;
