import { createColumn } from "./components/column.ts";
import { Elym } from "elym";
import { State } from "./state/state.ts";
// import { MemoryStorage } from "./storage/memory-storage.ts";
import { LocalStorage } from "./storage/local-storage.ts";
import { createTask } from "./components/task.ts";

import type { column } from "./types/kanban-types.ts";

const state = new State(new LocalStorage());

const main = () => {
  // Initial data to create the kanban board columns
  const kanbanColumns: column[] = [
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ];

  state.init(kanbanColumns);
  state.subscribe((change) => {
    switch (change.type) {
      case "init":
        Elym.select("#kanban-board").appendElements(
          ...change.payload.map(createColumn)
        );
        break;
      case "addTask":
        const { columnId, task } = change.payload;
        Elym.select(`#${columnId} .kanban__tasks`).appendElements(
          createTask(task)
        );
        break;
      case "removeTask":
        const { columnId: removeColumnId, task: removeTask } = change.payload;
        Elym.select(
          `#${removeColumnId} .kanban__task[data-id="${removeTask.id}"]`
        ).remove();
        break;
      case "moveTask":
        const { targetColumnId, task: movedTask, targetIndex } = change.payload,
          targetColumn = Elym.select(`#${targetColumnId} .kanban__tasks`),
          taskElement = createTask(movedTask),
          afterElement = targetColumn.node().children[targetIndex];
        if (afterElement) {
          targetColumn.insertBefore(taskElement.root() as HTMLElement);
        } else {
          targetColumn.appendElements(taskElement);
        }
        break;
      case "updateTaskDescription":
        const { columnId: sourceColumnId, taskId, description } = change.payload;
        Elym.select(`#${sourceColumnId} .kanban__task[data-id="${taskId}"] .kanban__task-description`).text(description);
        break;
      default:
        console.error("Invalid change");
        break;
    }
  });

  // Append the columns to the kanban board
  Elym.select("#kanban-board").appendElements(
    ...kanbanColumns.map(createColumn)
  );
};

main();

export { state };
