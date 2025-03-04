import KanbanBoard from "./components/kanban-board.ts";
import LocalStorage from "./storage/local-storage.ts";

// import "./components/kanban-column.ts";

const kanbanContainer = document.querySelector("main");
if (!kanbanContainer) throw new Error("Main element not found");

const kanban = new KanbanBoard(kanbanContainer, new LocalStorage());

const confirm = document.getElementById("confirm");
if (!confirm) throw new Error("Confirm element not found");
confirm?.show();
// confirm.onConfirm = () => {console.log("Confirmed!");};
confirm.addEventListener("confirm", () => console.log("Confirmed using listener!"));
