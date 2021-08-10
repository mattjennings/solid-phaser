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
  const [show, setShow] = createSignal(true);

  onMount(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  });

  return (
    <Show when={show()}>
      <Text
        x={400}
        y={400}
        text="ez animation"
        interactive
        alpha={0}
        scale={{ x: 0, y: 0 }}
        origin={{ x: 0.5, y: 0.5 }}
      >
        <Tween
          ease="Bounce"
          duration={300}
          animate={{ alpha: 1, scale: 1 }}
          whileTap={{
            alpha: 1,
            scale: 2,
          }}
          exit={{
            alpha: 0,
            scale: 0,
            transition: {
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
