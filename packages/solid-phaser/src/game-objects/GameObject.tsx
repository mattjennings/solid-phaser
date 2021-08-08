import Phaser from "phaser";
import {
  createContext,
  JSX,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import { useGroup } from "./Group";
import { useScene } from "../Scene";
import { Ref, RefFunction } from "../types";
import {
  ApplyProps,
  createApplyPropsEffect,
} from "../util/createApplyPropsEffect";
import {
  applyAlphaProps,
  applyCropProps,
  applyOriginProps,
  applyScrollFactorProps,
  applyTextureProps,
  applyTintProps,
  applyTransformProps,
} from "./props";

export interface GameObjectProps<T extends Phaser.GameObjects.GameObject> {
  ref?: Ref<T>;
  children?: JSX.Element;

  /**
   * Assigns a name to the instance. This can helpful when you need to find
   * other instances by name.
   *
   * See: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#name__anchor
   */
  name?: string;

  /**
   * Assigns the active property to the instance. Setting this to false
   * will prevent onUpdate etc. props from running.
   *
   * See: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#active__anchor
   */
  active?: boolean;

  /**
   * Called during the scene's update loop
   */
  onUpdate?: (self: T) => void;

  /**
   * Called during the scene's preupdate loop
   */
  onPreUpdate?: (self: T) => void;

  /**
   * Called during the scene's postupdate loop
   */
  onPostUpdate?: (self: T) => void;
}

/**
 * The base GameObject component. It can be used to create a component for your own Phaser game object.
 *
 * Child components are able to use `useGameObject()` to get the instance.
 */
export function GameObject<
  Instance extends Phaser.GameObjects.GameObject,
  Props = Record<string, any>
>(
  props: GameObjectProps<Instance> & {
    /**
     * Called when it's time to instantiate the game object. You can return any
     * Phaser GameObject instance.
     */
    create: (scene: Phaser.Scene) => Instance;

    /**
     * The props to apply to the game object instance. By default, each prop is assigned to the
     * instance inside of an effect. To customize how a prop is set on the instance, see the `applyProps` prop
     *
     * The prop application happens immediately after creation and then gets updated in a deferred effect.
     *
     * Example:
     *
     * ```jsx
     * props={{
     *  text: 'hello',
     *  color: 'blue'
     * }}
     * ```
     *
     * is equivalent to
     *
     * ```js
     * instance.text = props.text
     * instance.color = props.color
     * createEffect(on(props.text, value => instance.text = value), { defer: true })
     * createEffect(on(props.color, value => instance.color = value), { defer: true })
     * ```
     */
    props?: Props;

    /**
     * Defines how props should be assigned to the instance. When a prop key exists in applyProps,
     * it will run the function provided. It is your responsibility to apply the prop appropriately here.
     *
     * Example:
     *
     * ```jsx
     * applyProps={{
     *  text: (instance, value) => instance.setText(value)
     * }}
     * ```
     *
     * is equivalent to
     *
     * ```js
     * instance.setText(props.text)
     * createEffect(on(props.text, value => instance.setText(props.text), { defer: true })
     * ```
     */
    applyProps?: ApplyProps<Instance, Partial<Props>>;
  }
) {
  const [local] = splitProps(props, [
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

  createApplyPropsEffect(
    instance,
    mergeProps({ name: props.name, active: props.active }, local.props ?? {}),
    mergeProps(
      {
        // apply GameObject.Component props by default
        ...applyAlphaProps,
        ...applyCropProps,
        ...applyOriginProps,
        ...applyScrollFactorProps,
        ...applyTextureProps,
        ...applyTintProps,
        ...applyTransformProps,
      },
      local.applyProps ?? {}
    ) as any
  );

  (props.ref as RefFunction)?.(instance);

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

const GameObjectContext = createContext<Phaser.GameObjects.GameObject>();

export function useGameObject<T extends Phaser.GameObjects.GameObject>() {
  return useContext(GameObjectContext) as T;
}

export default GameObject;
