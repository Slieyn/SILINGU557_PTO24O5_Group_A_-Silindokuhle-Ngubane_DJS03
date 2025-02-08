export function applyTheme() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = isDarkMode ? "night" : "day";
  setTheme(theme);
}

export function setTheme(theme) {
  const colors = {
    night: { dark: "255, 255, 255", light: "10, 10, 20" },
    day: { dark: "10, 10, 20", light: "255, 255, 255" },
  };

  document.documentElement.style.setProperty(
    "--color-dark",
    colors[theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    colors[theme].light
  );
}

// Handle theme settings form submission
export function handleThemeSettings(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  setTheme(formData.get("theme"));
}
