import { render } from "solid-js/web";
import { Game, Scene, Sprite, createTween, useScene, Text } from "solid-phaser";
import { enableScheduling, For, onMount } from "solid-js";
import "./index.css";

const arr = Array.from({ length: 5000 }).map((_, i) => ({
  x: Math.random() * 800,
  y: Math.random() * 800,
}));
function Test() {
  let refs: Phaser.GameObjects.Sprite[] = [];

  // const [val, setVal] = createTween(() => refs, {
  //   ease: "Circular",
  //   duration: 1000,
  //   repeat: -1,
  //   yoyo: false,
  // });

  // onMount(() => {
  //   setVal({ scale: 2 });
  // });

  return (
    <>
      <FPS />
      <For each={arr}>
        {/* {({ x, y }) => (
          <Sprite
            ref={(el) => refs.push(el)}
            x={x}
            y={y}
            // scale={{ x: val(), y: val() }}
            texture="breakout"
            frame="paddle2"
          />
        )} */}
        {({ x, y }) => <Spr x={x} y={y} />}
      </For>
    </>
  );
}

function Spr(props) {
  const [val, setVal] = createTween(1, {
    ease: "Circular",
    duration: 1000,
    repeat: -1,
    yoyo: true,
  });

  setVal(2);

  return (
    <Sprite
      x={props.x}
      y={props.y}
      scale={{ x: val(), y: val() }}
      texture="breakout"
      frame="paddle2"
    />
  );
}

function Spr2(props) {
  let ref;
  const [, setVal] = createTween(() => ref, {
    ease: "Circular",
    duration: 1000,
    repeat: -1,
    yoyo: false,
  });

  onMount(() => {
    setVal({ scale: 2 });
  });

  return (
    <Sprite
      ref={ref}
      x={props.x}
      y={props.y}
      texture="breakout"
      frame="paddle2"
    />
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
      depth={50}
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
