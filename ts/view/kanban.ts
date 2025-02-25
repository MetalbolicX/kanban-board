import Column from "./column.ts";

export default class Kanban {
  static readonly #columns = Object.freeze([
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ]);

  #root: HTMLElement;

  constructor(root: HTMLElement) {
    if (!root) throw new Error("Kanban root element is required.");

    this.#root = root;
    this.#renderColumns();
  }

  #renderColumns() {
    Kanban.#columns.forEach(({ id, title }) => {
      const column = new Column(id, title);
      this.root.appendChild(column.elements.root);
    });
  }

  public get root(): HTMLElement {
    return this.#root;
  }
}
