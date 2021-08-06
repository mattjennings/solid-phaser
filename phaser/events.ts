import { createEffect } from "solid-js";
import { useGame } from "./Game";
import { useScene } from "./Scene";

/**
 * Sets up an event listener on scene.input
 */
export function onInputEvent(
  event: string,
  callback: (...args: unknown[]) => void
) {
  const scene = useScene();

  createEffect(() => {
    scene.input.on(event, callback);
    return () => {
      scene.input.off(event, callback);
    };
  });
}

/**
 * Sets up an event listener on scene.events
 */
export function onSceneEvent(
  event: string,
  callback: (...args: unknown[]) => void
) {
  const scene = useScene();

  createEffect(() => {
    scene.events.on(event, callback);
    return () => {
      scene.events.off(event, callback);
    };
  });
}

/**
 * Sets up an event listener on game.events
 */
export function onGameEvent(
  event: string,
  callback: (...args: unknown[]) => void
) {
  const game = useGame();

  createEffect(() => {
    game.events.on(event, callback);
    return () => {
      game.events.off(event, callback);
    };
  });
}
