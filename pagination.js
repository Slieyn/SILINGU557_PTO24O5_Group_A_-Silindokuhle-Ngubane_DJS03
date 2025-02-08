import { BOOKS_PER_PAGE } from "./data.js";
import { createBookPreviewButton } from "./ui.js";

export let page = 1; // Track pagination state

export function updateShowMoreButton(totalBooks) {
  const button = document.querySelector("[data-list-button]");
  if (!button) return;

  const remainingBooks = Math.max(totalBooks - page * BOOKS_PER_PAGE, 0);
  button.innerHTML = `<span>Show more</span> <span class="list__remaining">(${remainingBooks})</span>`;
  button.disabled = remainingBooks === 0;
}

export function handleShowMoreClick(matches) {
  const fragment = document.createDocumentFragment();
  const nextBooks = matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  );

  nextBooks.forEach((book) => {
    const button = createBookPreviewButton(book);
    fragment.appendChild(button);
  });

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
}
