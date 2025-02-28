import KanbanBoard from "./view/kanban-board.ts";

const root = document.querySelector("main");
if (!root) throw new Error("Main element not found");

const kanban = new KanbanBoard(root);
kanban.renderColumns();
