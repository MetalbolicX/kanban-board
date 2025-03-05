import KanbanTask from "./kanban-task.ts";
import KanbanApi from "../API/kanban-api.ts";
import { Elym } from "elym";
import KanbanDropZone from "./kanban-dropzone.ts";
import { Observer } from "../interfaces/kanban-interfaces.ts";

import type { Task } from "../types/kanban-types.ts";
import type { Storage } from "../interfaces/kanban-interfaces.ts";

export default class KanbanColumn implements Observer {
  static readonly #COLUMN_HTML = /*html*/ `
    <div class="kanban__column">
      <h3 class="kanban__column-title"></h3>
      <div class="kanban__column-tasks"></div>
      <button class="kanban__add-task" type="button">+ Add</button>
    </div>
  `;
  #kanbanColumn: Elym;
  #id: number;
  #api: KanbanApi;

  constructor(id: number, title: string, storage: Storage) {
    this.#id = id;
    this.#api = new KanbanApi(storage);
    this.#kanbanColumn = this.#initRootElement(title);
    this.#initTasks();
  }

  public renderTask({ id, description }: Task) {
    const kanbanTask = new KanbanTask(id, description, this._api);
    kanbanTask.addObserver(this);
    this._kanbanColumn
      .select(".kanban__column-tasks")
      .appendChild(kanbanTask.root() as HTMLElement);
  }

  public update(eventType: string, data: any) {
    console.log(`%c${eventType}`, "color: #f0f; font-weight: bold", data);
  }

  #initRootElement(title: string) {
    return new Elym(KanbanColumn.#COLUMN_HTML)
      .attr("data-id", this._id.toString())
      .select(".kanban__column-tasks")
      .appendChild(new KanbanDropZone(this._api).root as HTMLElement)
      .select(".kanban__column-title")
      .text(title)
      .select(".kanban__add-task")
      .on("click", this.#handleAddTask);
  }

  #initTasks() {
    for (const task of this._api.getTasks(this._id)) this.renderTask(task);
  }

  #handleAddTask = () => {
    const newTask = this._api.insertTask(this._id, "");

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

  public get root() {
    return this.#kanbanColumn.root();
  }

  protected get _api() {
    return this.#api;
  }

  protected get _id() {
    return this.#id;
  }

  protected get _kanbanColumn() {
    return this.#kanbanColumn;
  }
}
