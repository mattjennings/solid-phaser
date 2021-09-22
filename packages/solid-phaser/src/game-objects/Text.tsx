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

export interface TextProps<
  Instance extends Phaser.GameObjects.Text = Phaser.GameObjects.Text
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
    VisibleProps {
  text?: string | string[]
  style?: Phaser.Types.GameObjects.Text.TextStyle
}

export function Text<
  Instance extends Phaser.GameObjects.Text = Phaser.GameObjects.Text
>(props: TextProps<Instance>) {
  return (
    <GameObject
      create={(scene) =>
        new Phaser.GameObjects.Text(
          scene,
          props.x,
          props.y,
          props.text,
          props.style
        )
      }
      applyProps={{
        style: (instance, val) => instance.setStyle(val),
      }}
      {...props}
    >
      {props.children}
    </GameObject>
  )
}
