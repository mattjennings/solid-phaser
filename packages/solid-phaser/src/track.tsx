import { Accessor, createSignal } from 'solid-js'
import { onGameEvent } from './events'

/**
 * Tracks the returned value in the function every frame and returns
 * a getter function for the current value. By default, it updates in the Game's
 * PRE_STEP event.
 **/
export function track<T>(
  get: () => T,
  opts: { event?: string } = {}
): Accessor<T> {
  const { event = Phaser.Core.Events.PRE_STEP } = opts
  const [val, setVal] = createSignal<T>()

  onGameEvent(event, () => {
    // @ts-ignore
    setVal(get())
  })
  return val
}
