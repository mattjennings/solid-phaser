import {
  Component,
  createContext,
  createEffect,
  JSX,
  onCleanup,
  splitProps,
} from "solid-js";
import { useGroup } from "./Group";
import { useScene } from "./Scene";
import { createApplyPropsEffect } from "./util/createApplyPropsEffect";

export const GameObjectContext = createContext();

export function GameObject<
  T extends Phaser.GameObjects.GameObject,
  P = Record<string, any>
>(
  props: GameObjectProps<T> & {
    props: P;
    applyProps?: Partial<
      Record<keyof P, (instance: T, value: any, props: P) => any>
    >;
  }
) {
  const scene = useScene();
  const group = useGroup();

  let instance = props.ref() ?? props.create(scene);
  let listeners = [];

  if (scene) {
    // @ts-ignore
    scene.add.existing(instance);
  } else {
    throw new Error("GameObject requires a parent Scene component");
  }

  if (group) {
    group.add(instance);
  }

  onCleanup(() => {
    instance.destroy();

    listeners.forEach((listener) => listener());
  });

  createApplyPropsEffect(instance, props.props, props.applyProps);

  if (props.onUpdate) {
    const cb = () => (instance.active ? props.onUpdate(instance) : void 0);
    scene.events.on("update", cb);

    listeners.push(() => scene.events.off("update", cb));
  }

  if (props.onPreUpdate) {
    const cb = () => (instance.active ? props.onPreUpdate(instance) : void 0);
    scene.events.on("preupdate", cb);

    listeners.push(() => scene.events.off("preupdate", cb));
  }

  if (props.onPostUpdate) {
    const cb = () => (instance.active ? props.onPostUpdate(instance) : void 0);
    scene.events.on("postupdate", cb);

    listeners.push(() => scene.events.off("postupdate", cb));
  }

  return props.children;
}

export default GameObject;

/**************************
 *        PROPS           *
 **************************/

export interface GameObjectProps<T extends Phaser.GameObjects.GameObject> {
  ref?: () => T;
  children?: JSX.Element;

  create?: (scene: Phaser.Scene) => T;
  onUpdate?: (self: T) => any;
  onPreUpdate?: (self: T) => any;
  onPostUpdate?: (self: T) => any;
}

export type AlphaProps = Partial<
  Pick<
    Phaser.GameObjects.Components.Alpha,
    | "alpha"
    | "alphaBottomLeft"
    | "alphaBottomRight"
    | "alphaTopLeft"
    | "alphaTopRight"
  >
>;

export type Point = {
  x: number;
  y: number;
};

export type BlendModeProps = Partial<
  Pick<Phaser.GameObjects.Components.BlendMode, "blendMode">
>;

export type ComputedSizeProps = Partial<
  Pick<
    Phaser.GameObjects.Components.ComputedSize,
    "displayHeight" | "displayWidth" | "height" | "width"
  >
>;

export type CropProps = Partial<
  Pick<Phaser.GameObjects.Components.Crop, "frame" | "isCropped" | "texture">
>;

export type DepthProps = Partial<
  Pick<Phaser.GameObjects.Components.Depth, "depth">
>;

export type FlipProps = Partial<
  Pick<Phaser.GameObjects.Components.Flip, "flipX" | "flipY">
>;

export type MaskProps = Partial<
  Pick<Phaser.GameObjects.Components.Mask, "mask">
>;

export type OriginProps = Partial<
  Pick<
    Phaser.GameObjects.Components.Origin,
    "originX" | "originY" | "displayOriginX" | "displayOriginY"
  >
>;

export type PipelineProps = Partial<
  Pick<Phaser.GameObjects.Components.Pipeline, "defaultPipeline" | "pipeline">
>;

export type ScrollFactorProps = Partial<
  Pick<
    Phaser.GameObjects.Components.ScrollFactor,
    "scrollFactorX" | "scrollFactorY"
  >
>;

export type TextureCropProps = Partial<
  Pick<Phaser.GameObjects.Components.TextureCrop, "texture" | "frame">
>;
export type TintProps = Partial<
  Pick<
    Phaser.GameObjects.Components.Tint,
    | "isTinted"
    | "tint"
    | "tintBottomLeft"
    | "tintBottomRight"
    | "tintFill"
    | "tintTopLeft"
    | "tintTopRight"
  >
>;

export type TransformProps = Partial<
  Pick<
    Phaser.GameObjects.Components.Transform,
    "angle" | "rotation" | "x" | "y" | "z" | "w"
  > & {
    scale?: number | (Point & { point?: Point });
    allowRotation?: boolean;
  }
>;

export type VisibleProps = Partial<
  Pick<Phaser.GameObjects.Components.Visible, "visible">
>;

export interface AnimationProps {
  playingAnimation?: string;
  accumulator?: number;
  delay?: number;
  duration?: number;
  forward?: boolean;
  frameRate?: number;
  isPlaying?: boolean;
  msPerFrame?: number;
  skipMissedFrames?: boolean;
  repeat?: number;
  repeatDelay?: number;
  timeScale?: number;
  yoyo?: boolean;
}

// Arcade Physics
export interface AccelerationProps {
  accelerationX?: number;
  accelerationY?: number;
  acceleration?: number | Point;
}

export interface AngularProps {
  angularAcceleration?: number;
  angularDrag?: number;
  angularVelocity?: number;
}

export interface BounceProps {
  bounceX?: number;
  bounceY?: number;
  bounce?: number | Point;
  collideWorldBounds?: boolean;
  onWorldBounds?: boolean;
}

export interface DebugProps {
  debugBodyColor?: number;
  debugShowBody?: boolean;
  debugShowVelocity?: boolean;
}

export interface DragProps {
  damping?: number;
  dragX?: number;
  dragY?: number;
  drag?: number | Point;
  allowDrag?: boolean;
}

export interface EnableProps {
  disableBody?: boolean;
}

export interface FrictionProps {
  frictionX?: number;
  frictionY?: number;
  friction?: number | Point;
}

export interface GravityProps {
  allowGravity?: boolean;
  gravityX?: number;
  gravityY?: number;
  gravity?: number | Point;
}

export interface ImmovableProps {
  immovable?: boolean;
}

export interface MassProps {
  mass?: number;
}

export interface SizeProps {
  circle?: {
    radius: number;
    offsetX?: number;
    offsetY?: number;
  };
  offset?: {
    x?: number;
    y?: number;
  };
  size?: {
    width: number;
    height: number;
    center?: number;
  };
}

export interface VelocityProps {
  velocity?: number | Point;
  velocityX?: number;
  velocityY?: number;
  maxVelocity?: number | Point;
}
