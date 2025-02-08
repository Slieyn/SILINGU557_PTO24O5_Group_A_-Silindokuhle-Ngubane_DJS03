/**
 * @class BookFooter
 * @extends HTMLElement
 * @classdesc A custom footer component for the Book Connect application.
 */
class BookFooter extends HTMLElement {
  /**
   * Constructor to initialize the custom footer element.
   * - Attaches a shadow DOM to encapsulate styles.
   * - Injects the footer's HTML and CSS.
   */
  constructor() {
    // Constructor function
    super(); // Call the parent class constructor

    // Attach a shadow DOM to encapsulate styles and structure
    this.attachShadow({ mode: "open" });

    // Set the shadow DOM content (HTML & CSS)
    this.shadowRoot.innerHTML = `
      <style>
        /* Footer container styles */
        .footer {
          background-color: #222;  /* Dark background for contrast */
          color: white;            /* White text for readability */
          text-align: center;      /* Center align text */
          padding: 8px;          /* Space around content */
          font-size:12px;        /* Standard font size */
          position: fixed;         /* Fix footer at the bottom */
          bottom: 0;
          left: 0;
          width: 100%;
          margiin-botton: 0;
          
        }

        /* Footer links */
        .footer a {
          color: #ffcc00;          /* Highlighted link color */
          text-decoration: none;   /* Remove underline */
        }

        /* Hover effect for links */
        .footer a:hover {
          text-decoration: underline;
        }
      </style>

      <!-- Footer Content -->
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

// Register the custom element so it can be used as <book-footer>
customElements.define("book-footer", BookFooter);

// Export the BookFooter component for use in other modules
export { BookFooter };
