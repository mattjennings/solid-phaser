import { Accessor, createSignal } from 'solid-js'
import { onGameEvent } from 'solid-phaser'

/**
 * Converts the returned value into a signal that gets
 * updated every PRE_STEP event in the Game
 **/
export function gameSignal<T>(get: () => T): Accessor<T> {
  const [val, setVal] = createSignal<T>()

  onGameEvent(Phaser.Core.Events.PRE_STEP, () => {
    // @ts-ignore
    setVal(get())
  })
  return val
}
