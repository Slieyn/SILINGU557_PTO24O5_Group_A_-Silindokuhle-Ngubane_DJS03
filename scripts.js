//import from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

/**
 * Creates a dropdown with options from a given dataset.
 *
 * @param {Object} data - The dataset containing key-value pairs (id, name).
 * @param {string} dropdownSelector - The CSS selector for the target dropdown.
 * @param {string} defaultText - The text for the default option.
 */

/**
 * Keeps track of the current page number in pagination.
 * @type {number}
 */
let page = 1;

/**
 * Stores the filtered book results.
 * @type {Array}
 */
let matches = books;

/**
 * Creates a document fragment to store book preview elements.
 * Improves performance by reducing direct DOM manipulation.
 */
const starting = document.createDocumentFragment();

// Creates Preview Button for initial book list
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

  starting.appendChild(element);
}

// Append the generated book previews to the DOM
document.querySelector("[data-list-items]").appendChild(starting);

//Genres and Authors

/**
 * Populates a dropdown menu with options based on a provided dataset.
 *
 * @param {Object} data - An object containing key-value pairs (id, name).
 * @param {string} dropdownSelector - The CSS selector for the target dropdown.
 * @param {string} defaultText - The text for the default option.
 */
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

// Populate genres and authors dropdowns using the reusable function
populateDropdown(genres, "[data-search-genres]", "All Genres");
populateDropdown(authors, "[data-search-authors]", "All Authors");

/**
 * Applies the theme settings based on user preference.
 * Detects the system's preferred color scheme and updates the UI accordingly.
 */
function applyTheme() {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = isDarkMode ? "night" : "day";
  const colors = {
    night: { dark: "255, 255, 255", light: "10, 10, 20" },
    day: { dark: "10, 10, 20", light: "255, 255, 255" },
  };

  // Set theme dropdown value
  const themeDropdown = document.querySelector("[data-settings-theme]");
  if (themeDropdown) themeDropdown.value = theme;

  // Apply CSS variables
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

/**
 * Updates the "Show More" button text and status based on available books.
 *
 * @param {number} totalBooks - The total number of books.
 * @param {number} currentPage - The current page number.
 * @param {number} booksPerPage - Number of books displayed per page.
 */
function updateShowMoreButton(totalBooks, currentPage, booksPerPage) {
  const button = document.querySelector("[data-list-button]");
  if (!button) return;

  // Calculate remaining books
  const remainingBooks = Math.max(totalBooks - currentPage * booksPerPage, 0);

  // Update button text and disable state
  button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">(${remainingBooks})</span>
  `;
  button.disabled = remainingBooks === 0;
}

// Example usage
// Initialize "Show More" button state
updateShowMoreButton(matches.length, page, BOOKS_PER_PAGE);

// Function to toggle the visibility of an overlay
/**
 * Toggles the open state of the given overlay.
 * @param {string} overlaySelector - The selector of the overlay element.
 * @param {boolean} isOpen - The state to set the overlay to (true for open, false for closed).
 */
function toggleOverlay(overlaySelector, isOpen) {
  const overlay = document.querySelector(overlaySelector);
  if (overlay) {
    overlay.open = isOpen;
  } else {
    console.error(`Overlay not found: ${overlaySelector}`);
  }
}

// Close search overlay when cancel is clicked
/**
 * Event listener for canceling the search overlay.
 */
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  toggleOverlay("[data-search-overlay]", false);
});

// Close settings overlay when cancel is clicked
/**
 * Event listener for canceling the settings overlay.
 */
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    toggleOverlay("[data-settings-overlay]", false);
  });

// Open search overlay and focus on the search title when search is clicked
/**
 * Event listener for opening the search overlay and focusing on the search title.
 */
document.querySelector("[data-header-search]").addEventListener("click", () => {
  toggleOverlay("[data-search-overlay]", true);
  const searchTitle = document.querySelector("[data-search-title]");
  if (searchTitle) {
    searchTitle.focus();
  } else {
    console.error("Search title element not found.");
  }
});

// Open settings overlay when settings is clicked
/**
 * Event listener for opening the settings overlay.
 */
document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    toggleOverlay("[data-settings-overlay]", true);
  });

// Close list overlay when close is clicked
/**
 * Event listener for closing the active list overlay.
 */
document.querySelector("[data-list-close]").addEventListener("click", () => {
  toggleOverlay("[data-list-active]", false);
});

// Handle theme settings form submission
/**
 * Event listener for handling theme selection.
 * Updates the CSS variables based on the selected theme.
 *
 * @param {Event} event - The form submission event.
 */
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    // Apply selected theme colors
    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }

    // Close the settings overlay
    document.querySelector("[data-settings-overlay]").open = false;
  });

// Handle search form submission
/**
 * Event listener for handling book search functionality.
 * Filters books based on user input (title, author, genre) and updates the book list.
 *
 * @param {Event} event - The form submission event.
 */

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    // Filter books based on selected genre, author, and title match
    for (const book of books) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    // Show or hide 'no results' message
    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    // Clear and update book list display
    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);

      element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

      newItems.appendChild(element);
    }

    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>
    `;

    // Scroll to top and close search overlay
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

// Handle 'Show More' button click
/**
 * Event listener for loading more books when 'Show More' is clicked.
 * Loads additional books from the current search results.
 */
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
});

//  Event listener for handling book preview clicks
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }
    // If a book is selected (active),update the details in the book preview overlay will be displayed
    if (active) {
      // Open the book preview overlay
      document.querySelector("[data-list-active]").open = true;

      // Update the book preview image (a blurred background)
      document.querySelector("[data-list-blur]").src = active.image;

      // Update the main book preview image
      document.querySelector("[data-list-image]").src = active.image;

      // Set the book title in the preview
      document.querySelector("[data-list-title]").innerText = active.title;

      // Set the book title, including the author's name and the published year
      document.querySelector("[data-list-subtitle]").innerText =
        `${authors[active.author]} (${new Date(active.published).getFullYear()})`;

      // Update the book decsription in the preview
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });
