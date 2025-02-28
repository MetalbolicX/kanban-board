import KanbanColumn from "./kanban-column.ts";

export default class KanbanBoard {
  static readonly #columns = Object.freeze([
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ]);
  #root: HTMLElement;

  constructor(root: HTMLElement) {
    if (!root) throw new Error("Kanban root element is required.");

    this.#root = root;
  }

  public renderColumns() {
    KanbanBoard.#columns.forEach(({ id, title }) => {
      const kanbanColumn = new KanbanColumn(id, title);
      this.root.appendChild(kanbanColumn.elements.root);
    });
  }

  public get root(): HTMLElement {
    return this.#root;
  }
}
