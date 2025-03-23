import { Storage } from "../interfaces/storage-interfaces.ts";

import type { column, task } from "../types/kanban-types.ts";

/**
 * @classdesc The class is responsible for storing and managing the state of the application.
 * It uses the strategy design pattern to delegate the storage operations to a storage implementation.
 */
export class StateStore {
  #storage: Storage;

  /**
   * Create a new State instance.
   * @param {Storage} storage - The storage implementation to use.
   */
  constructor(storage: Storage) {
    this.#storage = storage;
  }

  /**
   * Initialize the state with columns.
   * @param {column[]} columns - The columns to initialize.
   */
  public init(columns: column[]): void {
    this._storage.init(columns);
  }

  /**
   * Add a task to a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  public addTask(columnId: string, task: task): void {
    this._storage.addTask(columnId, task);
  }

  /**
   * Remove a task from a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  public removeTask(columnId: string, task: task): void {
    this._storage.removeTask(columnId, task);
  }

  /**
   * Move a task from one column to another.
   * @param {string} sourceColumnId - The ID of the source column.
   * @param {string} targetColumnId - The ID of the target column.
   * @param {task} task - The task to move.
   * @param {number} targetIndex - The index to move the task to.
   */
  public moveTask(
    sourceColumnId: string,
    targetColumnId: string,
    task: task,
    targetIndex: number
  ): void {
    this.removeTask(sourceColumnId, task);
    this._storage.moveTask(sourceColumnId, targetColumnId, task, targetIndex);
  }

  /**
   * Update the description of a task.
   * @param {string} columnId - The ID of the column.
   * @param {string} taskId - The ID of the task.
   * @param {string} description - The new description
   */
  public updateTaskDescription(
    columnId: string,
    taskId: string,
    description: string
  ): void {
    this._storage.updateTaskDescription(columnId, taskId, description);
  }

  /**
   * Get all tasks from a column.
   * @param {string} columnId - The ID of the column.
   * @returns {task[]} The tasks in the column.
   */
  public getTasks(columnId: string): task[] {
    return this._storage.getTasks(columnId);
  }

  /**
   * Get the storage instance.
   * @protected
   * @returns {Storage} The storage instance.
   */
  protected get _storage() {
    return this.#storage;
  }
}
