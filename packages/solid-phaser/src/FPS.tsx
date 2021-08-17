import { Text, TextProps } from './game-objects/Text'

/**
 * Helper text component to print out the FPS
 **/
export function FPS(props: Omit<TextProps, 'text'>) {
  return (
    <Text
      {...props}
      onUpdate={(self) => {
        self.setText(self.scene.game.loop.actualFps.toFixed(2))
      }}
    />
  )
}
