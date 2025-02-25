import Kanban from "./view/kanban";

const root = document.querySelector("main");
if (!root) throw new Error("Main element not found");

const kanban = new Kanban(root);
