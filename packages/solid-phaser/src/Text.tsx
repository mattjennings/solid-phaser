import Phaser from "phaser";
import GameObject, { GameObjectProps } from "./GameObject";
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
} from "./types";

export interface TextProps
  extends GameObjectProps<Phaser.GameObjects.Text>,
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
  text?: string | string[];
  style?: Phaser.Types.GameObjects.Text.TextStyle;
}

export default function Text(props: TextProps) {
  return (
    <GameObject
      ref={props.ref}
      create={(scene) =>
        new Phaser.GameObjects.Text(
          scene,
          props.x,
          props.y,
          props.text,
          props.style
        )
      }
      props={props}
      applyProps={{
        style: (instance, val) => instance.setStyle(val),
      }}
      {...props}
    >
      {props.children}
    </GameObject>
  );
}
