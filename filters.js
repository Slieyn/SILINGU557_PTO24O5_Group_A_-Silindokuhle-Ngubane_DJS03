import { books } from "./data.js";
import { renderBookPreviews } from "./ui.js";
import { updateShowMoreButton } from "./pagination.js";
import { toggleOverlay } from "./ui.js";

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

export function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const matches = filterBooks(filters);

  document.querySelector("[data-list-items]").innerHTML = "";
  renderBookPreviews(matches);
  updateShowMoreButton(matches.length);

  toggleOverlay("[data-search-overlay]", false);
  return matches;
}
