import Phaser from 'phaser'
import { ComposedShapeProps, Shape } from './Shape'

export interface RectangleProps<
  Instance extends Phaser.GameObjects.Rectangle = Phaser.GameObjects.Rectangle
> extends ComposedShapeProps<Instance>,
    Partial<Pick<Phaser.GameObjects.Rectangle, 'width' | 'height'>> {}

export function Rectangle<
  Instance extends Phaser.GameObjects.Rectangle = Phaser.GameObjects.Rectangle
>(props: RectangleProps<Instance>) {
  return (
    <Shape
      create={(scene) =>
        new Phaser.GameObjects.Rectangle(
          scene,
          props.x,
          props.y,
          props.width,
          props.height,
          props.fillColor,
          props.fillAlpha
        )
      }
      {...props}
    >
      {props.children}
    </Shape>
  )
}
