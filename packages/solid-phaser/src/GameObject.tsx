import Phaser from "phaser";
import {
  createContext,
  JSX,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import { useGroup } from "./Group";
import { useScene } from "./Scene";
import { createApplyPropsEffect } from "./util/createApplyPropsEffect";

export const GameObjectContext = createContext<Phaser.GameObjects.GameObject>();

export function useGameObject<T extends Phaser.GameObjects.GameObject>() {
  return useContext(GameObjectContext) as T;
}

export function GameObject<
  T extends Phaser.GameObjects.GameObject,
  P = Record<string, any>
>(
  props: GameObjectProps<T> & {
    props?: P;
    applyProps?: Partial<
      Record<keyof P, (instance: T, value: any, props: P) => any>
    >;
  }
) {
  const [local, other] = splitProps(props, [
    "props",
    "applyProps",
    "create",
    "onUpdate",
    "onPreUpdate",
    "onPostUpdate",
  ]);
  const scene = useScene();
  const group = useGroup();

  let instance = local.create(scene);

  createApplyPropsEffect(instance, local.props, local.applyProps);

  // @ts-ignore
  props.ref?.(instance);

  let listeners = [];

  if (!scene.children.exists(instance)) {
    scene.add.existing(instance);
  }

  if (group) {
    group.add(instance);
  }

  onCleanup(() => {
    instance.destroy();

    listeners.forEach((listener) => listener());
  });

  if (local.onUpdate) {
    const cb = () => (instance.active ? local.onUpdate(instance) : void 0);
    scene.events.on("update", cb);

    listeners.push(() => scene.events.off("update", cb));
  }

  if (local.onPreUpdate) {
    const cb = () => (instance.active ? local.onPreUpdate(instance) : void 0);
    scene.events.on("preupdate", cb);

    listeners.push(() => scene.events.off("preupdate", cb));
  }

  if (local.onPostUpdate) {
    const cb = () => (instance.active ? local.onPostUpdate(instance) : void 0);
    scene.events.on("postupdate", cb);

    listeners.push(() => scene.events.off("postupdate", cb));
  }

  return (
    <GameObjectContext.Provider value={instance}>
      {props.children}
    </GameObjectContext.Provider>
  );
}

export default GameObject;

/**************************
 *        PROPS           *
 **************************/

export interface GameObjectProps<T extends Phaser.GameObjects.GameObject> {
  ref?: T | ((obj?: T) => void);
  children?: JSX.Element;
  name?: string;
  active?: boolean;

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
    "angle" | "rotation" | "x" | "y" | "z" | "w" | "scale" | "scaleX" | "scaleY"
  > & {
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
