import Phaser from 'phaser'
import { GameObject, GameObjectProps } from './GameObject'
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

export interface ShapeProps
  extends AlphaProps,
    BlendModeProps,
    DepthProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TransformProps,
    VisibleProps,
    Partial<
      Pick<
        Phaser.GameObjects.Shape,
        | 'fillColor'
        | 'fillAlpha'
        | 'strokeAlpha'
        | 'strokeColor'
        | 'isFilled'
        | 'isStroked'
      >
    > {}

export function Shape<
  Instance extends Phaser.GameObjects.Shape,
  Props extends ShapeProps
>(props: GameObjectProps<Instance, Props>) {
  return <GameObject {...(props as any)} />
}
