import { createEffect, on, splitProps } from "solid-js";

/**
 * Creates an effect for each prop that will apply to the instance initially and when they change
 */
export function createApplyPropsEffect<T = any, P = Record<string, any>>(
  instance: T,
  props: P,
  applyProps?: Partial<
    Record<keyof P, (instance: T, value: any, props: P) => any>
  >,
  {
    deferred,
  }: {
    /**
     * Keys of the props that should only applied for updates, otherwise
     * they are applied immediately
     */
    deferred?: Array<keyof P>;
  } = {}
) {
  const [, trimmed] = splitProps(props as any, ["children", "ref"]);
  const [deferredProps, otherProps] = splitProps(
    trimmed as any,
    deferred ?? []
  );

  function update(prop, value) {
    const applyFn = applyProps?.[prop];
    if (applyFn) {
      applyProps[prop](instance, value, props);
    } else if (applyFn !== null) {
      instance[prop] = value;
    }
  }

  Object.keys(otherProps).forEach((prop) => {
    update(prop, otherProps[prop]);

    createEffect(
      on(
        () => otherProps[prop],
        (val) => update(prop, val),
        { defer: true }
      )
    );
  });

  Object.keys(deferredProps).forEach((prop) => {
    if (prop === "children") {
      return;
    }

    createEffect(
      on(
        () => deferredProps[prop],
        (val) => update(prop, val),
        { defer: true }
      )
    );
  });
}
