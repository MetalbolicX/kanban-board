import type { Storage, Kanban } from "../types/kanban-types.ts";

export default class LocalStorage implements Storage {
  readonly #storageKey = "kanban-data";

  public loadKanban(): Kanban {
    const storedKanban = localStorage.getItem(this.#storageKey);
    return storedKanban
      ? JSON.parse(storedKanban)
      : [
          { id: 1, tasks: [] },
          { id: 2, tasks: [] },
          { id: 3, tasks: [] },
        ];
  }

  public saveKanban(kanban: Kanban) {
    localStorage.setItem(this.#storageKey, JSON.stringify(kanban));
  }
}
