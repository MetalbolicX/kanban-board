import { Storage } from '../interfaces/storage-interfaces.ts';
import type { column, task } from '../types/kanban-types.ts';

/**
 * Class representing the state of the Kanban board.
 */
export class State {
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
  init(columns: column[]) {
    this._storage.init(columns);
  }

  /**
   * Add a task to a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  addTask(columnId: string, task: task) {
    this._storage.addTask(columnId, task);
  }

  /**
   * Remove a task from a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  removeTask(columnId: string, task: task) {
    this._storage.removeTask(columnId, task);
  }

  /**
   * Move a task from one column to another.
   * @param {string} sourceColumnId - The ID of the source column.
   * @param {string} targetColumnId - The ID of the target column.
   * @param {task} task - The task to move.
   */
  moveTask(sourceColumnId: string, targetColumnId: string, task: task) {
    this._storage.moveTask(sourceColumnId, targetColumnId, task);
  }

  /**
   * Get all tasks from a column.
   * @param {string} columnId - The ID of the column.
   * @returns {task[]} The tasks in the column.
   */
  getTasks(columnId: string): task[] {
    return this._storage.getTasks(columnId);
  }

  /**
   * Get the storage instance.
   * @protected
   * @returns {Storage} The storage instance.
   */
  protected get _storage(): Storage {
    return this.#storage;
  }
}
