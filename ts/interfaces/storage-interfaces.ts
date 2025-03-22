import { task, column } from "../types/kanban-types.ts";

export interface Storage {
  init(columns: column[]): void;
  addTask(columnId: string, task: task): void;
  removeTask(columnId: string, task: task): void;
  moveTask(
    originColumnId: string,
    destinationColumnId: string,
    task: task
  ): void;
  getTasks(columnId: string): task[];
  updateTaskDescription(
    columnId: string,
    taskId: string,
    description: string
  ): void;
}
