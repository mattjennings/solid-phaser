import { createEffect, splitProps } from 'solid-js'
import { RefFunction } from '../types'
import { ComposedGameObjectProps, GameObject } from './GameObject'
import {
  AlphaProps,
  BlendModeProps,
  ComputedSizeProps,
  DepthProps,
  FlipProps,
  MaskProps,
  OriginProps,
  PipelineProps,
  ScrollFactorProps,
  TextureProps,
  TintProps,
  TransformProps,
  VisibleProps,
  XY,
} from './props'

export interface TileSpriteProps
  extends ComposedGameObjectProps<Phaser.GameObjects.TileSprite>,
    AlphaProps,
    BlendModeProps,
    ComputedSizeProps,
    DepthProps,
    FlipProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TextureProps,
    TintProps,
    TransformProps,
    VisibleProps {
  /**
   * The horizontal and vertical scroll position of the Tile Sprite.
   */
  tilePosition?: XY

  /**
   * The horizontal and vertical scale of the Tile Sprite texture.
   */
  tileScale?: XY
}

export function TileSprite(props: TileSpriteProps) {
  return (
    <GameObject
      create={(scene) =>
        new Phaser.GameObjects.TileSprite(
          scene,
          props.x,
          props.y,
          props.width,
          props.height,
          props.texture,
          props.frame
        )
      }
      applyProps={{
        tilePosition: (instance, val) =>
          instance.setTilePosition(val.x ?? 0, val.y ?? 0),
        tileScale: (instance, val) =>
          instance.setTileScale(val.x ?? 1, val.y ?? 1),
      }}
      {...props}
    >
      {props.children}
    </GameObject>
  )
}
