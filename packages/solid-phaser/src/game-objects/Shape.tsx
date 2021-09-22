import Phaser from 'phaser'
import { Ref } from '../types'
import {
  ComposedGameObjectProps,
  GameObject,
  GameObjectProps,
} from './GameObject'
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

export interface ShapeProps<
  Instance extends Phaser.GameObjects.Shape,
  Props extends Record<string, any>
> extends GameObjectProps<Instance, Props>,
    AlphaProps,
    BlendModeProps,
    DepthProps,
    MaskProps,
    OriginProps,
    PipelineProps,
    ScrollFactorProps,
    TransformProps,
    VisibleProps,
    Partial<
      Pick<
        Instance,
        | 'fillColor'
        | 'fillAlpha'
        | 'strokeAlpha'
        | 'strokeColor'
        | 'isFilled'
        | 'isStroked'
      >
    > {
  // /**
  //  * Called when it's time to instantiate the game object. You can return any
  //  * Phaser GameObject instance.
  //  */
  // create: (scene: Phaser.Scene) => Instance
  // /**
  //  * Called when the component unmounts and the instance needs to be destroyed. By default,
  //  * it calls the GameObject's destroy method
  //  */
  // destroy?: (instance: Instance, scene: Phaser.Scene) => void
  // /**
  //  * When extra props are passed on to GameObject, they are assigned to the instance and updated
  //  * with an effect. i.e, a prop of `x={1}` would convert to `instance.x = 1`. `applyProps` lets you
  //  * customize how each extra prop is applied by providing the key of the prop and a function to run.
  //  *
  //  * This does not have to provide a method for each prop provided. If a key does not exist for the prop,
  //  * it will fallback to assigning the prop to the instance.
  //  *
  //  * Example:
  //  *
  //  * ```jsx
  //  * applyProps={{
  //  *  text: (instance, value) => instance.setText(value),
  //  *  style: (instance, value) => instance.setStyle(value)
  //  * }}
  //  * ```
  //  */
  // applyProps?: ApplyProps<Instance, Partial<Props>>
  // ref?: Ref<Instance>
}

export interface ComposedShapeProps<Instance extends Phaser.GameObjects.Shape>
  extends Omit<ShapeProps<Instance, {}>, 'create' | 'destroy' | 'applyProps'> {}

export function Shape<
  Instance extends Phaser.GameObjects.Shape,
  Props extends Record<string, any>
>(props: ShapeProps<Instance, Props> & Props) {
  return <GameObject {...props} />
}
