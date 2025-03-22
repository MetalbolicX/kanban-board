import { Storage } from "../interfaces/storage-interfaces.ts";
import type { column, task } from "../types/kanban-types.ts";

export class LocalStorage implements Storage {
  #columns: Map<string, task[]> = new Map();

  /**
   * Initializes the local storage with the given columns.
   * @param {column[]} columns - The columns to initialize.
   */
  public init(columns: column[]): void {
    const savedKanbanInfo = localStorage.getItem("kanban-data");
    if (savedKanbanInfo) {
      this.#columns = new Map(JSON.parse(savedKanbanInfo));
      return;
    }
    for (const column of columns) this._columns.set(column.id, []);
  }

  /**
   * Adds a task to the specified column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  public addTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      this._columns.set(columnId, [...tasks, task]);
      this.#saveState();
    }
  }

  /**
   * Removes a task from the specified column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  public removeTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      const taskIndex = tasks.indexOf(task);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        this.#saveState();
      }
    }
  }

  /**
   * Moves a task from one column to another.
   * @param {string} sourceColumnId - The ID of the source column.
   * @param {string} targetColumnId - The ID of the target column.
   * @param {task} task - The task to move.
   */
  public moveTask(sourceColumnId: string, targetColumnId: string, task: task) {
    this.removeTask(sourceColumnId, task);
    this.addTask(targetColumnId, task);
  }

  /**
   * Gets the tasks for the specified column.
   * @param {string} columnId - The ID of the column.
   * @returns {task[]} The tasks in the column.
   */
  public getTasks(columnId: string): task[] {
    return this._columns.get(columnId) ?? [];
  }

  /**
   * Saves the current state to local storage.
   * @private
   */
  #saveState() {
    const kanbanInfoToSave = JSON.stringify(
      Array.from(this._columns.entries())
    );
    localStorage.setItem("kanban-data", kanbanInfoToSave);
  }

  /**
   * Gets the columns.
   * @protected
   * @returns {Map<string, task[]>} The columns.
   */
  protected get _columns(): Map<string, task[]> {
    return this.#columns;
  }
}
