import { createSignal, onMount, Show } from "solid-js";
import { onInputEvent, onSceneEvent } from "solid-phaser/events";
import GameObject from "solid-phaser/GameObject";
import ArcadeCollider from "solid-phaser/physics/ArcadeCollider";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import { useScene } from "solid-phaser/Scene";
import Sprite, { SpriteProps } from "solid-phaser/Sprite";

export default function Ball(props: SpriteProps) {
  const scene = useScene();

  let instance;
  return (
    <Sprite
      ref={instance}
      name="ball"
      x={props.x}
      y={props.y}
      texture="breakout"
      frame="ball1"
    >
      <ArcadePhysics velocityY={-800} velocityX={-400} bounceX={1} bounceY={1}>
        <ArcadeCollider with="paddle" worldBounds onWorldBounds={() => {}} />
      </ArcadePhysics>
    </Sprite>
  );
}
