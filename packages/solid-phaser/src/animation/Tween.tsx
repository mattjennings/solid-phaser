import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  splitProps,
  untrack,
} from "solid-js";
import { createTween, TweenConfig, useScene } from "..";
import { useGameObject } from "../game-objects/GameObject";

type TweenAnimation = Record<string, any> & { transition?: TweenConfig };

export interface TweenProps extends TweenConfig {
  initial?: TweenAnimation;
  animate?: TweenAnimation;
  exit?: TweenAnimation;

  whileTap?: TweenAnimation;
  // whileHover?: TweenAnimation;
}

export function Tween(p: TweenProps) {
  const scene = useScene();
  const gameObject = useGameObject();

  // @ts-ignore - inform <GameObject /> that we will handle unmounting (destroying)
  gameObject.__solid_deferred_unmount = true;

  const [props, config] = splitProps(p, [
    "initial",
    "animate",
    "exit",
    "whileTap",
    // "whileHover",
  ]);
  const [isExiting, setExiting] = createSignal(false);

  function mergeTweenConfig(newConfig?: TweenConfig): TweenConfig {
    return {
      ...config,
      ...newConfig,
    };
  }

  const mergedConfig = mergeTweenConfig(config);
  const [, setTween] = createTween(() => gameObject, {
    ...mergedConfig,
    onStart: (tween) => {
      if (isExiting()) {
        tween.remove();
      }
    },
  });

  const [, setExitTween] = createTween(() => gameObject, {
    ...mergedConfig,
    onStart: () => {
      setExiting(true);
      setTween({}, { duration: 0 });
    },
    onComplete: (...args) => {
      mergedConfig?.onComplete?.(...args);
      gameObject.destroy();
    },
  });

  // set initial values on gameObject
  if (props.initial) {
    const { transition, ...values } = props.initial;
    // this is what tween does, so we'll do it too. feels dangerous though.
    Object.assign(gameObject, values);
  }

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
    const config = mergeTweenConfig(transition);

    const animateDown = () => {
      setTween(values, config);
    };

    const animateUp = () => {
      // animate to props.animate values but with props.whileTap transition
      const { transition: animateTransition, ...values } = props.animate;
      const config = mergeTweenConfig(transition);

      setTween(values, config);
    };
    gameObject.on("pointerdown", animateDown);
    gameObject.on("pointerup", animateUp);

    return () => {
      gameObject.off("pointerdown", animateDown);
      gameObject.off("pointerup", animateUp);
    };
  });

  onCleanup(() => {
    if (props.exit) {
      const { transition, ...values } = props.exit;
      setExitTween(values, mergeTweenConfig(transition));
    } else {
      gameObject.destroy();
    }
  });

  return null;
}
