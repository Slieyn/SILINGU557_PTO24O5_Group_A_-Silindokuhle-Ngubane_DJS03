/**
 * @file UI utility functions for managing overlays, dropdowns, and book previews.
 * @module ui
 */

import { authors } from "./data.js";

const BOOKS_PER_PAGE = 6; // Number of books displayed per page

/**
 * Toggles the visibility of an overlay (modal).
 *
 * @param {string} selector - The CSS selector of the overlay element.
 * @param {boolean} isOpen - Determines whether the overlay should be opened (true) or closed (false).
 */
export function toggleOverlay(selector, isOpen) {
  const overlay = document.querySelector(selector);
  if (overlay) overlay.open = isOpen;
}

/**
 * Populates a dropdown list with data options.
 *
 * @param {Object} data - The data object containing key-value pairs (e.g., authors or genres).
 * @param {string} selector - The CSS selector of the dropdown element.
 * @param {string} defaultText - The default option text (e.g., "All Authors", "All Genres").
 */
export function populateDropdown(data, selector, defaultText) {
  const dropdown = document.querySelector(selector);
  dropdown.innerHTML =
    `<option value="any">${defaultText}</option>` + // Default option
    Object.entries(data)
      .map(([id, name]) => `<option value="${id}">${name}</option>`)
      .join(""); // Convert data object into dropdown options
}

/**
 * Creates a book preview button element.
 *
 * @param {Object} book - The book object containing details like author, id, image, and title.
 * @param {string} book.id - The unique identifier of the book.
 * @param {string} book.image - The book cover image URL.
 * @param {string} book.title - The title of the book.
 * @param {string} book.author - The author ID (which maps to the `authors` object).
 * @returns {HTMLButtonElement} - A button element containing book preview details.
 */
export function createBookPreviewButton({ author, id, image, title }) {
  const button = document.createElement("button");
  button.classList.add("preview"); // Assigns class for styling
  button.setAttribute("data-preview", id); // Adds dataset for preview identification
  button.innerHTML = `
    <img class="preview__image" src="${image}" alt="Book Cover" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>`;
  return button;
}

/**
 * Renders book previews on the page.
 *
 * @param {Array<Object>} bookList - An array of book objects to be displayed.
 */
export function renderBookPreviews(bookList) {
  const fragment = document.createDocumentFragment(); // Improves performance by reducing reflows
  bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });

  // Append book previews to the list container
  document.querySelector("[data-list-items]").appendChild(fragment);
}
