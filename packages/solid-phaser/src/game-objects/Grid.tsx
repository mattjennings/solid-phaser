import Phaser from 'phaser'
import { ComposedShapeProps, Shape } from './Shape'

export interface GridProps<
  Instance extends Phaser.GameObjects.Grid = Phaser.GameObjects.Grid
> extends ComposedShapeProps<Instance>,
    Partial<
      Pick<
        Phaser.GameObjects.Grid,
        | 'width'
        | 'height'
        | 'cellWidth'
        | 'cellHeight'
        | 'outlineFillColor'
        | 'outlineFillAlpha'
        | 'lineWidth'
      >
    > {}

export function Grid<
  Instance extends Phaser.GameObjects.Grid = Phaser.GameObjects.Grid
>(props: GridProps<Instance>) {
  return (
    <Shape
      create={(scene) =>
        new Phaser.GameObjects.Grid(
          scene,
          props.x,
          props.y,
          props.width,
          props.height,
          props.cellWidth,
          props.cellHeight,
          props.fillColor,
          props.fillAlpha,
          props.outlineFillColor,
          props.outlineFillAlpha
        )
      }
      {...props}
    >
      {props.children}
    </Shape>
  )
}
