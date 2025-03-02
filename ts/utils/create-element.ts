/**
 * Create an HTML or SVG element from an HTML string.
 * @param {string} htmlTemplate - The HTML string to be converted to an element.
 * @returns {HTMLElement | SVGElement} - The HTML or SVG element created from the HTML string.
 * @throws {Error} - If the HTML string is invalid or does not contain a valid element.
 * @example
 * ```ts
 * const element = createElement(`<div class="example">Hello, world!</div>`); // Creates a div element with the class "example" and the text "Hello, world!"
 * document.body.appendChild(element); // Appends the element to the document body
 * ```
 */
const createElement = (htmlTemplate: string): HTMLElement | SVGElement => {
  // Check if the HTML string appears to be an SVG element.
  // A simple check for the presence of "<svg" at the beginning is sufficient for most cases.
  if (htmlTemplate.trim().startsWith("<svg")) {
    const parser = new DOMParser(),
      svgDoc = parser.parseFromString(htmlTemplate, "image/svg+xml"),
      svgElement = svgDoc.documentElement;

    if (!svgElement || svgElement.tagName !== "svg") {
      throw new Error("Invalid SVG: No valid SVG element found");
    }

    return svgElement;
  } else {
    const range = document.createRange(),
      fragment = range.createContextualFragment(htmlTemplate),
      element = fragment.firstElementChild as HTMLElement;

    if (!element) {
      throw new Error("Invalid HTML: No valid element found");
    }

    return element;
  }
};

export default createElement;
