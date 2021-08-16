import { createEffect, createSignal, Index, Show } from 'solid-js'
import { onInputEvent, onSceneEvent } from 'solid-phaser'
import { SceneConfig, useRouter } from 'solid-phaser/router'
import Ball from '../components/Ball'
import Block from '../components/Block'
import GameOverMessage from '../components/GameOverMessage'
import Paddle from '../components/Paddle'

export const config: SceneConfig = {
  assets: {
    atlas: ['breakout.json'],
  },

  create: (scene) => {
    scene.physics.world.setBoundsCollision(true, true, true, true)
  },
}

export default function Breakout() {
  const { restart } = useRouter()

  let ball: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
  let paddle: Phaser.GameObjects.Sprite &
    Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody

  const [blocks, setBlocks] = createSignal(
    // create an array of 60 blocks
    Array.from({ length: 60 }).map((_, index) => {
      // possible sprites to use for block
      const blockFrames = [
        'blue1',
        'red1',
        'green1',
        'yellow1',
        'silver1',
        'purple1',
      ]

      return {
        x: (index % 10) * 64,
        y: 10 * Math.floor(index / 10) * 3.2,
        // each row uses same sprite frame
        frame: blockFrames[Math.floor(index / 10)],
        key: index,
      }
    })
  )
  const [ballLaunched, setBallLaunched] = createSignal(false)
  const [gameOver, setGameOver] = createSignal(false)

  // stop ball when game is over
  createEffect(() => {
    if (gameOver()) {
      ball.body.setVelocity(0)
    }
  })

  // move ball with paddle until user launches
  onSceneEvent('update', () => {
    if (!ballLaunched()) {
      ball.setPosition(paddle.x, paddle.y - 48)
    }
  })

  // launch ball on click
  onInputEvent('pointerdown', () => {
    if (!ballLaunched()) {
      setBallLaunched(true)
      ball.body.setVelocity(-75, -600)
    }
  })

  return (
    <>
      <Show when={gameOver() && blocks().length > 0}>
        <GameOverMessage text="Game Over :(" onClick={() => restart()} />
      </Show>
      <Show when={gameOver() && blocks().length === 0}>
        <GameOverMessage text="You win!!" onClick={() => restart()} />
      </Show>

      <Ball
        ref={ball}
        x={400}
        y={650}
        onGameOver={() => setGameOver(true)}
        visible={!gameOver()}
      />
      <Paddle ref={paddle} x={400} y={700} />
      <Index each={blocks()}>
        {(block, index) => (
          <Block
            x={block().x + 116}
            y={block().y + 200}
            frame={block().frame}
            onCollide={() =>
              setBlocks((prev) => prev.filter((_, i) => i !== index))
            }
          />
        )}
      </Index>
    </>
  )
}
