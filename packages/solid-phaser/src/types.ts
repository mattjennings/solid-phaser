export type RefFunction<T = unknown> = (obj?: T) => void;
export type Ref<T = unknown> = T | RefFunction<T>;

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
