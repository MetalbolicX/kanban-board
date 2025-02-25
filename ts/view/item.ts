import KanbanApi from "../API/kanban-api.ts";
import DropZone from "./drop-zone.ts";
import createElement from "../utils/create-elements.ts";

export default class Item {
  static readonly #rootHTML = /*html*/ `
    <div class="kanban__item" draggable="true">
      <div class="kanban__item-input" contenteditable="true"></div>
    </div>
  `;

  #elements: {
    root: HTMLElement;
    input: HTMLElement;
  };
  #content: string;
  #id: number;

  constructor(id: number, content: string) {
    this.#id = id;
    this.#content = content;
    this.#elements = this.#initElements(content);

    this.elements.root.dataset.id = id.toString();
    this.elements.root.appendChild(DropZone.createDropZone());

    this.#attachEventListeners();
  }

  #initElements(content: string) {
    const rootElement = createElement(Item.#rootHTML);
    return {
      root: rootElement,
      input: this.#queryElement(rootElement, ".kanban__item-input", content),
    };
  }

  #queryElement<T extends HTMLElement>(
    parent: HTMLElement,
    selector: string,
    textContent?: string
  ): T {
    const element = parent.querySelector(selector) as T;
    if (!element) throw new Error(`Element not found: ${selector}`);
    if (textContent !== undefined) element.textContent = textContent;
    return element;
  }

  #attachEventListeners() {
    this.elements.input.addEventListener("blur", this.#handleBlur);
    this.elements.root.addEventListener("dblclick", this.#handleDelete);
    this.elements.root.addEventListener("dragstart", this.#handleDragStart);
    this.elements.root.addEventListener("drop", this.#handleDrop);
  }

  #handleBlur = () => {
    const newContent = this.elements.input.textContent?.trim() ?? "";
    if (newContent === this.content) return;

    this.#content = newContent;
    KanbanApi.updateItem(this.#id, { content: this.#content });
  };

  #handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    KanbanApi.deleteItem(this.#id);
    this.elements.input.removeEventListener("blur", this.#handleBlur);
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

  public get content() {
    return this.#content;
  }
}
