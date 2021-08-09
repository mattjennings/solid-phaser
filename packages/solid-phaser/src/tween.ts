import Phaser from "phaser";
import { Accessor, createSignal } from "solid-js";
import { useScene } from "./Scene";
import warning from "tiny-warning";

export interface TweenConfig
  extends Omit<
    Phaser.Types.Tweens.TweenBuilderConfig,
    "targets" | "paused" | "props"
  > {
  ease: keyof typeof Phaser.Math.Easing | ((progress: number) => number);
}

type TweenTarget<T> = T | (() => T) | T[] | (() => T[]);

type SetTween<T> = (
  value: T | Partial<T> | ((prev: T) => T | Partial<T>),
  config?: TweenConfig
) => void;

type Unwrap<T> = T extends Array<infer U> ? U : T;

/**
 * Creates a Phaser.Tweens.Tween on the scene. It returns a signal but the setter function is
 * enhanced to take optional tween configuration.
 **/
export function createTween<T>(
  target: TweenTarget<T>,
  config: TweenConfig
): [Accessor<Unwrap<T>>, SetTween<Unwrap<T>>] {
  const scene = useScene();

  const [value, setValue] = createSignal<Unwrap<T>>(
    // @ts-ignore - i've gone too far into the typescript and cannot figure this one out
    isFunction(target) ? target() : target
  );

  let tween: Phaser.Tweens.Tween;

  function initTween(nextValue, nextConfig) {
    if (tween) {
      tween.remove();
    }

    const _target = isFunction(target) ? target() : target;
    const isObject = typeof _target === "object";
    let targets;

    if (isFunction(target)) {
      targets = target();
      warning(
        typeof targets !== "undefined",
        `createTween target function returned undefined. If this is for a ref, make sure you are setting the tweened value after mount (e.g. in an onMount or createEffect)`
      );
    } else if (isObject) {
      targets = value();
    } else {
      targets = { value: value() };
    }

    tween = scene.tweens.add({
      // update config
      ...config,
      ...nextConfig,
      targets,
      onUpdate: (tween, latest, ...args) => {
        if (isFunction(target)) {
          setValue(latest);
        } else if (isObject) {
          // not sure about this, but value won't update unless we create a new reference
          setValue({ ...latest });
        } else {
          setValue(latest.value);
        }
        config.onUpdate?.(
          tween,
          isObject ? { ...latest } : latest.value,
          ...args
        );
      },

      // assign values to tween
      ...(isObject ? { ...nextValue } : { value: nextValue }),
    });
  }

  const update: SetTween<Unwrap<T>> = (next, nextConfig) => {
    let nextValue = isFunction(next) ? next(value() as any) : next;

    initTween(nextValue, nextConfig);
  };

  return [value, update];
}

function isFunction<T>(target: T | Function): target is Function {
  return typeof target === "function";
}
