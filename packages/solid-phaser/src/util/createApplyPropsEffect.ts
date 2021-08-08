import { createEffect, on, splitProps } from "solid-js";

export type ApplyProp<Instance, Props, Value> = (
  instance: Instance,
  value: Value,
  props: Props
) => any;

export type ApplyProps<Instance, Props extends Record<string, any>> = Partial<
  {
    [PropKey in keyof Props]: ApplyProp<Instance, Props, Props[PropKey]>;
  }
>;

/**
 * Creates an effect for each prop that will apply to the instance initially and when they change
 */
export function createApplyPropsEffect<
  Instance = any,
  Props = Record<string, any>
>(
  instance: Instance,
  props: Props,
  applyProps?: ApplyProps<Instance, Props>,
  {
    deferred,
  }: {
    /**
     * Keys of the props that should only applied for updates, otherwise
     * they are applied immediately
     */
    deferred?: Array<keyof Props>;
  } = {}
) {
  const [, trimmed] = splitProps((props as any) ?? {}, ["children", "ref"]);
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
    createEffect(
      on(
        () => deferredProps[prop],
        (val) => update(prop, val),
        { defer: true }
      )
    );
  });
}
