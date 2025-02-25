import Item from "./item.ts";
import KanbanApi from "../API/kanban-api.ts";
import createElement from "../utils/create-elements.ts";
import DropZone from "./drop-zone.ts";

export default class Column {
  static readonly #rootHTML = /*html*/ `
    <div class="kanban__column">
      <div class="kanban__column-title"></div>
      <div class="kanban__column-items"></div>
      <button class="kanban__add-item" type="button">+ Add</button>
    </div>
  `;

  #elements: {
    root: HTMLElement;
    title: HTMLElement;
    items: HTMLElement;
    addItemButton: HTMLButtonElement;
  };

  #id: number;

  constructor(id: number, title: string) {
    this.#id = id;
    this.#elements = this.#initElements(title);

    this.elements.root.dataset.id = id.toString();
    this.#setupColumn();
  }

  #initElements(title: string) {
    const rootElement = createElement(Column.#rootHTML);
    return {
      root: rootElement,
      title: this.#queryElement(rootElement, ".kanban__column-title", title),
      items: this.#queryElement(rootElement, ".kanban__column-items"),
      addItemButton: this.#queryElement(
        rootElement,
        ".kanban__add-item"
      ) as HTMLButtonElement,
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

  #setupColumn() {
    // Add top drop zone inside items container
    this.elements.items.appendChild(DropZone.createDropZone());

    // Attach event listener for adding new items
    this.elements.addItemButton.addEventListener("click", this.#handleAddItem);
  }

  #handleAddItem = async () => {
    const newItem = KanbanApi.insertItem(this.#id, "");

    // Ensure newItem is valid before rendering
    if (!newItem || typeof newItem.id !== "number" || typeof newItem.content !== "string") {
      console.error("Failed to insert new item into Kanban API");
      return;
    }

    this.renderItem(newItem);
  };

  public renderItem(kanbanData: { id: number; content: string }) {
    const item = new Item(kanbanData.id, kanbanData.content);
    this.elements.items.appendChild(item.elements.root);
  }

  public get elements() {
    return this.#elements;
  }
}
