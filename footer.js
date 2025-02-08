class BookFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
        <style>
          .footer {
            background-color: #222;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
          }
          .footer a {
            color: #ffcc00;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
        <footer class="footer">
          <p>&copy; 2025 Book Connect. All rights reserved.</p>
          <p>
            <a href="https://www.example.com/terms">Terms of Service</a> |
            <a href="https://www.example.com/privacy">Privacy Policy</a>
          </p>
        </footer>
      `;
  }
}

// Register the custom element
customElements.define("book-footer", BookFooter);

export { BookFooter };
