// Import from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let matches = books;

// Class to manage book previews
class BookPreview {
  constructor({ author, id, image, title }) {
    this.author = author;
    this.id = id;
    this.image = image;
    this.title = title;
  }

  createElement() {
    const element = document.createElement("button");
    element.classList.add("preview");
    element.setAttribute("data-preview", this.id);
    element.innerHTML = `
            <img class="preview__image" src="${this.image}" />
            <div class="preview__info">
                <h3 class="preview__title">${this.title}</h3>
                <div class="preview__author">${authors[this.author]}</div>
            </div>
        `;
    return element;
  }
}

// Class to manage pagination and filtered books
class BookManager {
  constructor() {
    this.page = 1;
    this.matches = books; // Initially, matches contain all books
    this.starting = document.createDocumentFragment();
  }

  generatePreviews() {
    this.matches.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const preview = new BookPreview(book);
      document
        .querySelector("[data-list-items]")
        .appendChild(preview.createElement());
    });
  }
}

// Function to create a book preview button
function createBookPreviewButton(book) {
  const button = document.createElement("button");
  button.classList.add("book-preview");
  button.innerText = book.title;
  button.addEventListener("click", () => {
    // Add logic to handle button click, e.g., show book details
    console.log(`Book selected: ${book.title}`);
  });
  return button;
}

// Initialize and generate previews
const bookManager = new BookManager();
bookManager.generatePreviews();

// Event listener to render book previews
document.addEventListener("DOMContentLoaded", () => {
  renderBookPreviews(books);
});

// Function to render book previews
function renderBookPreviews(bookList) {
  const starting = document.createDocumentFragment(); // Define the starting variable
  bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    const button = createBookPreviewButton(book);
    starting.appendChild(button);
  });
  document.querySelector("[data-list-items]").appendChild(starting);
}

// Render initial book previews
renderBookPreviews(bookManager.matches);

// Function to populate dropdown menus
function populateDropdown(data, dropdownSelector, defaultText) {
  const dropdownFragment = document.createDocumentFragment();
  const defaultOption = document.createElement("option");
  defaultOption.value = "any";
  defaultOption.innerText = defaultText;
  dropdownFragment.appendChild(defaultOption);

  for (const [id, name] of Object.entries(data)) {
    const option = document.createElement("option");
    option.value = id;
    option.innerText = name;
    dropdownFragment.appendChild(option);
  }

  document.querySelector(dropdownSelector).appendChild(dropdownFragment);
}

// Populate genres and authors dropdowns
populateDropdown(genres, "[data-search-genres]", "All Genres");
populateDropdown(authors, "[data-search-authors]", "All Authors");

// Function to apply theme settings
function applyTheme() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = isDarkMode ? "night" : "day";
  const colors = {
    night: { dark: "255, 255, 255", light: "10, 10, 20" },
    day: { dark: "10, 10, 20", light: "255, 255, 255" },
  };

  const themeDropdown = document.querySelector("[data-settings-theme]");
  if (themeDropdown) themeDropdown.value = theme;

  document.documentElement.style.setProperty(
    "--color-dark",
    colors[theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    colors[theme].light
  );
}

// Call the function to apply theme on page load
applyTheme();

// Function to update the "Show More" button
function updateShowMoreButton(totalBooks, currentPage, booksPerPage) {
  const button = document.querySelector("[data-list-button]");
  if (!button) return;

  const remainingBooks = Math.max(totalBooks - currentPage * booksPerPage, 0);
  button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">(${remainingBooks})</span>
  `;
  button.disabled = remainingBooks === 0;
}

// Initialize "Show More" button state
updateShowMoreButton(matches.length, bookManager.page, BOOKS_PER_PAGE);

// Function to toggle overlay visibility
function toggleOverlay(overlaySelector, isOpen) {
  const overlay = document.querySelector(overlaySelector);
  if (overlay) {
    overlay.open = isOpen;
  } else {
    console.error(`Overlay not found: ${overlaySelector}`);
  }
}

// Event listeners for overlay actions
document
  .querySelector("[data-search-cancel]")
  .addEventListener("click", () =>
    toggleOverlay("[data-search-overlay]", false)
  );
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () =>
    toggleOverlay("[data-settings-overlay]", false)
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

// Function to handle theme settings form submission
function handleThemeSettings(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  const colors =
    theme === "night"
      ? { dark: "255, 255, 255", light: "10, 10, 20" }
      : { dark: "10, 10, 20", light: "255, 255, 255" };

  document.documentElement.style.setProperty("--color-dark", colors.dark);
  document.documentElement.style.setProperty("--color-light", colors.light);
  toggleOverlay("[data-settings-overlay]", false);
}

// Handle theme settings form submission
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", handleThemeSettings);

// Function to filter books based on search criteria
function filterBooks(filters) {
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

// Handle search form submission
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = filterBooks(filters);

    // Reset page number to 1 and update matches with the filtered books.
    bookManager.page = 1;

    //  Updates reassigned with the filtered books based on the search criteria.
    bookManager.matches = result;

    // Show or hide 'no results' message
    const messageElement = document.querySelector("[data-list-message]");
    if (result.length < 1) {
      messageElement.classList.add("list__message_show");
    } else {
      messageElement.classList.remove("list__message_show");
    }

    // Clear and update book list display
    document.querySelector("[data-list-items]").innerHTML = "";
    renderBookPreviews(result);
    updateShowMoreButton(
      bookManager.matches.length,
      bookManager.page,
      BOOKS_PER_PAGE
    );

    // Scroll to top and close search overlay
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleOverlay("[data-search-overlay]", false);
  });

// Handle 'Show More' button click
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  const nextBooks = matches.slice(
    bookManager.page * BOOKS_PER_PAGE,
    (bookManager.page + 1) * BOOKS_PER_PAGE
  );
  nextBooks.forEach((book) => {
    const button = createBookPreviewButton(book);
    fragment.appendChild(button);
  });
  document.querySelector("[data-list-items]").appendChild(fragment);
  bookManager.page += 1;
});

// Event listener for handling book preview clicks
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
