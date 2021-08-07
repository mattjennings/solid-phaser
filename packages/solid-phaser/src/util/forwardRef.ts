export function forwardRef(props, variable) {
  return (el) => {
    variable = el;
    // @ts-ignore
    props.ref?.(el);
  };
}
