import { Storage } from "../interfaces/storage-interfaces.ts";
import type { column, task } from "../types/kanban-types.ts";

export class MemoryStorage implements Storage {
  #columns: Map<string, task[]> = new Map();

  init(columns: column[]) {
    columns.forEach(({ id }) => {
      this._columns.set(id, []);
    });
  }

  addTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      this._columns.set(columnId, [...tasks, task]);
    }
  }

  removeTask(columnId: string, task: task) {
    const tasks = this._columns.get(columnId);
    if (tasks) {
      const taskIndex = tasks.indexOf(task);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
      }
    }
  }

  moveTask(sourceColumnId: string, targetColumnId: string, task: task) {
    this.removeTask(sourceColumnId, task);
    this.addTask(targetColumnId, task);
  }

  getTasks(columnId: string): task[] {
    return this._columns.get(columnId) || [];
  }

  protected get _columns() {
    return this.#columns;
  }
}
