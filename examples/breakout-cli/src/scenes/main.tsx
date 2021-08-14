import { createEffect, createSignal, Index, onMount, Show } from "solid-js";
import {
  Assets,
  createTween,
  onInputEvent,
  onSceneEvent,
  Text,
} from "solid-phaser";
import Ball from "../components/Ball";
import Block from "../components/Block";
import Paddle from "../components/Paddle";

export const assets: Assets = {
  atlas: ["breakout.json"],
};

export const create = (scene) => {
  scene.physics.world.setBoundsCollision(true, true, true, true);
};

export default function Breakout() {
  let ball: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
  let paddle: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;

  const [blocks, setBlocks] = createSignal<
    Array<{ x: number; y: number; key: number; frame: string }>
  >([]);
  const [ballLaunched, setBallLaunched] = createSignal(false);

  const [gameOver, setGameOver] = createSignal(false);
  const [youWin, setYouWin] = createSignal(false);

  // if all blocks are gone, you win
  createEffect(() => {
    if (!gameOver() && ballLaunched() && blocks().length === 0) {
      setYouWin(true);
    }
  });

  // setup the game
  createEffect(() => {
    if (!gameOver() && !youWin()) {
      setup();
    } else {
      ball.body.setVelocity(0);
    }
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

  function setup() {
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
      <Show when={gameOver()}>
        <Message text="Game Over :(" onClick={() => setGameOver(false)} />
      </Show>
      <Show when={youWin()}>
        <Message text="You win!!" onClick={() => setYouWin(false)} />
      </Show>

      <Ball ref={ball} x={400} y={650} onGameOver={() => setGameOver(true)} />
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
}

function Message(props: { text: string; onClick: () => void }) {
  let text: Phaser.GameObjects.Text;
  let tryAgain: Phaser.GameObjects.Text;

  const [, setTryAgainTween] = createTween(() => tryAgain, {
    ease: Phaser.Math.Easing.Cubic.Out,
    duration: 500,
    delay: 1000,
  });

  const [, setTextTween] = createTween(() => text, {
    ease: Phaser.Math.Easing.Cubic.Out,
    duration: 500,
    onComplete: () => {
      setTryAgainTween({ alpha: 1 });
    },
  });

  onMount(() => {
    setTextTween({
      scale: 1,
      alpha: 1,
    });
  });

  onInputEvent("pointerdown", () => {
    props.onClick();
  });

  return (
    <>
      <Text
        ref={text}
        x={400}
        y={100}
        text={props.text}
        origin={{
          x: 0.5,
          y: 0.5,
        }}
        scale={{ x: 0, y: 0 }}
        alpha={0}
        style={{
          color: "white",
          fontSize: "48px",
        }}
      />
      <Text
        ref={tryAgain}
        x={400}
        y={150}
        text="Click anywhere to try again"
        origin={{
          x: 0.5,
          y: 0.5,
        }}
        alpha={0}
        style={{
          color: "white",
          fontSize: "16px",
        }}
      />
    </>
  );
}
