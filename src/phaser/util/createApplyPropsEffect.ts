import { createEffect } from "solid-js";

/**
 * Creates an effect for each prop that will apply to the instance initially and when they change
 */
export function createApplyPropsEffect<T = any, P = Record<string, any>>(
  instance: T,
  props: P,
  applyProps?: Partial<
    Record<keyof P, (instance: T, value: any, props: P) => any>
  >
) {
  Object.keys(props).forEach((prop) => {
    createEffect(() => {
      if (applyProps?.[prop]) {
        applyProps[prop](instance, props[prop]);
      } else {
        instance[prop] = props[prop];
      }
    });
  });
}
