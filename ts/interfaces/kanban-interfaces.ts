import { Kanban } from "../types/kanban-types";

export interface Storage {
  loadKanban(): Kanban;
  saveKanban(kanban: Kanban): void;
}
