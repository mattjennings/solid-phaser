import { Component } from "solid-js";
import { onSceneEvent } from "solid-phaser/events";
import Game from "solid-phaser/Game";
import Scene from "solid-phaser/Scene";
import Ball from "./Ball";
import Paddle from "./Paddle";

const Breakout: Component = () => {
  // onSceneEvent(
  //   Phaser.Scenes.Events.ADDED_TO_SCENE,
  //   async (object: Phaser.GameObjects.GameObject) => {
  //     debugger;
  //   }
  // );

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
        scene.physics.world.setBoundsCollision(true, true, true, false);
        scene.anims.createFromAseprite("assets/sprites/player");
      }}
    >
      <Breakout />
    </Scene>
  </Game>
);
