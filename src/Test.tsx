import { createSignal } from "solid-js";
import { useScene } from "./phaser/Scene";
import Sprite from "./phaser/Sprite";

export default function Test() {
  const scene = useScene();
  const [play, setPlay] = createSignal("Run");
  // setTimeout(() => setPlay("Jump"), 1000);

  return (
    <Sprite
      x={100}
      y={100}
      name="player"
      texture="assets/sprites/player"
      play={play()}
      repeat={-1}
      originY={1}
    />
  );
}
