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
} from './props'

export interface SpriteProps<
  Instance extends Phaser.GameObjects.Sprite = Phaser.GameObjects.Sprite
> extends ComposedGameObjectProps<Instance>,
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
  play?: string
  x?: number
  y?: number

  delay?: number
  duration?: number
  forward?: boolean
  frameRate?: number
  msPerFrame?: number
  skipMissedFrames?: boolean
  repeat?: number
  repeatDelay?: number
  timeScale?: number
  yoyo?: boolean
}

export function Sprite<
  Instance extends Phaser.GameObjects.Sprite = Phaser.GameObjects.Sprite
>(props: SpriteProps<Instance>) {
  const [local, other] = splitProps(props, [
    'ref',
    'play',
    'repeat',
    'delay',
    'repeatDelay',
    'duration',
    'frameRate',
    'msPerFrame',
    'timeScale',
    'yoyo',
    'skipMissedFrames',
  ])
  let instance: Instance

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
      )
    } else {
      instance?.stop()
    }
  })

  return (
    <GameObject
      ref={(el) => {
        instance = el
        ;(local.ref as RefFunction)?.(el)
      }}
      create={(scene) =>
        new Phaser.GameObjects.Sprite(
          scene,
          props.x,
          props.y,
          props.texture,
          props.frame
        ) as Instance
      }
      {...other}
    >
      {props.children}
    </GameObject>
  )
}
