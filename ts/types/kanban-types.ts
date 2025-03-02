export type Task = {
  id: number;
  description: string;
};

export type Column = {
  id: number;
  tasks: Task[];
};

export type Kanban = Column[];

