import Phaser from "phaser";
import type { Component } from "solid-js";
import GameObject, {
  AlphaProps,
  BlendModeProps,
  ComputedSizeProps,
  CropProps,
  DepthProps,
  FlipProps,
  GameObjectProps,
  MaskProps,
  OriginProps,
  PipelineProps,
  ScrollFactorProps,
  TintProps,
  TransformProps,
  VisibleProps,
} from "./GameObject";

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
  style: Phaser.Types.GameObjects.Text.TextStyle;
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
