import { mergeProps, splitProps } from 'solid-js'
import { Sprite, SpriteProps, SpawnProps, useScene } from 'solid-phaser'

export interface ExplosionProps extends Partial<SpriteProps>, SpawnProps {
  sound?: string
}

export default function Explosion(props: ExplosionProps) {
  const [local, rest] = splitProps(
    mergeProps({ sound: 'sfx/explosion' }, props),
    ['sound']
  )
  const scene = useScene()
  if (local.sound) {
    scene.sound.play(local.sound)
  }

  return (
    <Sprite
      depth={30}
      texture="sprites/explosion"
      play="Explode"
      onAnimationComplete={() => props.onDestroy()}
      {...rest}
    />
  )
}
