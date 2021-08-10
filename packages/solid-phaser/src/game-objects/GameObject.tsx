import Phaser from "phaser";
import {
  createContext,
  createEffect,
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

export interface GameObjectProps<
  Instance extends Phaser.GameObjects.GameObject,
  Props extends Record<string, any>
> {
  /**
   * Called when it's time to instantiate the game object. You can return any
   * Phaser GameObject instance.
   */
  create: (scene: Phaser.Scene) => Instance;

  /**
   * When extra props are passed on to GameObject, they are assigned to the instance and updated
   * with an effect. i.e, a prop of `x={1}` would convert to `instance.x = 1`. `applyProps` lets you
   * customize how each extra prop is applied by providing the key of the prop and a function to run.
   *
   * This does not have to provide a method for each prop provided. If a key does not exist for the prop,
   * it will fallback to assigning the prop to the instance.
   *
   * Example:
   *
   * ```jsx
   * applyProps={{
   *  text: (instance, value) => instance.setText(value),
   *  style: (instance, value) => instance.setStyle(value)
   * }}
   * ```
   */
  applyProps?: ApplyProps<
    Instance,
    Omit<Partial<Props>, "create" | "applyProps">
  >;

  ref?: Ref<Instance>;
  children?: JSX.Element;

  /**
   * Assigns a name to the instance. This can helpful when you need to find
   * other instances by name.
   *
   * See: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html#name__anchor
   */
  name?: string;

  /**
   * Enables input events on the GameObject. Phaser will use the texture to determine the
   * hit area. If this GameObject does not have a texture then you will need to manually
   * set the hit area by passing in an object
   **/
  interactive?: boolean | Phaser.Types.Input.InputConfiguration;

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
  onUpdate?: (self: Instance) => void;

  /**
   * Called during the scene's preupdate loop
   */
  onPreUpdate?: (self: Instance) => void;

  /**
   * Called during the scene's postupdate loop
   */
  onPostUpdate?: (self: Instance) => void;

  onPointerDown?: (self: Instance) => void;
  onPointerUp?: (self: Instance) => void;
}

/**
 * For components that render a GameObject and inherit GameObjectProps
 **/
export interface ComposedGameObjectProps<
  Instance extends Phaser.GameObjects.GameObject
> extends Omit<GameObjectProps<Instance, {}>, "create" | "applyProps"> {}

/**
 * The base GameObject component. It can be used to create a component for your own Phaser game object.
 *
 * Child components are able to use `useGameObject()` to get the instance.
 */
export function GameObject<
  Instance extends Phaser.GameObjects.GameObject,
  Props = Record<string, any>
>(props: GameObjectProps<Instance, Props> & Props) {
  const [local, restProps] = splitProps(props, [
    "applyProps",
    "create",
    "onUpdate",
    "onPreUpdate",
    "onPostUpdate",
    "onPointerDown",
    "onPointerUp",
  ]);

  const scene = useScene();
  const group = useGroup();

  let instance = local.create(scene);

  createApplyPropsEffect(
    instance,
    mergeProps(
      {
        name: props.name,
        active: props.active ?? true,
        interactive: props.interactive,
      },
      restProps ?? {}
    ),
    mergeProps(
      // apply GameObject.Component props by default
      {
        ...applyAlphaProps,
        ...applyCropProps,
        ...applyOriginProps,
        ...applyScrollFactorProps,
        ...applyTextureProps,
        ...applyTintProps,
        ...applyTransformProps,
        interactive: (
          instance: Phaser.GameObjects.GameObject,
          value: GameObjectProps<Instance, Props>["interactive"]
        ) => {
          if (!value) {
            instance.disableInteractive();
          } else {
            if (typeof value === "boolean") {
              if (value) {
                instance.setInteractive();
              }
            } else {
              instance.setInteractive(value);
            }
          }
        },
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
    // @ts-ignore - another component (such as <Tween /> will handle the removal of the game object)
    if (!instance.__solid_deferred_unmount) {
      instance.destroy();
    }

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

  createEffect(() => {
    if (local.onPointerDown) {
      const cb = () => local.onPointerDown(instance);

      instance.on("pointerdown", cb);

      return () => {
        instance.off("pointerdown", cb);
      };
    }
  });
  createEffect(() => {
    if (local.onPointerUp) {
      const cb = () => local.onPointerUp(instance);

      instance.on("pointerup", cb);

      return () => {
        instance.off("pointerup", cb);
      };
    }
  });

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
