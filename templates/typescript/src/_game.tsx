import type { Component } from 'solid-js'
import Phaser from 'phaser'
import { Game } from 'solid-phaser'

const game: Component = (props) => {
  return (
    <Game
      width={800}
      height={800}
      scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
    >
      {props.children}
    </Game>
  )
}

export default game
