import { createSignal } from 'solid-js'
import { HTML, useCamera, useScene } from 'solid-phaser'
import { useRouter } from 'solid-phaser/router'
import styles from './titlescreen.module.css'

export default function Titlescreen() {
  const scene = useScene()
  const camera = useCamera()
  const { goto } = useRouter()

  const [alpha, setAlpha] = createSignal(1)

  return (
    <>
      <HTML origin={{ x: 0, y: 0 }} alpha={alpha()}>
        <div class={styles.fullscreen}>
          <div class={styles.container}>
            <div class={styles.title}>
              <h1>MEGABOT</h1>
            </div>
            <div class={styles.menu}>
              <a
                onClick={() => {
                  camera.fadeOut(1000, 0, 0, 0, () => {
                    const { progress } = camera.fadeEffect
                    // camera effect does not apply to HTML, so we'll fade them
                    // out with alpha
                    setAlpha(1 - progress)
                    scene.sound.volume = 1 - progress
                  })
                  camera.on('camerafadeoutcomplete', () => goto('level1'))
                }}
              >
                Start
              </a>
            </div>
            <div class={styles.controls}>
              <span>MOVE = ARROW KEYS, JUMP = SPACEBAR, SHOOT = S</span>
            </div>
          </div>
        </div>
      </HTML>
    </>
  )
}
