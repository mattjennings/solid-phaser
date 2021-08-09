import { render } from "solid-js/web";
import {
  Game,
  Scene,
  GameObject,
  Sprite,
  createTween,
  useScene,
  Text,
} from "solid-phaser";
import {
  createEffect,
  createSignal,
  enableScheduling,
  For,
  onMount,
} from "solid-js";
import "./index.css";

function Test() {
  const [val, setVal] = createSignal(0);

  setTimeout(() => {
    setVal(100);
  }, 100);

  createEffect(() => {
    console.log(val());
  });

  return (
    <>
      <GameObject
        create={(scene) => scene.add.text(0, 0, "hello")}
        x={val()}
        applyProps={{}}
      />
    </>
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
