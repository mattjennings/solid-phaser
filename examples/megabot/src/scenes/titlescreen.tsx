import { HTML } from 'solid-phaser'
import styles from './titlescreen.module.css'

export default function Titlescreen() {
  return (
    <>
      <HTML origin={{ x: 0, y: 0 }}>
        <div class={styles.fullscreen}>
          <div class={styles.container}>
            <div class={styles.title}>
              <h1>MEGABOT</h1>
            </div>
            <div class={styles.menu}>
              <span>Start</span>
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
