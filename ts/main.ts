import { createColumn } from "./components/column.ts";
import { Elym } from "elym";
import { StateStore } from "./state/state-store.ts";
import { LocalStorage } from "./storage/local-storage.ts";

import type { column } from "./types/kanban-types.ts";

const stateStore = new StateStore(new LocalStorage());

const main = () => {
  // Initial data to create the kanban board columns
  const kanbanColumns: column[] = [
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ];

  // Initialize the state store with the columns
  stateStore.init(kanbanColumns);

  // Append the columns to the kanban board
  Elym.select("#kanban-board").appendElements(
    ...kanbanColumns.map(createColumn)
  );
};

main();

export { stateStore };
