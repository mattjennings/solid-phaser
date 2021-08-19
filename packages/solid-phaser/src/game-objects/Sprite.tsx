import { createEffect, onMount, splitProps } from 'solid-js'
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
  startFrame?: number

  onAnimationComplete?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
  onAnimationRepeat?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
  onAnimationRestart?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
  onAnimationStart?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
  onAnimationStop?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
  onAnimationUpdate?: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
    gameObject: Instance,
    frameKey: string
  ) => void
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
    'startFrame',
    'onAnimationComplete',
    'onAnimationRepeat',
    'onAnimationRestart',
    'onAnimationStart',
    'onAnimationStop',
    'onAnimationUpdate',
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
          startFrame: local.startFrame,
        },
        true
      )
    } else {
      instance?.stop()
    }
  })

  onMount(() => {
    if (local.onAnimationComplete) {
      instance.on('animationcomplete', local.onAnimationComplete)
    }
    if (local.onAnimationRepeat) {
      instance.on('animationrepeat', local.onAnimationRepeat)
    }
    if (local.onAnimationRestart) {
      instance.on('animationrestart', local.onAnimationRestart)
    }
    if (local.onAnimationStart) {
      instance.on('animationstart', local.onAnimationStart)
    }
    if (local.onAnimationStop) {
      instance.on('animationstop', local.onAnimationStop)
    }
    if (local.onAnimationUpdate) {
      instance.on('animationupdate', local.onAnimationUpdate)
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
