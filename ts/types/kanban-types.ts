export type task = {
  id: string;
  description?: string;
};

export type column = {
  id: string;
  title: string;
};

export type kanban = column[];

