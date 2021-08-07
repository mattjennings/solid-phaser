import {
  Component,
  createEffect,
  createSignal,
  Index,
  onMount,
} from "solid-js";
import { onInputEvent, onSceneEvent } from "solid-phaser/events";
import Game from "solid-phaser/Game";
import Scene from "solid-phaser/Scene";
import Ball from "./Ball";
import Block from "./Block";
import Paddle from "./Paddle";

const Breakout: Component = () => {
  let ball: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  let paddle: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;

  let [blocks, setBlocks] = createSignal<
    Array<{ x: number; y: number; key: number; frame: string }>
  >([]);
  let [ballLaunched, setBallLaunched] = createSignal(false);

  // setup the game
  onMount(() => {
    restart();
  });
  // move ball with paddle until user launches
  onSceneEvent("update", () => {
    if (!ballLaunched()) {
      ball.setPosition(paddle.x, paddle.y - 48);
    }
  });

  // launch ball on click
  onInputEvent("pointerdown", () => {
    if (!ballLaunched()) {
      setBallLaunched(true);
      ball.body.setVelocity(-75, -600);
    }
  });

  // if all blocks are gone, you win
  createEffect(() => {
    if (ballLaunched() && blocks().length === 0) {
      alert("You win!");
      restart();
    }
  });

  function restart() {
    setBallLaunched(false);
    ball.body.setVelocity(0);
    ball.setX(400);
    ball.setY(650);

    setBlocks(
      // create an array of 60 blocks
      Array.from({ length: 60 }).map((_, index) => {
        // possible sprites to use for block
        const blockFrames = [
          "blue1",
          "red1",
          "green1",
          "yellow1",
          "silver1",
          "purple1",
        ];

        return {
          x: (index % 10) * 64,
          y: 10 * Math.floor(index / 10) * 3.2,
          // each row uses same sprite frame
          frame: blockFrames[Math.floor(index / 10)],
          key: index,
        };
      })
    );
  }

  return (
    <>
      <Ball
        ref={ball}
        x={400}
        y={650}
        onGameOver={() => {
          alert("You lose :(");
          restart();
        }}
      />
      <Paddle ref={paddle} x={400} y={700} />
      <Index each={blocks()}>
        {(block, index) => (
          <Block
            x={block().x + 116}
            y={block().y + 200}
            frame={block().frame}
            onCollide={() =>
              setBlocks((prev) => prev.filter((_, i) => i !== index))
            }
          />
        )}
      </Index>
    </>
  );
};

// wrap Breakout in <Game /> and <Scene /> so we can consume them through context
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
