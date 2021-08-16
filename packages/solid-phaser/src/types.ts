export type RefFunction<T = unknown> = (obj?: T) => void
export type Ref<T = unknown> = T | RefFunction<T>
