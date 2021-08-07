import Sprite, { SpriteProps } from "solid-phaser/Sprite";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import ArcadeCollider from "solid-phaser/physics/ArcadeCollider";

export interface BlockProps extends SpriteProps {
  onCollide: () => void;
}

export default function Block(props: BlockProps) {
  return (
    <Sprite
      name="block"
      x={props.x}
      y={props.y}
      texture="breakout"
      frame={props.frame}
    >
      <ArcadePhysics immovable>
        <ArcadeCollider with="ball" onCollide={props.onCollide} />
      </ArcadePhysics>
    </Sprite>
  );
}
