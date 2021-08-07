import ArcadeCollider from "solid-phaser/physics/ArcadeCollider";
import ArcadePhysics from "solid-phaser/physics/ArcadePhysics";
import Sprite, { SpriteProps } from "solid-phaser/Sprite";
export interface BallProps extends SpriteProps {
  onGameOver: () => void;
}

export default function Ball(props: BallProps) {
  function handlePaddleCollide(
    self: Phaser.GameObjects.Sprite &
      Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody,
    paddle: Phaser.GameObjects.Sprite &
      Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
  ) {
    if (self.x < paddle.x) {
      const diff = paddle.x - self.x;
      self.body.setVelocityX(-10 * diff);
    } else if (self.x > paddle.x) {
      const diff = self.x - paddle.x;
      self.body.setVelocityX(10 * diff);
    } else {
      self.body.setVelocityX(2 + Math.random() * 8);
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
    >
      <ArcadePhysics bounceX={1} bounceY={1}>
        <ArcadeCollider
          with="paddle"
          onCollide={handlePaddleCollide}
          worldBounds
          onWorldBounds={(self, blocked) => {
            if (blocked.down) {
              props.onGameOver();
            }
          }}
        />
      </ArcadePhysics>
    </Sprite>
  );
}
