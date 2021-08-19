import Phaser from 'phaser'
import { GameObject, ComposedGameObjectProps } from './GameObject'
import {
  AlphaProps,
  BlendModeProps,
  ComputedSizeProps,
  CropProps,
  DepthProps,
  FlipProps,
  MaskProps,
  OriginProps,
  PipelineProps,
  ScrollFactorProps,
  TintProps,
  TransformProps,
  VisibleProps,
} from './props'

export interface ArcProps<
  Instance extends Phaser.GameObjects.Arc = Phaser.GameObjects.Arc
> extends ComposedGameObjectProps<Instance>,
    AlphaProps,
    BlendModeProps,
    ComputedSizeProps,
    CropProps,
    DepthProps,
    FlipProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TintProps,
    TransformProps,
    VisibleProps,
    Partial<
      Pick<
        Phaser.GameObjects.Arc,
        | 'radius'
        | 'startAngle'
        | 'endAngle'
        | 'anticlockwise'
        | 'fillColor'
        | 'fillAlpha'
        | 'strokeAlpha'
        | 'strokeColor'
        | 'isFilled'
        | 'isStroked'
      >
    > {}

export function Arc<
  Instance extends Phaser.GameObjects.Arc = Phaser.GameObjects.Arc
>(props: ArcProps<Instance>) {
  return (
    <GameObject
      ref={props.ref}
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
    </GameObject>
  )
}
