import { render } from "solid-js/web";
import {
  Game,
  Scene,
  GameObject,
  Sprite,
  createTween,
  useScene,
  Text,
  Tween,
  ArcadePhysics,
  Use,
} from "solid-phaser";
import {
  createEffect,
  createSignal,
  enableScheduling,
  For,
  onMount,
  Show,
} from "solid-js";
import "./index.css";

function Test() {
  const [count, setCount] = createSignal(0);
  const [text, setText] = createSignal("click me 3 times (0)");

  return (
    <Show when={count() < 3}>
      <Text
        x={400}
        y={400}
        text={text()}
        interactive
        origin={{ x: 0.5, y: 0.5 }}
        onPointerUp={(self) => {
          // delay count update so we can update text prop before Show unmounts
          const nextCount = count() + 1;
          setTimeout(() => setCount(nextCount));

          setText(
            nextCount >= 3 ? "goodbye" : `click me 3 times (${nextCount})`
          );
        }}
      >
        <Tween
          ease="Bounce"
          duration={300}
          initial={{ alpha: 0, scale: 0 }}
          animate={{ alpha: 1, scale: 1 }}
          whileTap={{
            alpha: 1,
            scale: 2,
          }}
          exit={{
            alpha: 0,
            scale: 0,
            transition: {
              delay: 1000,
              ease: "Linear",
            },
          }}
        />
      </Text>
    </Show>
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
