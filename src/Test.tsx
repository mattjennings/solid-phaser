import { createSignal } from "solid-js";
import { useScene } from "solid-phaser/Scene";
import Sprite from "solid-phaser/Sprite";

export default function Test() {
  const scene = useScene();
  const [play, setPlay] = createSignal("Run");
  // setTimeout(() => setPlay("Jump"), 1000);

  return (
    <Sprite
      x={100}
      y={100}
      texture="assets/sprites/player"
      play={play()}
      repeat={-1}
      originY={1}
    />
  );
}
