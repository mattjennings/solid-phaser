import {
  Sprite,
  SpriteProps,
  ArcadePhysics,
  ArcadeCollider,
} from 'solid-phaser'

export interface BallProps extends Omit<SpriteProps, 'texture'> {
  onGameOver: () => void
}

export default function Ball(props: BallProps) {
  function handlePaddleCollide(
    self: Phaser.GameObjects.Sprite &
      Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody,
    paddle: Phaser.GameObjects.Sprite &
      Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
  ) {
    if (self.x < paddle.x) {
      const diff = paddle.x - self.x
      self.body.setVelocityX(-10 * diff)
    } else if (self.x > paddle.x) {
      const diff = self.x - paddle.x
      self.body.setVelocityX(10 * diff)
    } else {
      self.body.setVelocityX(2 + Math.random() * 8)
    }
  }

  return (
    <Sprite
      ref={props.ref}
      name="ball"
      x={props.x}
      y={props.y}
      texture="breakout"
      frame="ball1"
      {...props}
    >
      <ArcadePhysics bounce={{ x: 1, y: 1 }}>
        <ArcadeCollider
          with="paddle"
          onCollide={handlePaddleCollide}
          worldBounds
          onWorldBounds={(self, blocked) => {
            if (blocked.down) {
              props.onGameOver()
            }
          }}
        />
      </ArcadePhysics>
    </Sprite>
  )
}
