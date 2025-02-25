import KanbanApi from "../API/kanban-api";
import createElement from "../utils/create-elements";

export default class DropZone {
  #dropZone: HTMLElement;

  constructor() {
    this.#dropZone = createElement(
      /*html*/ `<div class="kanban__dropzone"></div>`
    );
    this.#attachEventListeners();
  }

  public static createDropZone(): HTMLElement {
    return new DropZone().dropZone;
  }

  #attachEventListeners() {
    this.dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      this.#toggleDropZoneActive(true);
    });

    this.dropZone.addEventListener("dragleave", () => {
      this.#toggleDropZoneActive(false);
    });

    this.dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      this.#toggleDropZoneActive(false);
      this.#handleDrop(event);
    });
  }

  #toggleDropZoneActive(active: boolean) {
    this.dropZone.classList.toggle("kanban__drop-zone--active", active);
  }

  #handleDrop(event: DragEvent) {
    const columnElement = this.dropZone.closest(".kanban__column");
    if (!columnElement) {
      console.error("Drop zone error: Could not find parent column");
      return;
    }

    const columnId = Number(columnElement.getAttribute("data-id"));
    if (isNaN(columnId)) {
      console.error("Drop zone error: Column ID is not a number");
      return;
    }
    const dropZonesInColumn = [
      ...columnElement.querySelectorAll(".kanban__dropzone"),
    ];
    const droppedIndex = dropZonesInColumn.indexOf(this.dropZone);
    const itemId = Number(event.dataTransfer?.getData("text/plain"));
    const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);

    if (
      !droppedItemElement ||
      droppedItemElement === this.dropZone.parentElement
    )
      return;

    const insertAfter = this.dropZone.parentElement?.classList.contains(
      "kanban__column-item"
    )
      ? this.dropZone.parentElement
      : this.dropZone;

    insertAfter.after(droppedItemElement);
    KanbanApi.updateItem(itemId, { columnId, position: droppedIndex });
  }

  public get dropZone() {
    return this.#dropZone;
  }
}
