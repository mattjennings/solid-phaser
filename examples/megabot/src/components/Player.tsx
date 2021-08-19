import { createEffect, createRoot, createSignal, on } from 'solid-js'
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
  track,
  SpawnProps,
} from 'solid-phaser'
import Explosion from './Explosion'
import PlayerBullet from './PlayerBullet'
import PlayerExplosion from './PlayerExplosion'

export default function Player(props: Partial<SpriteProps & SpawnProps>) {
  let ref: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }
  const [state, setState] = createStore({
    x: props.x,
    y: props.y,
    velocity: { x: 0, y: 0 },
    shootTimer: null as Phaser.Time.TimerEvent,
    isShooting: false,
    dead: false,
  })
  const velocityX = track(() => ref.body.velocity.x)
  const velocityY = track(() => ref.body.velocity.y)
  const isOnGround = track(() => ref.body.blocked.down)

  const scene = useScene()
  const spawner = useSpawner()
  const tilemap = useTilemap()

  // the line where the player will die if they fall. This is set in tilemap properties
  const deathY = (
    tilemap.properties as Array<{
      name: string
      value: any
    }>
  ).find((p) => p.name === 'deathY')?.value

  const X_SPEED = 100 / 16
  const JUMP_VELOCITY = 350

  const keys = {
    left: scene.input.keyboard.addKey('left', true, true),
    right: scene.input.keyboard.addKey('right', true, true),
    up: scene.input.keyboard.addKey('up'),
    jump: scene.input.keyboard.addKey('SPACE'),
    shoot: scene.input.keyboard.addKey('S'),
  }

  onSceneEvent('update', (time, delta: number) => {
    if (state.dead) {
      return
    }

    // move left/right
    if (
      (!keys.left.isDown && !keys.right.isDown) ||
      (keys.left.isDown && keys.right.isDown)
    ) {
      ref.body.setVelocityX(0)
    } else if (keys.left.isDown) {
      ref.body.setVelocityX(-X_SPEED * delta)
    } else if (keys.right.isDown) {
      ref.body.setVelocityX(X_SPEED * delta)
    }

    // jump
    if (Phaser.Input.Keyboard.JustDown(keys.jump) && ref.body.blocked.down) {
      ref.body.setVelocityY(-JUMP_VELOCITY)
      play('Jump')
    } else if (
      Phaser.Input.Keyboard.JustUp(keys.jump) &&
      ref.body.velocity.y < 0
    ) {
      ref.body.setVelocityY(1)
    }

    // shoot
    if (Phaser.Input.Keyboard.JustDown(keys.shoot)) {
      shoot()
    }
    // die if fell below floor
    if (deathY && ref.y > deathY) {
      die()
    }
  })

  // set animation
  createEffect(
    on([isOnGround, velocityX, () => state.isShooting], (current, prev) => {
      const [, , wasShooting] = prev ?? []

      const progress = ref.anims.getProgress()
      if (isOnGround()) {
        if (velocityX() !== 0) {
          play(state.isShooting ? 'RunShoot' : 'Run')
        } else {
          play(state.isShooting ? 'IdleShoot' : 'Idle')
        }
      } else {
        play('Jump')
      }

      if (state.isShooting && !wasShooting) {
        ref.anims.setProgress(progress)
      } else if (wasShooting && !state.isShooting) {
        ref.anims.setProgress(progress)
      }
    })
  )

  // flip direction based on velocity
  createEffect(
    on(velocityX, (vx) => {
      // moving left
      if (vx < 0) {
        ref.flipX = true
      }
      // moving right
      else if (vx > 0) {
        ref.flipX = false
      }
    })
  )

  function shoot() {
    setState('isShooting', true)
    state.shootTimer?.destroy()
    setState(
      'shootTimer',
      scene.time.addEvent({
        callback: () => {
          setState('isShooting', false)
        },
        delay: 500,
      })
    )

    const direction = ref.flipX ? -1 : 1
    spawn(PlayerBullet, {
      x: Math.round(ref.x + 16 * direction),
      // add velocityY to line up with hand when jumping
      y: Math.round(ref.y - 12 + ref.body.velocity.y / 60),
      velocityX: 200 * direction,
      depth: props.depth,
    })
  }

  function spawn(Component, props) {
    createRoot(() => {
      Component({ ...props })
    })
  }

  function die() {
    if (!state.dead) {
      setState('dead', true)
      props.destroy({ reason: 'player-dead' })
      spawner.spawn(PlayerExplosion, {
        x: ref.x,
        y: ref.y - 12,
      })
    }
  }

  function play(
    animation: string,
    opts?: Partial<Phaser.Types.Animations.PlayAnimationConfig>
  ) {
    return ref.play(
      {
        key: animation,
        repeat: -1,
        ...opts,
      },
      true
    )
  }

  return (
    <Sprite
      ref={ref}
      name="player"
      texture="sprites/player"
      play="Idle"
      origin={{ y: 1 }}
      {...props}
    >
      <ArcadePhysics
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
