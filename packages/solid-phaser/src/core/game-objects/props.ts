import { ApplyProps } from "../util/createApplyPropsEffect";

export type XY = { x?: number; y?: number };

export type Corners = {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
};

export type AlphaProps = {
  alpha?: number | Corners;
};

export const applyAlphaProps: ApplyProps<
  Phaser.GameObjects.Components.Alpha,
  AlphaProps
> = {
  alpha: (instance, val) => {
    if (typeof val === "number") {
      instance.setAlpha(val);
    } else {
      instance.setAlpha(
        val.topLeft ?? 1,
        val.topRight ?? 1,
        val.bottomLeft ?? 1,
        val.bottomRight ?? 1
      );
    }
  },
};

export type CropProps = {
  crop?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
};

export const applyCropProps: ApplyProps<
  Phaser.GameObjects.Components.Crop,
  CropProps
> = {
  crop: (instance, val) =>
    val
      ? instance.setCrop(val.x, val.y, val.height, val.width)
      : instance.setCrop(),
};

export type OriginProps = {
  origin?: XY;
  displayOrigin?: XY;
};

export const applyOriginProps: ApplyProps<
  Phaser.GameObjects.Components.Origin,
  OriginProps
> = {
  origin: (instance, val) => instance.setOrigin(val.x ?? 0.5, val.y ?? 0.5),
  displayOrigin: (instance, val) =>
    instance.setDisplayOrigin(val.x ?? 0, val.y ?? 0),
};

export type ScrollFactorProps = {
  scrollFactor?: XY;
};

export const applyScrollFactorProps: ApplyProps<
  Phaser.GameObjects.Components.ScrollFactor,
  ScrollFactorProps
> = {
  scrollFactor: (instance, val) =>
    instance.setScrollFactor(val.x ?? 1, val.y ?? 1),
};

export type TextureProps = {
  texture?: string;
  frame?: string | number;
};

export const applyTextureProps: ApplyProps<
  Phaser.GameObjects.Components.Texture,
  TextureProps
> = {
  texture: (instance, val) => instance.setTexture(val),
  frame: (instance, val) => instance.setFrame(val),
};

export type TintProps = {
  tint?: Corners & {
    value?: number;
    fill?: boolean;
  };
};

export const applyTintProps: ApplyProps<
  Phaser.GameObjects.Components.Tint,
  TintProps
> = {
  tint: (instance, val) => {
    instance.tint = val.value;
    if (val) {
      if (val.fill) {
        instance.setTintFill(
          val.topLeft,
          val.topRight,
          val.bottomLeft,
          val.bottomRight
        );
      } else {
        instance.setTint(
          val.topLeft,
          val.topRight,
          val.bottomLeft,
          val.bottomRight
        );
      }
    } else {
      instance.clearTint();
    }
  },
};

export type TransformProps = Partial<
  Pick<
    Phaser.GameObjects.Components.Transform,
    "angle" | "rotation" | "x" | "y" | "z" | "w"
  > & {
    allowRotation?: boolean;
    scale?: XY;
  }
>;

export const applyTransformProps: ApplyProps<
  Phaser.GameObjects.Components.Transform,
  TransformProps
> = {
  scale: (instance, val) => instance.setScale(val.x ?? 1, val.y ?? 1),
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

export type DepthProps = Partial<
  Pick<Phaser.GameObjects.Components.Depth, "depth">
>;

export type FlipProps = Partial<
  Pick<Phaser.GameObjects.Components.Flip, "flipX" | "flipY">
>;

export type MaskProps = Partial<
  Pick<Phaser.GameObjects.Components.Mask, "mask">
>;

export type PipelineProps = Partial<
  Pick<Phaser.GameObjects.Components.Pipeline, "defaultPipeline" | "pipeline">
>;

export type VisibleProps = Partial<
  Pick<Phaser.GameObjects.Components.Visible, "visible">
>;
