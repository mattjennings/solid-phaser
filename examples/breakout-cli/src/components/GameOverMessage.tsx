import { onInputEvent, Text, Tween } from 'solid-phaser'

export default function GameOverMessage(props: {
  text: string
  onClick: () => void
}) {
  onInputEvent('pointerdown', () => {
    props.onClick()
  })

  return (
    <>
      <Text
        x={400}
        y={100}
        text={props.text}
        origin={{
          x: 0.5,
          y: 0.5,
        }}
        scale={{ x: 0, y: 0 }}
        alpha={0}
        style={{
          color: 'white',
          fontSize: '48px',
        }}
      >
        <Tween
          ease={Phaser.Math.Easing.Cubic.Out}
          duration={500}
          initial={{
            scale: 0,
            alpha: 0,
          }}
          animate={{
            scale: 1,
            alpha: 1,
          }}
        />
      </Text>
      <Text
        x={400}
        y={150}
        text="Click anywhere to try again"
        origin={{
          x: 0.5,
          y: 0.5,
        }}
        alpha={0}
        style={{
          color: 'white',
          fontSize: '16px',
        }}
      >
        <Tween
          ease={Phaser.Math.Easing.Cubic.Out}
          duration={500}
          delay={1000}
          initial={{
            alpha: 0,
          }}
          animate={{
            alpha: 1,
          }}
        />
      </Text>
    </>
  )
}
