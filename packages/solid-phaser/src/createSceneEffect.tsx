import { createEffect, createSignal, on, ReturnTypes } from 'solid-js'
import { onSceneEvent } from 'solid-phaser'

/**
 * Creates an effect that is evaluated every pre-update event of the Scene. This is not reactive
 * to signals, but rather checks that the passed in function returns a different value from the
 * previous frame.
 *
 * Similar to solid's `on`, it can take an array of dependencies. You can also configure
 * the scene event at which the effect is evaluated.
 *
 * Usage:
 *
 * ```jsx
 * createSceneEffect(() => ref.body.velocity.x, (current, prev) => {
 *  // moving left
 *  if (current < 0) {
 *    ref.flipX = true
 *  }
 *  // moving right
 *  else if (current > 0) {
 *    ref.flipX = false
 *  }
 * })
 * ```
 **/
export function createSceneEffect<T extends Array<() => any> | (() => any)>(
  deps: T,
  cb: (input: ReturnTypes<T>, prevInput: ReturnTypes<T>) => void,
  opts: {
    event?: string
  } = {}
) {
  const { event = Phaser.Scenes.Events.PRE_UPDATE } = opts

  const isArray = Array.isArray(deps)
  const _deps = Array.isArray(deps) ? deps : [deps]
  const signals = _deps.map(() => createSignal())

  onSceneEvent(event, () => {
    signals.forEach(([, set], i) => {
      set(_deps[i]())
    })
  })

  if (isArray) {
    createEffect(
      on(
        signals.map(
          ([get]) =>
            () =>
              get()
        ),
        (next, prev) => {
          cb(next as ReturnTypes<T>, prev as ReturnTypes<T>)

          return next
        }
      )
    )
  } else {
    createEffect(
      on(signals[0][0], (next, prev) => {
        cb(next as ReturnTypes<T>, prev as ReturnTypes<T>)

        return next
      })
    )
  }
}
