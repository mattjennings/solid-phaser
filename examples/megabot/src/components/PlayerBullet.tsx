import { splitProps } from 'solid-js'
import {
  SpawnProps,
  Arc,
  ArcProps,
  Tween,
  ArcadePhysics,
  ArcadeCollider,
} from 'solid-phaser'

export interface PlayerBulletProps extends Partial<ArcProps>, SpawnProps {
  velocityX: number
}
export default function PlayerBullet(props: PlayerBulletProps) {
  const [, rest] = splitProps(props, ['velocityX', 'onDestroy', 'spawnId'])

  return (
    <Arc radius={2} fillColor={0xfffc96} {...rest}>
      <Tween
        initial={{ alpha: 1 }}
        animate={{ alpha: 0 }}
        delay={500}
        duration={500}
        onComplete={() => {
          props.onDestroy()
        }}
      />
      <ArcadePhysics
        velocityX={props.velocityX}
        allowGravity={false}
        circle={{ radius: 2 }}
      />
      <ArcadeCollider
        with="enemy"
        overlap
        onCollide={() => {
          props.onDestroy()
        }}
      />
    </Arc>
  )
}
