import { createSignal } from "solid-js";
import { onInputEvent, ArcadePhysics, Sprite, SpriteProps } from "solid-phaser";

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
