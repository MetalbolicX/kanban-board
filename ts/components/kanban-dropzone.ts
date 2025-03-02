import KanbanApi from "../API/kanban-api.ts";
import ElementBuilder from "../utils/element-builder.ts";

export default class KanbanDropZone {
  #api: KanbanApi;
  #dropZone: ElementBuilder;

  constructor(api: KanbanApi) {
    this.#api = api;
    this.#dropZone = this.#initRootElement();
  }

  #initRootElement() {
    return new ElementBuilder(/*html*/ `<div class='kanban__dropzone'></div>`)
      .on("dragover", (event) => {
        event.preventDefault();
        this.#toggleDropZoneActive(true);
      })
      .on("dragleave", () => this.#toggleDropZoneActive(false))
      .on("drop", (event) => {
        event.preventDefault();
        this.#toggleDropZoneActive(false);
        this.#handleDrop(event as DragEvent);
      });
  }

  #toggleDropZoneActive(isActive: boolean) {
    this.dropZone.classed("kanban__dropzone--active", isActive);
  }

  #handleDrop(event: DragEvent) {
    const kanbanColumn = this.root.closest(".kanban__column");
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
    const droppedIndex = dropZonesInColumn.indexOf(this.root);
    const taskId = Number(event.dataTransfer?.getData("text/plain"));
    const droppedKanbanTask = document.querySelector(`[data-id="${taskId}"]`);

    if (!droppedKanbanTask || droppedKanbanTask === this.root.parentElement)
      return;

    const insertAfter = this.root.parentElement?.classList.contains(
      "kanban__task"
    )
      ? this.root.parentElement
      : this.root;

    insertAfter.after(droppedKanbanTask);
    this.api.updateTask(taskId, { columnId, position: droppedIndex });
  }

  public get root() {
    return this.#dropZone.getRootNode();
  }

  protected get dropZone() {
    return this.#dropZone;
  }

  protected get api() {
    return this.#api;
  }
}
