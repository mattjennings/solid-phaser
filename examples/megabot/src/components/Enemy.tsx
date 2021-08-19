import { createSignal, onCleanup, onMount, splitProps } from 'solid-js'
import {
  Sprite,
  ArcadePhysics,
  ArcadeCollider,
  SpriteProps,
  VelocityProps,
  SpawnProps,
  useSpawner,
  useScene,
  useCamera,
  onGameEvent,
} from 'solid-phaser'
import Explosion from './Explosion'

/* <script lang="ts">
  import {
    Sprite,
    ArcadePhysics,
    ArcadeCollider,
    findGameObjectsByName,
    getScene,
    onGameEvent,
    getSpawner,
    getCamera,
  } from 'phelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import Explosion from './Explosion.svelte'

  export let x: number
  export let y: number

  const dispatch = createEventDispatcher()
  let velocityX = 0
  let velocityY = 0
  let flipX = true

  let ref: Phaser.Physics.Arcade.Sprite
  let player: Phaser.Physics.Arcade.Sprite

  const scene = getScene()
  const spawner = getSpawner()
  const camera = getCamera()

  const timer = scene.time.addEvent({
    callback: follow,
    delay: 500,
    loop: true,
  })

  onMount(() => {
    player = findGameObjectsByName<Phaser.Physics.Arcade.Sprite>(
      scene,
      'player'
    )[0]

    follow()
    return () => {
      timer.destroy()
    }
  })

  onGameEvent(Phaser.Core.Events.STEP, () => {
    const view = new Phaser.Geom.Rectangle(
      camera.worldView.x - camera.width / 2,
      camera.worldView.y - camera.height / 2,
      camera.worldView.width + camera.width / 2,
      camera.worldView.height + camera.height / 2
    )

    if (!view.contains(x, y)) {
      dispatch('destroy')
    }
  })

  function follow() {
    if (player) {
      const selfX = ref.x + ref.displayOriginX / 2
      const selfY = ref.y + ref.displayOriginY / 2
      const targetX = player.x + player.displayOriginX / 2
      const targetY = player.y - player.displayOriginY / 2 // keep enemy targetting the top-half of the player

      const angle =
        (Math.atan2(targetY - selfY, targetX - selfX) * 180) / Math.PI

      const velocity = scene.physics.velocityFromAngle(angle, 15)
      flipX = selfX < targetX ? true : false

      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: selfX, y: selfY },
          { x: targetX, y: targetY }
        ) < 300
      ) {
        velocityX = velocity.x
        velocityY = velocity.y
      }
    } else {
      velocityX = 0
      velocityY = 0
    }
  }
</script> */

export default function Enemy(props: Partial<SpriteProps> & SpawnProps) {
  let ref: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }
  const scene = useScene()
  const camera = useCamera()
  const spawner = useSpawner()

  const [player, setPlayer] = createSignal<
    Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }
  >(null)

  const timer = scene.time.addEvent({
    callback: follow,
    delay: 500,
    loop: true,
  })

  onMount(() => {
    setPlayer(
      Phaser.Actions.GetFirst(scene.children.list, { name: 'player' }) as any
    )

    follow()
  })

  onCleanup(() => {
    timer.destroy()
  })

  function follow() {
    if (player()) {
      const selfX = ref.x + ref.displayOriginX / 2
      const selfY = ref.y + ref.displayOriginY / 2
      const targetX = player().x + player().displayOriginX / 2
      const targetY = player().y - player().displayOriginY / 2 // keep enemy targetting the top-half of the player

      const angle =
        (Math.atan2(targetY - selfY, targetX - selfX) * 180) / Math.PI

      const velocity = scene.physics.velocityFromAngle(angle, 15)
      ref.flipX = selfX < targetX ? true : false

      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: selfX, y: selfY },
          { x: targetX, y: targetY }
        ) < 300
      ) {
        ref.body.setVelocity(velocity.x, velocity.y)
      }
    } else {
      ref.body.setVelocity(0, 0)
    }
  }

  onGameEvent(Phaser.Core.Events.STEP, () => {
    const view = new Phaser.Geom.Rectangle(
      camera.worldView.x - camera.width / 2,
      camera.worldView.y - camera.height / 2,
      camera.worldView.width + camera.width / 2,
      camera.worldView.height + camera.height / 2
    )

    if (!view.contains(ref.x, ref.y)) {
      props.destroy?.()
    }
  })

  return (
    <Sprite
      ref={ref}
      name="enemy"
      texture="sprites/enemy"
      play="Fly"
      repeat={-1}
      {...props}
    >
      <ArcadePhysics
        allowGravity={false}
        size={{
          width: 14,
          height: 20,
        }}
      />
      <ArcadeCollider
        with="player-bullet"
        overlap
        onCollide={(self, other) => {
          self.destroy()
          other.destroy()
          spawner.spawn(Explosion, {
            x: ref.x,
            y: ref.y,
          })
        }}
      />
    </Sprite>
  )
}
