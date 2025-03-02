import KanbanBoard from "./components/kanban-board.ts";
import LocalStorage from "./storage/local-storage.ts";

const kanbanContainer = document.querySelector("main");
if (!kanbanContainer) throw new Error("Main element not found");

const kanban = new KanbanBoard(kanbanContainer, new LocalStorage());
