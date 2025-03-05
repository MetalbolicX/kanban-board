import KanbanApi from "../API/kanban-api.ts";
import KanbanDropZone from "./kanban-dropzone.ts";
import { Elym } from "elym";
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
      .attr("data-id", this._id.toString())
      .on("dblclick", this.#handleDelete)
      .on("dragstart", (event) => this.#handleDragStart(event as DragEvent))
      .on("drop", (event) => this.#handleDrop(event as DragEvent))
      .appendChild(new KanbanDropZone(this._api).root as HTMLElement)
      .select(".kanban__task-input")
      .text(this._description)
      .on("blur", this.#handleBlur);
  }

  #handleBlur = () => {
    const newDescription =
      this._kanbanTask.select(".kanban__task-input").text() || "";
    if (newDescription === this._description) return;

    this.#description = newDescription;
    this._api.updateTask(this._id, { description: this._description });
  };

  #handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    this.notifyObservers("taskDeleted", {
      taskId: this._id,
      description: this._description,
    });
    this._api.deleteTask(this._id);
    this._kanbanTask.remove();
  };

  #handleDragStart(event: DragEvent) {
    if (typeof this._id !== "number") return;
    event.dataTransfer?.setData("text/plain", this._id.toString());
    this.notifyObservers("taskDragStarted", this._id);
  }

  #handleDrop(event: DragEvent) {
    event.preventDefault();
  }

  public get root() {
    return this._kanbanTask.root;
  }

  protected get _id() {
    return this.#id;
  }

  protected get _description() {
    return this.#description;
  }

  protected get _api() {
    return this.#api;
  }

  protected get _kanbanTask() {
    return this.#kanbanTask;
  }
}
