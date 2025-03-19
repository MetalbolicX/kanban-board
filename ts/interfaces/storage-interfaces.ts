import { kanban, task } from "../types/kanban-types.ts";

export interface Storage {
  init(columns: kanban): void;
  addTask(columnId: string, task: task): void;
  removeTask(columnId: string, task: task): void;
  moveTask(originColumnId: string, destinationColumnId: string, task: task): void;
  getTasks(columnId: string): task[];

}
