import { createSignal } from "solid-js";
import { onInputEvent, onSceneEvent } from "solid-phaser/events";
import ArcadeCollider from "solid-phaser/physics/ArcadeCollider";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import { useScene } from "solid-phaser/Scene";
import Sprite, { SpriteProps } from "solid-phaser/Sprite";

export default function Paddle(props: SpriteProps) {
  let [x, setX] = createSignal(props.x);

  onInputEvent("pointermove", (pointer: { x: number }) => {
    setX(pointer.x);
  });

  return (
    <Sprite
      ref={props.ref}
      name="paddle"
      x={x()}
      y={props.y}
      texture="breakout"
      frame="paddle1"
    >
      <ArcadePhysics immovable />
      {/* <ArcadeCollider /> */}
    </Sprite>
  );
}
