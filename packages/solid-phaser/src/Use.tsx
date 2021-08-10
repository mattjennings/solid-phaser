import { useGameObject } from "./game-objects/GameObject";

export interface UseProps<
  A extends any[],
  T extends (instance: unknown, ...args: A) => void
> {
  action: T;
  args?: A;
}

/**
 * A helper component to replicate use: directives on GameObject components. Must be a child of a GameObject.
 *
 * ```jsx
 *  <Use
 *    action={(instance, arg1, arg2) => instance.doSomething(arg1, arg2) }
 *    args={["hello", "world"]}
 * />
 * ```
 **/
export function Use<
  A extends any[],
  T extends (instance: unknown, ...args: A) => void
>(props: UseProps<A, T>) {
  const obj = useGameObject();

  props.action(obj, ...props.args);

  return null;
}
