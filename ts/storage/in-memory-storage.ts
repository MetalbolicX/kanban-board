import type { Storage, Kanban } from "../types/kanban-types.ts";

export default class InMemoryStorage implements Storage {
  #kanban: Kanban;

  constructor(kanban: Kanban) {
    this.#kanban = kanban;
  }

  public loadKanban(): Kanban {
    return this.#kanban;
  }

  public saveKanban(kanban: Kanban) {
    this.#kanban = kanban;
  }
}
