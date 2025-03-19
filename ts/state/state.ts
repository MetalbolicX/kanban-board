import { Storage } from '../interfaces/storage-interfaces.ts';
import type { column, task } from '../types/kanban-types.ts';

export class State {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  init(columns: column[]) {
    this._storage.init(columns);
  }

  addTask(columnId: string, task: task) {
    this._storage.addTask(columnId, task);
  }

  removeTask(columnId: string, task: task) {
    this._storage.removeTask(columnId, task);
  }

  moveTask(sourceColumnId: string, targetColumnId: string, task: task) {
    this._storage.moveTask(sourceColumnId, targetColumnId, task);
  }

  getTasks(columnId: string): task[] {
    return this._storage.getTasks(columnId);
  }

  protected get _storage(): Storage {
    return this.#storage;
  }
}
