import { createEffect, on } from "solid-js";

export function createApplyPropsEffect<T = any, P = Record<string, any>>(
  instance: T,
  props: P,
  applyProps?: Partial<
    Record<keyof P, (instance: T, value: any, props: P) => any>
  >,
  { defer = false }: { defer?: boolean } = {}
) {
  function update(prop, value) {
    const applyFn = applyProps?.[prop];
    if (applyFn) {
      applyProps[prop](instance, value, props);
    } else if (applyFn !== null) {
      instance[prop] = value;
    }
  }

  Object.keys(props).forEach((prop) => {
    if (prop === "children") {
      return;
    }

    if (!defer) {
      update(prop, props[prop]);
    }

    createEffect(
      on(
        () => props[prop],
        (val) => update(prop, val),
        { defer: true }
      )
    );
  });
}
