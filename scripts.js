// Import dependencies
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { applyTheme, handleThemeSettings } from "./theme.js";
import { updateShowMoreButton } from "./pagination.js";
import { handleSearch } from "./filters.js";
import { populateDropdown, toggleOverlay } from "./ui.js";
import "./footer.js"; // Ensures the footer loads

let page = 1; // Start at first page

// Keeps track of the current book matches
let matches = books;

// Initialize UI settings
applyTheme();
populateDropdown(genres, "[data-search-genres]", "All Genres");
populateDropdown(authors, "[data-search-authors]", "All Authors");
updateShowMoreButton(matches.length);

// Function to create a book preview button
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

// Function to render book previews
function renderBookPreviews(bookList) {
  const fragment = document.createDocumentFragment();
  bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });
  document.querySelector("[data-list-items]").appendChild(fragment);
}

// Render initial book previews
renderBookPreviews(matches);

// Function to filter books based on search criteria
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    matches = handleSearch(event);

    page = 1; // Reset page count on new search

    const messageElement = document.querySelector("[data-list-message]");
    messageElement.classList.toggle("list__message_show", matches.length < 1);

    document.querySelector("[data-list-items]").innerHTML = "";
    renderBookPreviews(matches);
    updateShowMoreButton(matches.length);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleOverlay("[data-search-overlay]", false);
  });

document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const nextBooks = matches.slice(startIndex, endIndex);

  nextBooks.forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
  updateShowMoreButton(matches.length);
});

// Event listeners for overlays
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

// Handle book preview clicks
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

// Add footer dynamically
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.createElement("book-footer");
  document.body.appendChild(footer);
});
