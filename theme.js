/**
 * @file Theme management module that handles light and dark mode settings.
 * @module theme
 */

/**
 * Automatically applies the theme based on the user's system preference.
 * Uses the `prefers-color-scheme` media query to detect dark mode.
 */
export function applyTheme() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set theme based on system preference
  const theme = isDarkMode ? "night" : "day";
  setTheme(theme);
}

/**
 * Sets the theme colors for the application.
 *
 * @param {"day" | "night"} theme - The selected theme ("day" for light mode, "night" for dark mode).
 */
export function setTheme(theme) {
  const colors = {
    night: { dark: "255, 255, 255", light: "10, 10, 20" }, // Dark mode colors
    day: { dark: "10, 10, 20", light: "255, 255, 255" }, // Light mode colors
  };

  // Apply colors to CSS variables
  document.documentElement.style.setProperty(
    "--color-dark",
    colors[theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    colors[theme].light
  );
}

/**
 * Handles the theme selection form submission.
 * Retrieves the selected theme from the form and updates the theme accordingly.
 *
 * @param {Event} event - The form submission event.
 */
export function handleThemeSettings(event) {
  event.preventDefault();

  // Get the selected theme from the form
  const formData = new FormData(event.target);
  setTheme(formData.get("theme"));
}
