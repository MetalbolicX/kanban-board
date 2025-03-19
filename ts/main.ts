import { createColumn } from "./components/column.ts";
import { Elym } from "elym";
import { columnParams } from "./components/column.ts";

const main = () => {
  // Inital data to create the kanban board columns
  const kanbanColumns: columnParams[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];
  // Append the columns to the kanban board
  const kanbanBoard = Elym.select("#kanban-board");
  kanbanBoard.appendElements(...kanbanColumns.map(createColumn));
};

main();
