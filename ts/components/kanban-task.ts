import KanbanApi from "../API/kanban-api.ts";
import KanbanDropZone from "./kanban-dropzone.ts";
import Elym from "../utils/elym.ts";
import KanbanSubject from "../interfaces/kanban-subject.ts";

/**
 * @classdesc
 * It is responsible for creating a task in the Kanban board.
 * In addition it adds the interactivity to the task which includes
 * updating the task description, deleting the task, and dragging the task.
 */
export default class KanbanTask extends KanbanSubject {
  static readonly #TASK_HTML = /*html*/ `
    <div class="kanban__task" draggable="true">
      <div class="kanban__task-input" contenteditable="true"></div>
    </div>
  `;
  #api: KanbanApi;
  #description: string;
  #id: number;
  #kanbanTask: Elym;

  /**
   * Creates a new Kanban task element which will contain information and its interaction.
   * @param {number} id - The ID of the task.
   * @param {string} description - The description of the task.
   * @param {KanbanApi} api - The API to interact with the storage.
   */
  constructor(id: number, description: string, api: KanbanApi) {
    super();
    this.#id = id;
    this.#description = description;
    this.#api = api;
    this.#kanbanTask = this.#initRootElement();
  }

  #initRootElement() {
    return new Elym(KanbanTask.#TASK_HTML)
      .attr("data-id", this.id.toString())
      .on("dblclick", this.#handleDelete)
      .on("dragstart", (event) => this.#handleDragStart(event as DragEvent))
      .on("drop", (event) => this.#handleDrop(event as DragEvent))
      .appendChild(new KanbanDropZone(this.api).root as HTMLElement)
      .select(".kanban__task-input")
      .text(this.description)
      .on("blur", this.#handleBlur);
  }

  #handleBlur = () => {
    const newDescription =
      this.kanbanTask.select(".kanban__task-input").text() || "";
    if (newDescription === this.description) return;

    this.#description = newDescription;
    this.api.updateTask(this.id, { description: this.description });
  };

  #handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    this.notifyObservers("taskDeleted", {
      taskId: this.id,
      description: this.description,
    });
    this.api.deleteTask(this.id);
    this.kanbanTask.remove();
  };

  #handleDragStart(event: DragEvent) {
    if (typeof this.id !== "number") return;
    event.dataTransfer?.setData("text/plain", this.id.toString());
    this.notifyObservers("taskDragStarted", this.id);
  }

  #handleDrop(event: DragEvent) {
    event.preventDefault();
  }

  public get root() {
    return this.kanbanTask.getRootNode();
  }

  protected get id() {
    return this.#id;
  }

  protected get description() {
    return this.#description;
  }

  protected get api() {
    return this.#api;
  }

  protected get kanbanTask() {
    return this.#kanbanTask;
  }
}
