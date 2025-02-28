import KanbanApi from "../API/kanban-api.ts";
import KanbanDropZone from "./kanban-dropzone.ts";
import createElement from "../utils/create-elements.ts";

export default class KanbanTask {
  static readonly #rootHTML = /*html*/ `
    <div class="kanban__task" draggable="true">
      <div class="kanban__task-input" contenteditable="true"></div>
    </div>
  `;

  #elements: {
    root: HTMLElement;
    taskInput: HTMLElement;
  };
  #description: string;
  #id: number;

  constructor(id: number, description: string) {
    this.#id = id;
    this.#description = description;
    this.#elements = this.#initElements();

    this.#setMetaData();
    this.elements.root.appendChild(KanbanDropZone.createDropZone());

    this.#attachEventListeners();
  }

  #initElements() {
    const rootElement = createElement(KanbanTask.#rootHTML);
    return {
      root: rootElement,
      taskInput: this.#queryElement(rootElement, ".kanban__task-input"),
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

  #setMetaData() {
    this.elements.taskInput.textContent = this.description;
    this.elements.root.dataset.id = this.#id.toString();
  }

  #attachEventListeners() {
    this.elements.taskInput.addEventListener("blur", this.#handleBlur);
    this.elements.root.addEventListener("dblclick", this.#handleDelete);
    this.elements.root.addEventListener("dragstart", this.#handleDragStart);
    this.elements.root.addEventListener("drop", this.#handleDrop);
  }

  #handleBlur = () => {
    const newDescription = this.elements.taskInput.textContent?.trim() ?? "";
    if (newDescription === this.description) return;

    this.#description = newDescription;
    KanbanApi.updateTask(this.#id, { description: this.description });
  };

  #handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    KanbanApi.deleteTask(this.#id);
    this.elements.taskInput.removeEventListener("blur", this.#handleBlur);
    this.elements.root.remove();
  };

  #handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("text/plain", this.#id.toString());
  };

  #handleDrop = (event: DragEvent) => {
    event.preventDefault();
  };

  public get elements() {
    return this.#elements;
  }

  public get description() {
    return this.#description;
  }
}
