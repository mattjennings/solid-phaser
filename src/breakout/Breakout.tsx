import { Component } from "solid-js";
import Game from "solid-phaser/Game";
import Scene from "solid-phaser/Scene";
import Paddle from "./Paddle";

const Breakout: Component = () => {
  return (
    <>
      <Paddle x={400} y={700} />
    </>
  );
};

export default () => (
  <Game
    width={800}
    height={800}
    physics={{
      default: "arcade",
      arcade: {
        debug: true,
      },
    }}
    scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
  >
    <Scene
      key="main"
      assets={{
        atlas: [
          {
            key: "breakout",
            atlasURL: "assets/breakout/breakout.json",
            textureURL: "assets/breakout/breakout.png",
          },
        ],
      }}
      create={(scene) => {
        scene.anims.createFromAseprite("assets/sprites/player");
      }}
    >
      <Breakout />
    </Scene>
  </Game>
);
