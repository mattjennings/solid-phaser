(() => {
  const root = document.documentElement;

  if (
    localStorage.theme === "light" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: light)").matches)
  ) {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
})();
