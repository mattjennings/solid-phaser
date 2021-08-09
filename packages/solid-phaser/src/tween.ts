import { Accessor, createSignal } from "solid-js";
import { useScene } from "./Scene";

export type TweenConfig = Omit<
  Phaser.Types.Tweens.TweenBuilderConfig,
  "targets" | "paused" | "props"
>;
export function createTween<T>(
  target: T | (() => T),
  config: TweenConfig
): [
  Accessor<T>,
  (
    value: T | Partial<T> | ((prev: T) => T | Partial<T>),
    config?: TweenConfig
  ) => void
] {
  const scene = useScene();

  const [value, setValue] = createSignal<T>(
    isGetter(target) ? target() : target
  );

  let tween: Phaser.Tweens.Tween;

  function initTween(nextValue, nextConfig) {
    if (tween) {
      tween.remove();
    }

    const _target = isGetter(target) ? target() : target;
    const isObject = typeof _target === "object";
    let mutable;

    if (isGetter(target)) {
      mutable = target();
    } else if (isObject) {
      mutable = value();
    } else {
      mutable = { value: value() };
    }

    tween = scene.tweens.add({
      ...config,
      ...nextConfig,
      onUpdate: (tween, latest, ...args) => {
        setValue(isObject ? { ...latest } : latest.value);
        config.onUpdate?.(
          tween,
          isObject ? { ...latest } : latest.value,
          ...args
        );
      },
      targets: mutable,
      ...(isObject ? { ...nextValue } : { value: nextValue }),
    });
  }

  function update(
    next: T | Partial<T> | ((prev: T) => T),
    nextConfig?: TweenConfig
  ) {
    // @ts-ignore
    let nextValue = typeof next === "function" ? next(value()) : next;

    initTween(nextValue, nextConfig);
  }

  return [value, update];
}

function isGetter<T>(target: T | (() => T)): target is () => T {
  return typeof target === "function";
}
