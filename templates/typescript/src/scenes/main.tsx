import { Text } from 'solid-phaser'

export default function Main() {
  return (
    <Text
      x={400}
      y={400}
      text="hello world"
      origin={{ x: 0.5, y: 0.5 }}
      style={{
        fontSize: '48px',
      }}
    />
  )
}
