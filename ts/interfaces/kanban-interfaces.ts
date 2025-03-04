import { Kanban } from "../types/kanban-types.ts";

export interface Storage {
  loadKanban(): Kanban;
  saveKanban(kanban: Kanban): void;
}

export interface Observer {
  update(eventType: string, data: any): void;
}
