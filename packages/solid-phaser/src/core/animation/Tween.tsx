import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  splitProps,
} from "solid-js";
import { createTween, TweenConfig } from "./createTween";
import { useGameObject } from "../game-objects/GameObject";
import { pick } from "../util/pick";

type TweenAnimation = Record<string, any> & { transition?: TweenConfig };

export interface TweenProps extends TweenConfig {
  initial?: TweenAnimation;
  animate?: TweenAnimation;
  exit?: TweenAnimation;

  whileTap?: TweenAnimation;
  whileHover?: TweenAnimation;
}

export function Tween(p: TweenProps) {
  const gameObject = useGameObject();

  // prevent gameObject from being destroyed when parent <GameObject /> unmounts
  gameObject.ignoreDestroy = true;

  const [props, config] = splitProps(p, [
    "initial",
    "animate",
    "exit",
    "whileTap",
    "whileHover",
  ]);
  const [isExiting, setExiting] = createSignal(false);

  // when animating whileTap or whileHover, if no initial/animate is set
  // we need to track the values they were before the animation
  const [tapFallback, setTapFallback] = createSignal({});
  const [hoverFallback, setHoverFallback] = createSignal({});

  const [, setTween] = createTween(() => gameObject, {
    ...config,
    onStart: (tween, ...args) => {
      config?.onStart?.(tween, ...args);
      if (isExiting()) {
        tween.remove();
      }
    },
  });

  const [, setExitTween] = createTween(() => gameObject, {
    ...config,
    onStart: () => {
      setExiting(true);
      // clear the tween
      setTween({}, { duration: 0 });
    },
    onComplete: (...args) => {
      config?.onComplete?.(...args);
      gameObject.ignoreDestroy = false;
      gameObject.destroy();
    },
  });

  // set initial values on gameObject
  if (props.initial) {
    const { transition: _, ...values } = props.initial;
    // this is what tween does, so we'll do it too. feels dangerous though.
    Object.assign(gameObject, values);
  }

  // animate when props.animate updates
  createEffect(
    on(
      () => props.animate,
      () => {
        if (props.animate) {
          const { transition, ...values } = props.animate;
          setTween(values, { ...config, ...transition });
        }
      }
    )
  );

  // whileTap
  const animatePointerDown = () => {
    const { transition, ...newValues } = props.whileTap;
    setTapFallback(pick(gameObject, Object.keys(newValues) as any));
    setTween(newValues, { ...config, ...transition });
  };

  const animatePointerUp = () => {
    if (props.animate) {
      // animate to props.animate values but with props.whileTap transition
      const { transition: _, ...newValues } = props.animate;
      setTween(newValues, { ...config, ...props.whileTap.transition });
    } else {
      setTween(tapFallback(), { ...config, ...props.whileTap.transition });
      setTapFallback({});
    }
  };

  // whileHover
  const animatePointerOver = () => {
    const { transition, ...newValues } = props.whileHover;
    setHoverFallback(pick(gameObject, Object.keys(newValues) as any));
    setTween(newValues, { ...config, ...transition });
  };

  const animatePointerOut = () => {
    if (props.animate) {
      // animate to props.animate values but with props.whileHover transition
      const { transition: _, ...newValues } = props.animate;
      setTween(newValues, { ...config, ...props.whileHover.transition });
    } else {
      setTween(hoverFallback(), { ...config, ...props.whileHover.transition });
      setHoverFallback({});
    }
  };

  if (props.whileTap) {
    gameObject.on("pointerdown", animatePointerDown);
    gameObject.on("pointerup", animatePointerUp);
  }

  if (props.whileHover) {
    gameObject.on("pointerover", animatePointerOver);
    gameObject.on("pointerout", animatePointerOut);
  }

  onCleanup(() => {
    if (props.exit) {
      const { transition, ...values } = props.exit;
      setExitTween(values, { ...config, ...transition });
    }
  });

  return null;
}
