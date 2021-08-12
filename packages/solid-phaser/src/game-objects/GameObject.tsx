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

  onDrag?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  onDragEnd?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  onDragEnter?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject
  ) => void;
  onDragLeave?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject
  ) => void;
  onDragOver?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject
  ) => void;
  onDragStart?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ) => void;
  onDrop?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject
  ) => void;
  onPointerDown?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) => void;
  onPointerMove?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) => void;
  onPointerOver?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) => void;
  onPointerOut?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    event: Phaser.Types.Input.EventData
  ) => void;
  onPointerUp?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) => void;
  onPointerWheel?: (
    self: Instance,
    pointer: Phaser.Input.Pointer,
    deltaX: number,
    deltaY: number,
    deltaZ: number,
    event: Phaser.Types.Input.EventData
  ) => void;
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
    "onDrag",
    "onDragEnd",
    "onDragEnter",
    "onDragLeave",
    "onDragOver",
    "onDragStart",
    "onDrop",
    "onPointerDown",
    "onPointerMove",
    "onPointerOut",
    "onPointerOver",
    "onPointerUp",
    "onPointerWheel",
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

  if (!scene.children.exists(instance)) {
    scene.add.existing(instance);
  }

  if (group) {
    group.add(instance);
  }

  onCleanup(() => {
    instance.destroy();
  });

  ////////////////// EVENTS //////////////////////
  if (local.onUpdate) {
    const cb = () => (instance.active ? local.onUpdate(instance) : void 0);
    scene.events.on("update", cb);
  }

  if (local.onPreUpdate) {
    const cb = () => (instance.active ? local.onPreUpdate(instance) : void 0);
    scene.events.on("preupdate", cb);
  }

  if (local.onPostUpdate) {
    const cb = () => (instance.active ? local.onPostUpdate(instance) : void 0);
    scene.events.on("postupdate", cb);
  }

  if (local.onDrag) {
    // @ts-ignore
    const cb = (...args) => local.onDrag(instance, ...args);
    instance.on("drag", cb);
  }
  if (local.onDragEnd) {
    // @ts-ignore
    const cb = (...args) => local.onDragEnd(instance, ...args);
    instance.on("dragend", cb);
  }
  if (local.onDragEnter) {
    // @ts-ignore
    const cb = (...args) => local.onDragEnter(instance, ...args);
    instance.on("dragenter", cb);
  }
  if (local.onDragLeave) {
    // @ts-ignore
    const cb = (...args) => local.onDragLeave(instance, ...args);
    instance.on("dragleave", cb);
  }
  if (local.onDragOver) {
    // @ts-ignore
    const cb = (...args) => local.onDragOver(instance, ...args);
    instance.on("dragover", cb);
  }
  if (local.onDragStart) {
    // @ts-ignore
    const cb = (...args) => local.onDragStart(instance, ...args);
    instance.on("dragstart", cb);
  }
  if (local.onDrop) {
    // @ts-ignore
    const cb = (...args) => local.onDrop(instance, ...args);
    instance.on("drop", cb);
  }

  if (local.onPointerDown) {
    // @ts-ignore
    const cb = (...args) => local.onPointerDown(instance, ...args);
    instance.on("pointerdown", cb);
  }
  if (local.onPointerMove) {
    // @ts-ignore
    const cb = (...args) => local.onPointerMove(instance, ...args);
    instance.on("pointermove", cb);
  }
  if (local.onPointerOut) {
    // @ts-ignore
    const cb = (...args) => local.onPointerOut(instance, ...args);
    instance.on("pointerout", cb);
  }
  if (local.onPointerOver) {
    // @ts-ignore
    const cb = (...args) => local.onPointerOver(instance, ...args);
    instance.on("pointerover", cb);
  }
  if (local.onPointerUp) {
    // @ts-ignore
    const cb = (...args) => local.onPointerUp(instance, ...args);
    instance.on("pointerup", cb);
  }
  if (local.onPointerWheel) {
    // @ts-ignore
    const cb = (...args) => local.onPointerWheel(instance, ...args);
    instance.on("wheel", cb);
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
