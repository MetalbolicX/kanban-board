import { Storage } from "../interfaces/storage-interfaces.ts";
import ReactiveState from "./reactive-state.ts";

import type { column, task } from "../types/kanban-types.ts";
import type { Listener } from "../types/state-types.ts";

/**
 * Class representing the state of the Kanban board.
 */
export class State {
  #storage: Storage;
  #reactiveState: ReactiveState;

  /**
   * Create a new State instance.
   * @param {Storage} storage - The storage implementation to use.
   */
  constructor(storage: Storage) {
    this.#storage = storage;
    this.#reactiveState = new ReactiveState({ columns: [] });
  }

  /**
   * Initialize the state with columns.
   * @param {column[]} columns - The columns to initialize.
   */
  public init(columns: column[]): void {
    this.#reactiveState.state.columns = columns;
    this._storage.init(columns);
    this._reactiveState.notify({ type: "init", payload: columns });
  }

  /**
   * Add a task to a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  public addTask(columnId: string, task: task): void {
    const columns = this._reactiveState.state.columns,
      column = columns.find((col: column) => col.id === columnId);
    if (column) {
      column.tasks = [...column.tasks, task];
      this._reactiveState.notify({
        type: "addTask",
        payload: { columnId, task },
      });
    }
    this._storage.addTask(columnId, task);
  }

  /**
   * Remove a task from a column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  public removeTask(columnId: string, task: task): void {
    const columns = this._reactiveState.state.columns,
      column = columns.find((col: column) => col.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter((t: task) => t.id !== task.id);
      this._reactiveState.notify({
        type: "removeTask",
        payload: { columnId, task },
      });
    }
    this._storage.removeTask(columnId, task);
  }

  /**
   * Move a task from one column to another.
   * @param {string} sourceColumnId - The ID of the source column.
   * @param {string} targetColumnId - The ID of the target column.
   * @param {task} task - The task to move.
   * @param {number} targetIndex - The index to move the task to.
   */
  public moveTask(sourceColumnId: string, targetColumnId: string, task: task, targetIndex: number): void {
    this.removeTask(sourceColumnId, task);
    const columns = this._reactiveState.state.columns,
    targetColumn = columns.find((col: column) => col.id === targetColumnId);
    if (targetColumn) {
      targetColumn.tasks.splice(targetIndex, 0, task);
      this._reactiveState.notify({
        type: "moveTask",
        payload: { sourceColumnId, targetColumnId, task, targetIndex },
      });
      this._storage.moveTask(sourceColumnId, targetColumnId, task);
    }
  }

  /**
   * Update the description of a task.
   * @param {string} columnId - The ID of the column.
   * @param {string} taskId - The ID of the task.
   * @param {string} description - The new description
   */
  public updateTaskDescription(columnId: string, taskId: string, description: string): void {
    const columns = this._reactiveState.state.columns,
      column = columns.find((col: column) => col.id === columnId),
      task = column?.tasks.find((t: task) => t.id === taskId);
    if (task) {
      task.description = description;
      this._storage.updateTaskDescription(columnId, taskId, description);
      this._reactiveState.notify({
        type: "updateTaskDescription",
        payload: { columnId, taskId, description },
      })
    }
  }

  /**
   * Get all tasks from a column.
   * @param {string} columnId - The ID of the column.
   * @returns {task[]} The tasks in the column.
   */
  public getTasks(columnId: string): task[] {
    return (
      this._reactiveState.state.columns.find(
        (col: column) => col.id === columnId
      )?.tasks || []
    );
  }

  /**
   * Subscribe to state changes.
   * @param {Listener} listener - The listener to call on state changes.
   */
  public subscribe(listener: Listener): void {
    this._reactiveState.subscribe(listener);
  }

  /**
   * Get the storage instance.
   * @protected
   * @returns {Storage} The storage instance.
   */
  protected get _storage(): Storage {
    return this.#storage;
  }

  /**
   * Get the reactive state instance.
   * @protected
   * @returns {ReactiveState} The reactive state instance.
   */
  protected get _reactiveState(): ReactiveState {
    return this.#reactiveState;
  }
}
