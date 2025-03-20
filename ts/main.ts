import { createColumn } from "./components/column.ts";
import { Elym } from "elym";
import { State } from "./state/state.ts";
import { MemoryStorage } from "./storage/memory-storage.ts";

import type { kanban } from "./types/kanban-types.ts";

const state = new State(new MemoryStorage());

const main = () => {
  // Initial data to create the kanban board columns
  const kanbanColumns: kanban = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  state.init(kanbanColumns);

  // Append the columns to the kanban board
  Elym.select("#kanban-board").appendElements(
    ...kanbanColumns.map(createColumn)
  );
};

main();

export { state };
