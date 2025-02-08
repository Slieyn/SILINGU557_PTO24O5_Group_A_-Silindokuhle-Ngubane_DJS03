import { authors } from "./data.js";
const BOOKS_PER_PAGE = 6;

export function toggleOverlay(selector, isOpen) {
  const overlay = document.querySelector(selector);
  if (overlay) overlay.open = isOpen;
}

export function populateDropdown(data, selector, defaultText) {
  const dropdown = document.querySelector(selector);
  dropdown.innerHTML =
    `<option value="any">${defaultText}</option>` +
    Object.entries(data)
      .map(([id, name]) => `<option value="${id}">${name}</option>`)
      .join("");
}

export function createBookPreviewButton({ author, id, image, title }) {
  const button = document.createElement("button");
  button.classList.add("preview");
  button.setAttribute("data-preview", id);
  button.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>`;
  return button;
}

export function renderBookPreviews(bookList) {
  const fragment = document.createDocumentFragment();
  bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    fragment.appendChild(createBookPreviewButton(book));
  });
  document.querySelector("[data-list-items]").appendChild(fragment);
}
