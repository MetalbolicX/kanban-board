import KanbanStorage from "../storage/kanban-storage.ts";
import type { Task } from "../types/kanban-types.ts";
import type { Storage } from "../interfaces/storage-interfaces.ts";

export default class KanbanApi {
  #storage: KanbanStorage;

  constructor(storage: Storage) {
      this.#storage = new KanbanStorage(storage);
  }

  public getTasks(columnId: number): Task[] {
    return this.storage.loadKanban().find((column) => column.id === columnId)?.tasks ?? [];
  }

  public insertTask(columnId: number, description: string): Task {
    const kanban = this.storage.loadKanban();
    const kanbanColumn = kanban.find((column) => column.id === columnId);

    if (!kanbanColumn) throw new Error("Column not found");

    const newTask = {
      id: Math.floor(Math.random() * 10000),
      description,
    };

    kanbanColumn.tasks = [...kanbanColumn.tasks, newTask];
    this.storage.saveKanban(kanban);
    return newTask;
  }

  public updateTask(
    taskId: number,
    updatedProperties: {
      description?: string;
      columnId?: number;
      position?: number;
    }
  ): void {
    const kanban = this.storage.loadKanban();
    let taskToUpdate, sourceColumn;

    for (const column of kanban) {
      const foundTask = column.tasks.find((task) => task.id === taskId);
      if (foundTask) {
        taskToUpdate = foundTask;
        sourceColumn = column;
        break;
      }
    }

    if (!taskToUpdate) throw new Error("Task not found");

    if (updatedProperties.description)
      taskToUpdate.description = updatedProperties.description;

    if (updatedProperties.columnId) {
      const column = kanban.find(
        (column) => column.id === updatedProperties.columnId
      );
      if (!column) throw new Error("Target column not found");

      // Remove from current column
      sourceColumn!.tasks = sourceColumn!.tasks.filter(
        (task) => task.id !== taskId
      );

      // Insert into target column at specified position
      const insertPosition = updatedProperties.position ?? 0;
      column.tasks.splice(insertPosition, 0, taskToUpdate);
    }

    this.storage.saveKanban(kanban);
  }

  public deleteTask(taskId: number): void {
    const kanban = this.storage.loadKanban();

    for (const column of kanban) {
      const taskIndex = column.tasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        this.storage.saveKanban(kanban);
        return;
      }
    }

    throw new Error("Task not found");
  }

  public get storage() {
    return this.#storage;
  }
}
