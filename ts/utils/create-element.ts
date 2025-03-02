const createElement = (html: string): HTMLElement => {
  const range = document.createRange(),
    fragment = range.createContextualFragment(html),
    element = fragment.firstElementChild as HTMLElement;

  if (!element) {
    throw new Error("Invalid HTML: No valid element found");
  }

  return element;
};

export default createElement;
