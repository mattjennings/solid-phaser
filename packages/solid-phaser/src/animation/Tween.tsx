import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  splitProps,
  untrack,
} from "solid-js";
import { createTween, TweenConfig, useScene } from "..";
import { useGameObject } from "../game-objects/GameObject";

type TweenAnimation = Record<string, any> & { transition?: TweenConfig };

export interface TweenProps extends TweenConfig {
  animate?: TweenAnimation;
  exit?: TweenAnimation;

  whileTap?: TweenAnimation;
  whileHover?: TweenAnimation;
}

export function Tween(p: TweenProps) {
  const scene = useScene();
  const gameObject = useGameObject();

  // @ts-ignore - inform <GameObject /> that we will handle unmounting (destroying)
  gameObject.__solid_deferred_unmount = true;

  const [props, config] = splitProps(p, [
    "animate",
    "exit",
    "whileTap",
    "whileHover",
  ]);
  const [isDestroyed, setDestroyed] = createSignal(false);

  function mergeTweenConfig(newConfig?: TweenConfig): TweenConfig {
    return {
      ...config,
      ...newConfig,
      onComplete: (...args) => {
        newConfig?.onComplete?.(...args);
        config?.onComplete?.(...args);

        if (isDestroyed()) {
          gameObject.destroy();
        }
      },
    };
  }

  const [, setTween] = createTween(() => gameObject, mergeTweenConfig(config));

  createEffect(
    on(
      () => props.animate,
      () => {
        const { transition, ...values } = props.animate;

        setTween(values, mergeTweenConfig(transition));
      }
    )
  );

  createEffect(() => {
    const { transition, ...values } = props.whileTap;
    const animateDown = () => {
      if (!isDestroyed()) {
        setTween(values, mergeTweenConfig(transition));
      }
    };
    const animateUp = () => {
      if (!isDestroyed()) {
        // animate to props.animate values but with props.whileTap transition
        const { transition: animateTransition, ...values } = props.animate;
        setTween(values, mergeTweenConfig(transition));
      }
    };
    gameObject.on("pointerdown", animateDown);
    gameObject.on("pointerup", animateUp);

    return () => {
      gameObject.off("pointerdown", animateDown);
      gameObject.off("pointerup", animateUp);
    };
  });

  onCleanup(() => {
    setDestroyed(true);

    if (props.exit) {
      const { transition, ...values } = props.exit;
      setTween(values, mergeTweenConfig(transition));
    } else {
      gameObject.destroy();
    }
  });

  return null;
}
