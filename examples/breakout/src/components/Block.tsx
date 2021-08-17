import {
  Sprite,
  SpriteProps,
  ArcadePhysics,
  ArcadeCollider,
} from 'solid-phaser'

export interface BlockProps extends SpriteProps {
  onCollide: () => void
}

export default function Block(props: Omit<BlockProps, 'texture'>) {
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
  )
}
