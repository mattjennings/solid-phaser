import { Component, createSignal, For } from "solid-js";
import { onSceneEvent } from "solid-phaser/events";
import Game from "solid-phaser/Game";
import Scene, { useScene } from "solid-phaser/Scene";
import Text from "solid-phaser/Text";
import Ball from "./Ball";
import Paddle from "./Paddle";

const Breakout: Component = () => {
  return (
    <>
      <Ball x={400} y={650} />
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
        debug: false,
        fps: 60,
      },
    }}
    fps={{
      target: 60,
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
        scene.physics.world.setBoundsCollision(true, true, true, true);
        scene.anims.createFromAseprite("assets/sprites/player");
      }}
    >
      <Breakout />
    </Scene>
  </Game>
);
