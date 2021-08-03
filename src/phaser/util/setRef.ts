export function setRef(refContainer, val) {
  if (typeof refContainer.ref === "function") {
    refContainer.ref(val);
  } else {
    refContainer.ref = val;
  }
}
