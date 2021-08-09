import { createEffect, For, onMount } from "solid-js";
import { render } from "solid-js/web";
import { Game, Scene, Sprite, createTween, useScene, Text } from "solid-phaser";
import "./index.css";

function Test() {
  let ref: Phaser.GameObjects.Sprite;

  const [val, setVal] = createTween(
    { x: 1, y: 1 },
    {
      ease: "Bounce",
      duration: 1000,
      repeat: -1,
      yoyo: false,
    }
  );

  setVal({ x: 2, y: 2 });

  return (
    <>
      <FPS />
      {/* <For each={arr}>
        {(_, i) => ( */}
      <Sprite
        ref={ref}
        x={400}
        y={400}
        scale={val()}
        texture="breakout"
        frame="paddle2"
      />
      {/* )}
      </For> */}
    </>
  );
}

function FPS() {
  const scene = useScene();

  return (
    <Text
      x={700}
      y={10}
      text=""
      onUpdate={(self) => {
        self.setText(self.scene.game.loop.actualFps.toFixed(0));
      }}
      style={{
        color: "white",
        fontSize: "48px",
      }}
    />
  );
}
render(
  () => (
    <Game
      width={800}
      height={800}
      physics={{
        default: "arcade",
      }}
      scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
    >
      <Scene
        key="main"
        assets={{
          atlas: ["breakout.json"],
        }}
        create={(scene) => {
          scene.physics.world.setBoundsCollision(true, true, true, true);
          scene.anims.createFromAseprite("assets/sprites/player");
        }}
      >
        <Test />
      </Scene>
    </Game>
  ),
  document.getElementById("root")
);
