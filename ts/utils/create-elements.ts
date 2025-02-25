const createElement = (html: string): HTMLElement => {
  const range = document.createRange();
  const fragment = range.createContextualFragment(html);
  const element = fragment.firstElementChild as HTMLElement;

  if (!element) {
    throw new Error("Invalid HTML: No valid element found");
  }

  return element;
};


export default createElement;
