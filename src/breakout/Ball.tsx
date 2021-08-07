import { createSignal, Show } from "solid-js";
import { onInputEvent, onSceneEvent } from "solid-phaser/events";
import ArcadeCollider from "solid-phaser/physics/ArcadeCollider";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import { useScene } from "solid-phaser/Scene";
import Sprite, { SpriteProps } from "solid-phaser/Sprite";

export default function Ball(props: SpriteProps) {
  const scene = useScene();

  const [show, sets] = createSignal(true);
  setTimeout(() => sets(true), 1000);
  return (
    <Show when={show()}>
      <Sprite
        name="ball"
        x={props.x}
        y={props.y}
        texture="breakout"
        frame="ball1"
      >
        <ArcadePhysics velocityY={-800} velocityX={400} bounceX={1} bounceY={1}>
          <ArcadeCollider with="paddle" worldBounds onWorldBounds={() => {}} />
        </ArcadePhysics>
      </Sprite>
    </Show>
  );
}
