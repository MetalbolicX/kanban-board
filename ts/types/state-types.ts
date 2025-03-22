export type Listener = (state: any) => void;

type changeType = "addTask" | "removeTask" | "moveTask" | "init" | "updateTaskDescription";

export interface change {
  type: changeType;
  payload: any;
}
