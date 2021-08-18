import { Game } from 'solid-phaser'

export default (props) => {
  return (
    <Game
      width={400}
      height={225}
      physics={{
        default: 'arcade',
        arcade: {
          debug: true,
          // debugBodyColor: 0x00ff00,
          // debugShowBody: true,
          gravity: {
            y: 2000,
          },
        },
      }}
      dom={{
        createContainer: true,
      }}
      parent={document.querySelector('#root') as HTMLElement}
      render={{ pixelArt: true }}
      scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
    >
      {props.children}
    </Game>
  )
}
