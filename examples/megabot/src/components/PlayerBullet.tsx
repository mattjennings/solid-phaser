import { splitProps } from 'solid-js'
import {
  SpawnProps,
  Arc,
  ArcProps,
  Tween,
  ArcadePhysics,
  ArcadeCollider,
  useScene,
} from 'solid-phaser'

export interface PlayerBulletProps extends Partial<ArcProps>, SpawnProps {
  velocityX: number
}
export default function PlayerBullet(props: PlayerBulletProps) {
  let ref
  const scene = useScene()
  const [, rest] = splitProps(props, ['velocityX', 'destroy', 'spawnId'])

  scene.sound.play('sfx/shoot')

  return (
    <Arc
      ref={ref}
      name="player-bullet"
      radius={2}
      fillColor={0xfffc96}
      {...rest}
    >
      <Tween
        initial={{ alpha: 1 }}
        animate={{ alpha: 0 }}
        delay={500}
        duration={500}
        onComplete={() => {
          ref.destroy()
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
          // props.onDestroy()
        }}
      />
    </Arc>
  )
}
