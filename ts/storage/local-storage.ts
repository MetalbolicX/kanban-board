import { Storage } from "../interfaces/storage-interfaces.ts";
import type { column, task } from "../types/kanban-types.ts";

/**
 * @classdesc The class is responsible for storing and managing the state of the application.
 * It uses the strategy design pattern to delegate the storage operations to a storage implementation.
 */
export class LocalStorage implements Storage {
  #columns: Map<string, task[]> = new Map();

  /**
   * Initializes the local storage with the given columns.
   * @param {column[]} columns - The columns to initialize.
   */
  public init(columns: column[]): void {
    const savedTasksInfo = localStorage.getItem("kanban-data");
    if (savedTasksInfo) {
      this.#columns = new Map(JSON.parse(savedTasksInfo));
    } else {
      for (const column of columns) {
        this._columns.set(column.id, []);
      }
      this.#saveTasksInfo();
    }
  }

  /**
   * Adds a new task in the todo column.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to add.
   */
  public addTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      this._columns.set(columnId, [...tasks, task]);
      this.#saveTasksInfo();
    }
  }

  /**
   * Removes a task from the specified column when the delete button is clicked.
   * @param {string} columnId - The ID of the column.
   * @param {task} task - The task to remove.
   */
  public removeTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        this.#saveTasksInfo();
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
   * Updates a task's description.
   * @param {string} columnId - The ID of the column.
   * @param {string} taskId - The ID of the task.
   * @param {string} description - The new description of the task.
   */
  public updateTaskDescription(columnId: string, taskId: string, description: string) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.description = description;
        this.#saveTasksInfo();
      }
    }
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
  #saveTasksInfo() {
    const tasksInfoToSave = JSON.stringify(
      Array.from(this._columns.entries())
    );
    localStorage.setItem("kanban-data", tasksInfoToSave);
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
