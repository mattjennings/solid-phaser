import { waitFor } from 'solid-testing-library'

/**
 * Waits until the function returns value that is not null or undefined
 */
export async function waitForValue(cb: () => any | Promise<any>) {
  return waitFor(async () => {
    const value = await cb()
    if (typeof value === 'undefined' || value === null) {
      throw new Error('No value returned')
    }
  })
}
