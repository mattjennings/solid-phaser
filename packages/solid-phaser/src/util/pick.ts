export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const picked: any = {}
  keys.forEach((key) => {
    picked[key] = obj[key]
  })
  return picked
}
