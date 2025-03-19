import { Storage } from "../interfaces/storage-interfaces.ts";
import type { column, task } from "../types/kanban-types.ts";

export class LocalStorage implements Storage {
  #columns: Map<string, task[]> = new Map();

  init(columns: column[]) {
    const savedState = localStorage.getItem('kanbanState');
    if (savedState) {
      this.#columns = new Map(JSON.parse(savedState));
    } else {
      columns.forEach(({ id }) => {
        this.#columns.set(id, []);
      });
    }
  }

  addTask(columnId: string, task: task) {
    const tasks = this.#columns.get(columnId);
    if (tasks) {
      this.#columns.set(columnId, [...tasks, task]);
      this.saveState();
    }
  }

  removeTask(columnId: string, task: task) {
    const tasks = this.#columns.get(columnId);
    if (tasks) {
      const taskIndex = tasks.indexOf(task);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        this.saveState();
      }
    }
  }

  moveTask(sourceColumnId: string, targetColumnId: string, task: task) {
    this.removeTask(sourceColumnId, task);
    this.addTask(targetColumnId, task);
  }

  getTasks(columnId: string): task[] {
    return this.#columns.get(columnId) || [];
  }

  private saveState() {
    const stateToSave = JSON.stringify(Array.from(this.#columns.entries()));
    localStorage.setItem('kanbanState', stateToSave);
  }
}
