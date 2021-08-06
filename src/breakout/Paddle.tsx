import { createSignal } from "solid-js";
import { onInputEvent, onSceneEvent } from "solid-phaser/events";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import { useScene } from "solid-phaser/Scene";
import Sprite, { SpriteProps } from "solid-phaser/Sprite";

export default function Paddle(props: SpriteProps) {
  const scene = useScene();
  let [x, setX] = createSignal(props.x);

  onInputEvent("pointermove", (pointer: { x: number }) => {
    setX(pointer.x);
  });

  return (
    <>
      <Sprite
        name="paddle"
        x={x()}
        y={props.y}
        texture="breakout"
        frame="paddle1"
        onUpdate={(self: Phaser.Physics.Arcade.Sprite) => {
          // self.body.velocity.y = 10
        }}
      >
        <ArcadePhysics immovable />
      </Sprite>
    </>
  );
}
