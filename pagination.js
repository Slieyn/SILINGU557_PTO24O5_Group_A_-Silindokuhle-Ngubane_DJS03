import { BOOKS_PER_PAGE } from "./data.js";
import { createBookPreviewButton } from "./UI.js";

/**
 * @file Handles pagination logic, including updating the "Show More" button and loading additional book previews.
 * @module pagination
 */

export let page = 1; // Keeps track of the current pagination state

/**
 * Updates the "Show More" button based on the number of remaining books.
 *
 * @param {number} totalBooks - The total number of books that match the current filters.
 */
export function updateShowMoreButton(totalBooks) {
  const button = document.querySelector("[data-list-button]");
  if (!button) return; // Ensure the button exists before attempting to modify it.

  const remainingBooks = Math.max(totalBooks - page * BOOKS_PER_PAGE, 0);

  // Update button text to show the remaining book count
  button.innerHTML = `
    <span>Show more</span> 
    <span class="list__remaining">(${remainingBooks})</span>
  `;

  // Disable the button if there are no more books to show
  button.disabled = remainingBooks === 0;
}

/**
 * Handles the "Show More" button click by loading and displaying the next set of book previews.
 *
 * @param {Array<Object>} matches - The filtered list of books to be displayed.
 */
export function handleShowMoreClick(matches) {
  const fragment = document.createDocumentFragment();

  // Get the next batch of books based on the current page
  const nextBooks = matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  );

  // Create and append book preview buttons
  nextBooks.forEach((book) => {
    const button = createBookPreviewButton(book);
    fragment.appendChild(button);
  });

  // Append the new book previews to the list
  document.querySelector("[data-list-items]").appendChild(fragment);

  // Increment page count to track pagination state
  page += 1;
}
