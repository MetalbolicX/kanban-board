import KanbanColumn from "./kanban-column.ts";

import type { Storage } from "../interfaces/kanban-interfaces.ts";

export default class KanbanBoard {
  static readonly #columns = Object.freeze([
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ]);
  #container: HTMLElement;

  constructor(container: HTMLElement, storage: Storage) {
    if (!container) throw new Error("Kanban container element is required.");

    this.#container = container;
    this.#renderColumns(storage);
  }

  #renderColumns(storage: Storage) {
    KanbanBoard.#columns.forEach(({ id, title }) => {
      const kanbanColumn = new KanbanColumn(id, title, storage);
      this.container.appendChild(kanbanColumn.root);
    });
  }

  public get container(): HTMLElement {
    return this.#container;
  }
}
