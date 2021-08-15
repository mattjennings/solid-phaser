import { Game } from 'solid-phaser'
import './index.css'

export default (props) => (
  <Game
    width={800}
    height={800}
    physics={{
      default: 'arcade',
    }}
    scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
  >
    {props.children}
  </Game>
)
