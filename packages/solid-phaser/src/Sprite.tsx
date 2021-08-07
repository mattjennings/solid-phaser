import { children, createEffect, createMemo, on, splitProps } from "solid-js";
import {
  AlphaProps,
  AnimationProps,
  BlendModeProps,
  ComputedSizeProps,
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
import GameObject, { GameObjectProps } from "./GameObject";
import { RefFunction } from "./types";

export interface SpriteProps
  extends GameObjectProps<Phaser.GameObjects.Sprite>,
    AlphaProps,
    AnimationProps,
    BlendModeProps,
    ComputedSizeProps,
    DepthProps,
    FlipProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TintProps,
    TransformProps,
    VisibleProps {
  play?: string;
  texture?: string;
  x?: number;
  y?: number;
  frame?: string | number;
}

export default function Sprite(props: SpriteProps) {
  const [local, other] = splitProps(props, [
    "displayOriginX",
    "displayOriginY",
    "originX",
    "originY",
    "play",
    "repeat",
    "delay",
    "repeatDelay",
    "duration",
    "frameRate",
    "msPerFrame",
    "timeScale",
    "yoyo",
    "skipMissedFrames",
  ]);
  let instance: Phaser.GameObjects.Sprite;

  createEffect(() => {
    if (local.play) {
      instance?.play(
        {
          key: local.play,
          repeat: local.repeat,
          repeatDelay: local.repeatDelay,
          delay: local.delay,
          duration: local.duration,
          frameRate: local.frameRate,
          msPerFrame: local.msPerFrame,
          timeScale: local.timeScale,
          yoyo: local.yoyo,
          skipMissedFrames: local.skipMissedFrames,
        },
        true
      );
    } else {
      instance?.stop();
    }
  });

  if ("originX" in props || "originY" in props) {
    createEffect(() => {
      instance?.setOrigin(local.originX ?? 0.5, local.originY ?? 0.5);
    });
  }

  if ("displayOriginX" in props || "displayOriginY" in props) {
    createEffect(() => {
      instance?.setDisplayOrigin(
        local.displayOriginX ?? 0.5,
        local.displayOriginY ?? 0.5
      );
    });
  }

  return (
    <GameObject
      ref={(el) => {
        instance = el;
        (props.ref as RefFunction)?.(el);
      }}
      create={(scene) =>
        new Phaser.GameObjects.Sprite(
          scene,
          props.x,
          props.y,
          props.texture,
          props.frame
        )
      }
      props={other}
      applyProps={{
        frame: (instance, val) => instance.setFrame(val),
        texture: (instance, val, props) =>
          instance.setTexture(val, props.frame),
      }}
      {...other}
    >
      {props.children}
    </GameObject>
  );
}
