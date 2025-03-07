import KanbanTask from "./kanban-task.ts";
import KanbanApi from "../API/kanban-api.ts";
import KanbanDropZone from "./kanban-dropzone.ts";
import { Observer } from "../interfaces/kanban-interfaces.ts";
import { Elym } from "elym";

import type { Task } from "../types/kanban-types.ts";

export default class KanbanColumn implements Observer {
  static readonly #COLUMN_HTML = /*html*/ `
    <section class="kanban__column">
      <header class="kanban__column-title"></header>
      <article class="kanban__column-tasks"></article>
      <button class="kanban__add-task" type="button">+ Add</button>
    </section>
  `;
  #kanbanColumn: Elym;
  #id: number;
  #kanbanApi: KanbanApi;
  #kanbanTask: typeof KanbanTask;
  #kanbanDropZone: typeof KanbanDropZone;

  constructor(
    id: number,
    title: string,
    kanbanApi: KanbanApi,
    kanbanTask: typeof KanbanTask,
    kanbanDropZone: typeof KanbanDropZone
  ) {
    this.#id = id;
    this.#kanbanApi = kanbanApi;
    this.#kanbanTask = kanbanTask;
    this.#kanbanDropZone = kanbanDropZone;
    this.#kanbanColumn = this.#initRootElement(title);
    this.#initTasks();
  }

  public renderTask({ id, description }: Task) {
    const kanbanTask = new this._kanbanTask(
      id,
      description,
      this._kanbanApi,
      this._kanbanDropZone
    );
    kanbanTask.addObserver(this);
    this.#kanbanColumn
      .select(".kanban__column-tasks")
      .appendChild(kanbanTask.root() as HTMLElement);
  }

  public update(eventType: string, data: any) {
    console.log(`%c${eventType}`, "color: #f0f; font-weight: bold", data);
  }

  #initRootElement(title: string) {
    return new Elym(KanbanColumn.#COLUMN_HTML)
      .attr("data-id", this.#id.toString())
      .select(".kanban__column-tasks")
      .appendChild(
        new this._kanbanDropZone(this._kanbanApi).root as HTMLElement
      )
      .select(".kanban__column-title")
      .text(title)
      .select(".kanban__add-task")
      .on("click", this.#handleAddTask);
  }

  #initTasks() {
    for (const task of this.#kanbanApi.getTasks(this.#id))
      this.renderTask(task);
  }

  #handleAddTask = () => {
    const newTask = this.#kanbanApi.insertTask(this.#id, "");

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

  protected get _kanbanApi() {
    return this.#kanbanApi;
  }

  protected get _id() {
    return this.#id;
  }

  protected get _kanbanColumn() {
    return this.#kanbanColumn;
  }

  protected get _kanbanTask() {
    return this.#kanbanTask;
  }

  protected get _kanbanDropZone() {
    return this.#kanbanDropZone;
  }
}
