import { createEffect, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import {
  Sprite,
  ArcadePhysics,
  ArcadeCollider,
  SpriteProps,
  useScene,
  useSpawner,
  onSceneEvent,
  useTilemap,
} from 'solid-phaser'

export default function Player(props: Partial<SpriteProps>) {
  let self: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }
  const [state, setState] = createStore({
    x: props.x,
    y: props.y,
    flipX: false,
    velocity: { x: 0, y: 0 },
    animation: 'Idle',
    shootTimer: null as Phaser.Time.TimerEvent,
    isShooting: false,
    progress: 0,
    isOnFloor: true,
    dead: false,
  })
  const scene = useScene()
  const spawner = useSpawner()
  const tilemap = useTilemap()

  // the line where the player will die if they fall. This is set in tilemap properties
  // const deathY = (
  //   tilemap.properties as Array<{
  //     name: string
  //     value: any
  //   }>
  // ).find((p) => p.name === 'deathY')?.value
  const deathY = 0

  const X_SPEED = 100 / 16
  const JUMP_VELOCITY = 450

  const keys = {
    left: scene.input.keyboard.addKey('left', true, true),
    right: scene.input.keyboard.addKey('right', true, true),
    up: scene.input.keyboard.addKey('up'),
    jump: scene.input.keyboard.addKey('SPACE'),
    shoot: scene.input.keyboard.addKey('S'),
  }

  // sync state with updated values from instance
  onSceneEvent(Phaser.Scenes.Events.PRE_UPDATE, () => {
    setState('isOnFloor', self.body.blocked.down)
    setState('velocity', 'x', self.body.velocity.x)
    setState('velocity', 'y', self.body.velocity.y)
  })

  onSceneEvent('update', (time, delta: number) => {
    if (state.dead) {
      return
    }

    // move left/right
    if (
      (!keys.left.isDown && !keys.right.isDown) ||
      (keys.left.isDown && keys.right.isDown)
    ) {
      setState('velocity', 'x', 0)
    } else if (keys.left.isDown) {
      setState('velocity', 'x', -X_SPEED * delta)
      setState('flipX', true)
    } else if (keys.right.isDown) {
      setState('velocity', 'x', X_SPEED * delta)
      setState('flipX', false)
    }

    // jump
    if (Phaser.Input.Keyboard.JustDown(keys.jump) && state.isOnFloor) {
      setState('velocity', 'y', -JUMP_VELOCITY)
      setState('animation', 'Jump')
    } else if (
      Phaser.Input.Keyboard.JustUp(keys.jump) &&
      self.body.velocity.y < 0
    ) {
      setState('velocity', 'y', 1)
    }

    // shoot
    if (Phaser.Input.Keyboard.JustDown(keys.shoot)) {
      // shoot()
    }
    // die if fell below floor
    if (deathY && self.y > deathY) {
      // die()
    }
  })

  createEffect(() => {
    if (state.isOnFloor) {
      if (state.velocity.x !== 0) {
        setState('animation', 'Run')
      } else {
        setState('animation', 'Idle')
      }
    } else {
      setState('animation', 'Jump')
    }
  })

  // // @ts-ignore - run updateShootingAnimation whenever isShooting changes
  // $: isShooting, updateShootingAnimation()

  // function shoot() {
  //   isShooting = true
  //   shootTimer?.destroy()
  //   shootTimer = scene.time.addEvent({
  //     callback: () => {
  //       isShooting = false
  //     },
  //     delay: 500,
  //   })

  //   const direction = flipX ? -1 : 1
  //   spawner.spawn(PlayerBullet, {
  //     x: Math.round(x + 12 * direction),
  //     // add velocityY to line up with hand when jumping
  //     y: Math.round(y - 12 + velocityY / 60),
  //     velocityX: 200 * direction,
  //     depth,
  //   })
  // }

  // function updateShootingAnimation() {
  //   switch (animation) {
  //     case 'Run':
  //       if (isShooting) {
  //         progress = instance.anims.currentFrame.progress
  //         animation = 'RunShoot'
  //       }
  //       break
  //     case 'Idle':
  //       if (isShooting) {
  //         animation = 'Shot'
  //         progress = instance.anims.currentFrame.progress
  //       }
  //       break
  //     case 'RunShoot':
  //       if (!isShooting) {
  //         animation = 'Run'
  //         progress = instance.anims.currentFrame.progress
  //       }
  //       break
  //     case 'Shot':
  //       if (!isShooting) {
  //         animation = 'Idle'
  //         progress = instance.anims.currentFrame.progress
  //       }
  //       break
  //   }
  // }

  // function playAnimation(key: string) {
  //   animation = key
  //   updateShootingAnimation()
  // }

  // function die() {
  //   if (!dead) {
  //     dead = true
  //     spawner.spawn(PlayerExplosion, {
  //       x,
  //       y: y - 12,
  //       onDestroy: () => {
  //         dispatch('destroy', { reason: 'player-dead' })
  //       },
  //     })
  //   }
  // }
  return (
    <Sprite
      ref={self}
      name="player"
      texture="sprites/player"
      play={state.animation}
      flipX={state.flipX}
      origin={{ y: 1 }}
      repeat={-1}
      {...props}
    >
      <ArcadePhysics
        velocityX={state.velocity.x}
        velocityY={state.velocity.y}
        size={{
          width: 10,
          height: 20,
        }}
        offset={{ y: 9 }}
      />
      <ArcadeCollider with="ground" worldBounds />
      {/* <ArcadeCollider
        with="enemy"
        overlap
        // onCollide={() => die()}
      /> */}
    </Sprite>
  )
}
