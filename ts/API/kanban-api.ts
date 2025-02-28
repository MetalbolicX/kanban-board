export type Task = {
  id: number;
  description: string;
};

export type Column = {
  id: number;
  tasks: Task[];
};

export default class KanbanApi {
  public static getTasks(columnId: number) {
    return loadKanban().find((column) => column.id === columnId)?.tasks ?? [];
  }

  public static insertTask(columnId: number, description: string) {
    const kanbanColumns = loadKanban();
    const kanbanColumn = kanbanColumns.find((column) => column.id === columnId);

    if (!kanbanColumn) throw new Error("Column not found");

    const newTask = {
      id: Math.floor(Math.random() * 10000),
      description,
    };

    kanbanColumn.tasks = [...kanbanColumn.tasks, newTask];
    saveKanban(kanbanColumns);
    return newTask;
  }

  public static updateTask(
    taskId: number,
    updatedProperties: {
      description?: string;
      columnId?: number;
      position?: number;
    }
  ) {
    const kanbanColumns = loadKanban();
    let taskToUpdate, sourceColumn;

    for (const kanbanColumn of kanbanColumns) {
      const foundTask = kanbanColumn.tasks.find((task) => task.id === taskId);
      if (foundTask) {
        taskToUpdate = foundTask;
        sourceColumn = kanbanColumn;
        break;
      }
    }

    if (!taskToUpdate) throw new Error("Task not found");

    if (updatedProperties.description)
      taskToUpdate.description = updatedProperties.description;

    if (updatedProperties.columnId) {
      const kanbanColumn = kanbanColumns.find(
        (column) => column.id === updatedProperties.columnId
      );
      if (!kanbanColumn) throw new Error("Target column not found");

      // Remove from current column
      sourceColumn!.tasks = sourceColumn!.tasks.filter(
        (task) => task.id !== taskId
      );

      // Insert into target column at specified position
      const insertPosition = updatedProperties.position ?? 0;
      kanbanColumn.tasks.splice(insertPosition, 0, taskToUpdate);
    }

    saveKanban(kanbanColumns);
  }

  public static deleteTask(taskId: number) {
    const kanbanColumns = loadKanban();

    for (const kanbanColumn of kanbanColumns) {
      const taskIndex = kanbanColumn.tasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        kanbanColumn.tasks.splice(taskIndex, 1);
        saveKanban(kanbanColumns);
        return;
      }
    }

    throw new Error("Task not found");
  }
}

const loadKanban = (): Column[] => {
  const storedKanban = localStorage.getItem("kanban-data");
  return storedKanban
    ? JSON.parse(storedKanban)
    : [
        { id: 1, tasks: [] },
        { id: 2, tasks: [] },
        { id: 3, tasks: [] },
      ];
};

const saveKanban = (kanban: Column[]) =>
  localStorage.setItem("kanban-data", JSON.stringify(kanban));
