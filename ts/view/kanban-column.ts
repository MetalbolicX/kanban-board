import KanbanTask from "./kanban-task.ts";
import KanbanApi from "../API/kanban-api.ts";
import createElement from "../utils/create-elements.ts";
import KanbanDropZone from "./kanban-dropzone.ts";

import type { Task } from "../API/kanban-api.ts";

export default class KanbanColumn {
  static readonly #rootHTML = /*html*/ `
    <div class="kanban__column">
      <h3 class="kanban__column-title"></h3>
      <div class="kanban__column-tasks"></div>
      <button class="kanban__add-task" type="button">+ Add</button>
    </div>
  `;
  #elements: {
    root: HTMLElement;
    title: HTMLElement;
    tasksContainer: HTMLElement;
    addTask: HTMLButtonElement;
  };
  #id: number;

  constructor(id: number, title: string) {
    this.#id = id;
    this.#elements = this.#initElements();
    this.#setMetaData(title);
    this.#setupColumn();
  }

  #initElements() {
    const rootElement = createElement(KanbanColumn.#rootHTML);
    return {
      root: rootElement,
      title: this.#queryElement(rootElement, ".kanban__column-title"),
      tasksContainer: this.#queryElement(rootElement, ".kanban__column-tasks"),
      addTask: this.#queryElement(
        rootElement,
        ".kanban__add-task"
      ) as HTMLButtonElement,
    };
  }

  #queryElement<T extends HTMLElement>(
    parent: HTMLElement,
    selector: string
  ): T {
    const element = parent.querySelector(selector) as T;
    if (!element) throw new Error(`Element not found: ${selector}`);
    return element;
  }

  #setMetaData(title: string) {
    this.elements.title.textContent = title;
    this.elements.root.dataset.id = this.#id.toString();
  }

  #setupColumn() {
    this.elements.tasksContainer.appendChild(KanbanDropZone.createDropZone());

    this.elements.addTask.addEventListener("click", this.#handleAddTask);
  }

  #handleAddTask = async () => {
    const newTask = KanbanApi.insertTask(this.#id, "");

    // Ensure newItem is valid before rendering
    if (
      !newTask ||
      typeof newTask.id !== "number" ||
      typeof newTask.description !== "string"
    ) {
      console.error("Failed to insert new item into Kanban API");
      return;
    }

    this.renderTask(newTask);
  };

  public renderTask({ id, description }: Task) {
    const kanbanTask = new KanbanTask(id, description);
    this.elements.tasksContainer.appendChild(kanbanTask.elements.root);
  }

  public get elements() {
    return this.#elements;
  }
}
