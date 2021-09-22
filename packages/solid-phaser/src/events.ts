import { onCleanup } from 'solid-js'
import { useGame } from './Game'
import { useScene } from './Scene'

/**
 * Sets up an event listener on scene.input
 */
export function onInputEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  const scene = useScene()

  scene.input.on(event, callback)
  onCleanup(() => scene.input.off(event, callback))
}

/**
 * Sets up an event listener on scene.events
 */
export function onSceneEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  const scene = useScene()

  scene.events.on(event, callback)
  onCleanup(() => scene.events.off(event, callback))
}

/**
 * Sets up an event listener on game.events
 */
export function onGameEvent(event: string, callback: (...args: any[]) => void) {
  const game = useGame()

  game.events.on(event, callback)
  onCleanup(() => game.events.off(event, callback))
}
