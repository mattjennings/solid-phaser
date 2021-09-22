import Phaser from 'phaser'
import { ComposedGameObjectProps } from './GameObject'
import { ComposedShapeProps, Shape, ShapeProps } from './Shape'

export interface ArcProps<
  Instance extends Phaser.GameObjects.Arc = Phaser.GameObjects.Arc
> extends ComposedGameObjectProps<Instance>,
    ComposedShapeProps<Instance>,
    Partial<
      Pick<
        Phaser.GameObjects.Arc,
        'radius' | 'startAngle' | 'endAngle' | 'anticlockwise'
      >
    > {}

export function Arc<
  Instance extends Phaser.GameObjects.Arc = Phaser.GameObjects.Arc
>(props: ArcProps<Instance>) {
  return (
    <Shape
      create={(scene) =>
        new Phaser.GameObjects.Arc(
          scene,
          props.x,
          props.y,
          props.radius,
          props.startAngle,
          props.endAngle,
          props.anticlockwise,
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
