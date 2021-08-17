import { children, onCleanup, onMount } from 'solid-js'
import Phaser from 'phaser'
import { GameObject, ComposedGameObjectProps } from './GameObject'
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
} from './props'
import warning from 'tiny-warning'

export interface HTMLProps
  extends ComposedGameObjectProps<Phaser.GameObjects.DOMElement>,
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
    VisibleProps {}

/**
 * Wraps an HTML element and gives it GameObject properties. It must have a single DOM child.
 *
 * Your <Game /> component must have `createContainer` set to true in the `dom` prop,
 * as well as `parent` with the id of your root container element.
 **/
export function HTML(props: HTMLProps) {
  const child = children(() => props.children)
  const el = child() as HTMLElement

  if (!el || Array.isArray(el)) {
    throw new Error(`<HTML /> must have a single DOM element as its children`)
  }

  return (
    <GameObject
      ref={props.ref}
      create={(scene) => {
        const instance = new Phaser.GameObjects.DOMElement(
          scene,
          props.x ?? 0,
          props.y ?? 0,
          el
        )

        // needs to be set on mount so element can be moved
        // from where solid renders it to the game's dom container
        onMount(() => {
          instance.setElement(el)
        })

        onCleanup(() => {
          // @ts-ignore
          instance.removeElement = () => {}
        })

        return instance
      }}
      {...props}
    >
      {el}
    </GameObject>
  )
}
