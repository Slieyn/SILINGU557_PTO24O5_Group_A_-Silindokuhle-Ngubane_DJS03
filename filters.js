// Imports of modules
import { books } from "./data.js";
import { renderBookPreviews } from "./UI.js";
import { updateShowMoreButton } from "./pagination.js";
import { toggleOverlay } from "./UI.js";

/**
 * Filters books based on search criteria.
 * @param {Object} filters - The search criteria.
 * @param {string} filters.genre - The selected genre (or "any" for all).
 * @param {string} filters.title - The search title input.
 * @param {string} filters.author - The selected author (or "any" for all).
 * @returns {Array} Filtered list of books matching the criteria.
 */
export function filterBooks(filters) {
  return books.filter((book) => {
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    return genreMatch && titleMatch && authorMatch;
  });
}

/**
 * Handles the search event, updates UI, and returns filtered books.
 * @param {Event} event - The form submission event.
 * @returns {Array} The filtered list of books.
 */
// Extract filter values from form and filter books
export function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const matches = filterBooks(filters);

  // Update UI with filtered books
  document.querySelector("[data-list-items]").innerHTML = "";
  renderBookPreviews(matches);
  updateShowMoreButton(matches.length);

  // Close search overlay
  toggleOverlay("[data-search-overlay]", false);
  return matches;
}
