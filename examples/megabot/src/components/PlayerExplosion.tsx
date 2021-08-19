import { SpawnProps, SpriteProps, useScene, useSpawner } from 'solid-phaser'
import Explosion from './Explosion'

export default function PlayerExplosion(
  props: Partial<SpriteProps & SpawnProps>
) {
  const scene = useScene()
  const spawner = useSpawner()
  scene.sound.play('sfx/player-die')

  let count = 0
  const explosions = 5

  function explode() {
    const explosionDistance = [-15, -10, 10, 15]
    const ix = Math.floor(Math.random() * (explosionDistance.length - 1))
    const iy = Math.floor(Math.random() * (explosionDistance.length - 1))

    spawner.spawn(Explosion, {
      x:
        props.x - explosionDistance[ix] + Math.random() * explosionDistance[ix],
      y:
        props.y - explosionDistance[iy] + Math.random() * explosionDistance[iy],
      sound: null,
    })
  }
  explode()

  scene.time.addEvent({
    callback: () => {
      if (count < explosions) {
        count += 1
        explode()
      } else {
        scene.time.addEvent({
          callback: () => {
            props.onDestroy()
          },
          delay: 1000,
        })
      }
    },
    repeat: explosions,
    delay: 120,
  })

  return props.children
}
