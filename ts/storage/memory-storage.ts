import { Storage } from "../interfaces/storage-interfaces.ts";
import type { column, task } from "../types/kanban-types.ts";

/**
 * MemoryStorage class implements the Storage interface
 * and provides in-memory storage for kanban board columns and tasks.
 */
export class MemoryStorage implements Storage {
  #columns: Map<string, task[]> = new Map();

  /**
   * Initializes the storage with the given columns.
   * @param {column[]} columns - The columns to initialize.
   */
  init(columns: column[]): void {
    columns.forEach(({ id }) => {
      this._columns.set(id, []);
    });
  }

  /**
   * Adds a task to the specified column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  addTask(columnId: string, task: task): void {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      this._columns.set(columnId, [...tasks, task]);
    }
  }

  /**
   * Removes a task from the specified column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  removeTask(columnId: string, task: task): void {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      const taskIndex = tasks.indexOf(task);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
      }
    }
  }

  /**
   * Moves a task from one column to another.
   * @param {string} sourceColumnId - The ID of the source column.
   * @param {string} targetColumnId - The ID of the target column.
   * @param {task} task - The task to move.
   */
  moveTask(sourceColumnId: string, targetColumnId: string, task: task): void {
    this.removeTask(sourceColumnId, task);
    this.addTask(targetColumnId, task);
  }

  /**
   * Retrieves all tasks from the specified column.
   * @param {string} columnId - The ID of the column.
   * @returns {task[]} - The tasks in the column.
   */
  getTasks(columnId: string): task[] {
    return this._columns.get(columnId) || [];
  }

  /**
   * Protected getter for the columns map.
   * @returns {Map<string, task[]>} - The columns map.
   */
  protected get _columns() {
    return this.#columns;
  }
}
