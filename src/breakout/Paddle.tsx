import { createSignal } from "solid-js";
import { onInputEvent } from "solid-phaser/events";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
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
    </Sprite>
  );
}
