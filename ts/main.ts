import { createColumn } from "./components/column.ts";

const main = () => {
  const kanbanBoard = document.querySelector(".kanban");
  if (!kanbanBoard) return;

  const kanbanColumns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  for (const kanbanColumn of kanbanColumns) {
    const column = createColumn(kanbanColumn);
    kanbanBoard.appendChild(column.root());
  }
};

main();
