import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import { Game, Scene, Text, Tween } from "solid-phaser";
import "./index.css";

function Test() {
  const [count, setCount] = createSignal(0);
  const [text, setText] = createSignal("click me 3 times (0)");

  function handleClick() {
    // delay count update so we can update text prop before it unmounts
    const nextCount = count() + 1;
    setTimeout(() => setCount(nextCount));

    setText(nextCount >= 3 ? "goodbye" : `click me 3 times (${nextCount})`);
  }

  return (
    <Show when={count() < 3}>
      <Text
        x={400}
        y={400}
        text={text()}
        interactive
        origin={{ x: 0.5, y: 0.5 }}
        style={{ fontSize: "32px" }}
        onPointerUp={handleClick}
      >
        <Tween
          ease="Bounce"
          duration={300}
          whileTap={{
            scale: 0.8,
          }}
          whileHover={{
            scale: 1.2,
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
