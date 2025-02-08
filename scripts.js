/**
 * @file Main JavaScript file that initializes the book browsing application.
 * Handles theme settings, book searching, pagination, and event listeners.
 * @module main
 */

// Import dependencies
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { applyTheme, handleThemeSettings } from "./theme.js";
import { updateShowMoreButton } from "./pagination.js";
import { handleSearch } from "./filters.js";
import { populateDropdown, toggleOverlay } from "./UI.js";
import "./footer.js"; // Ensures the footer loads

let page = 1; // Keeps track of the current page
let matches = books; // Stores the current list of books matching search criteria

// --------------------- UI Initialization ---------------------

// Apply theme settings
applyTheme();

// Populate dropdown menus with available genres and authors
populateDropdown(genres, "[data-search-genres]", "All Genres");
populateDropdown(authors, "[data-search-authors]", "All Authors");

// Update the "Show More" button based on initial book count
updateShowMoreButton(matches.length);

/**
 * Creates a book preview button element.
 *
 * @param {Object} book - The book object containing details.
 * @param {string} book.author - The ID of the book's author.
 * @param {string} book.id - The unique ID of the book.
 * @param {string} book.image - The book cover image URL.
 * @param {string} book.title - The title of the book.
 * @returns {HTMLButtonElement} - The generated book preview button.
 */
function createBookPreviewButton({ author, id, image, title }) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);
  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;
  return element;
}

/**
 * Renders a list of book previews.
 *
 * @param {Array<Object>} bookList - The array of book objects to display.
 */
function renderBookPreviews(bookList) {
  const fragment = document.createDocumentFragment();

  // Display only the first page of results
  bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });

  document.querySelector("[data-list-items]").appendChild(fragment);
}

// Render the initial set of book previews
renderBookPreviews(matches);

// --------------------- Event Listeners ---------------------

/**
 * Handles book search submission, filters books, and updates the UI.
 *
 * @param {Event} event - The form submission event.
 */
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    // Get search results
    matches = handleSearch(event);
    page = 1; // Reset pagination

    // Show or hide "no results" message
    const messageElement = document.querySelector("[data-list-message]");
    messageElement.classList.toggle("list__message_show", matches.length < 1);

    // Clear the book list and re-render with filtered results
    document.querySelector("[data-list-items]").innerHTML = "";
    renderBookPreviews(matches);
    updateShowMoreButton(matches.length);

    // Scroll to top and close search overlay
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleOverlay("[data-search-overlay]", false);
  });

/**
 * Handles "Show More" button click to load additional book previews.
 */
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const nextBooks = matches.slice(startIndex, endIndex);

  nextBooks.forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1; // Increment page count
  updateShowMoreButton(matches.length);
});

// --------------------- Overlay Controls ---------------------

// Handles opening and closing of settings and search overlays
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", handleThemeSettings);
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () =>
    toggleOverlay("[data-settings-overlay]", false)
  );
document
  .querySelector("[data-search-cancel]")
  .addEventListener("click", () =>
    toggleOverlay("[data-search-overlay]", false)
  );
document.querySelector("[data-header-search]").addEventListener("click", () => {
  toggleOverlay("[data-search-overlay]", true);
  document.querySelector("[data-search-title]").focus();
});
document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () =>
    toggleOverlay("[data-settings-overlay]", true)
  );
document
  .querySelector("[data-list-close]")
  .addEventListener("click", () => toggleOverlay("[data-list-active]", false));

// --------------------- Book Preview Handling ---------------------

/**
 * Handles clicks on book previews to display detailed information.
 *
 * @param {Event} event - The click event on the book list.
 */
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    const active = pathArray.find((node) => node?.dataset?.preview);

    if (active) {
      const selectedBook = books.find(
        (book) => book.id === active.dataset.preview
      );

      if (selectedBook) {
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = selectedBook.image;
        document.querySelector("[data-list-image]").src = selectedBook.image;
        document.querySelector("[data-list-title]").innerText =
          selectedBook.title;
        document.querySelector("[data-list-subtitle]").innerText =
          `${authors[selectedBook.author]} (${new Date(selectedBook.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          selectedBook.description;
      }
    }
  });

// --------------------- Footer Initialization ---------------------

/**
 * Adds a footer dynamically when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.createElement("book-footer");
  document.body.appendChild(footer);
});
