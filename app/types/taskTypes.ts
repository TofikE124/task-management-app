export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export type BoardSummary = Omit<Board, "columns">;

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string;
}

export interface Subtask {
  id: string;
  title: string;
}
