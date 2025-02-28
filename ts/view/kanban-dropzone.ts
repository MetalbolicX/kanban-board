import KanbanApi from "../API/kanban-api.ts";
import createElement from "../utils/create-elements.ts";

export default class KanbanDropZone {
  #dropZone: HTMLElement;

  constructor() {
    this.#dropZone = createElement(
      /*html*/ `<div class="kanban__dropzone"></div>`
    );
    this.#attachEventListeners();
  }

  public static createDropZone(): HTMLElement {
    return new KanbanDropZone().dropZone;
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

  #toggleDropZoneActive(isActive: boolean) {
    this.dropZone.classList.toggle("kanban__drop-zone--active", isActive);
  }

  #handleDrop(event: DragEvent) {
    const kanbanColumn = this.dropZone.closest(".kanban__column");
    if (!kanbanColumn) {
      console.error("Drop zone error: Could not find parent column");
      return;
    }

    const columnId = Number(kanbanColumn.getAttribute("data-id"));
    if (isNaN(columnId)) {
      console.error("Drop zone error: Column ID is not a number");
      return;
    }
    const dropZonesInColumn = [
      ...kanbanColumn.querySelectorAll(".kanban__dropzone"),
    ];
    const droppedIndex = dropZonesInColumn.indexOf(this.dropZone);
    const taskId = Number(event.dataTransfer?.getData("text/plain"));
    const droppedKanbanTask = document.querySelector(`[data-id="${taskId}"]`);

    if (!droppedKanbanTask || droppedKanbanTask === this.dropZone.parentElement)
      return;

    const insertAfter = this.dropZone.parentElement?.classList.contains(
      "kanban__task"
    )
      ? this.dropZone.parentElement
      : this.dropZone;

    insertAfter.after(droppedKanbanTask);
    KanbanApi.updateTask(taskId, { columnId, position: droppedIndex });
  }

  public get dropZone() {
    return this.#dropZone;
  }
}
