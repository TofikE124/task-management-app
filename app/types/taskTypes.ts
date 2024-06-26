// Represents the entire application data structure
export interface AppData {
  boards: Board[];
}

// Represents a board with columns
export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

// Represents a summary of a board without columns
export type BoardSummary = Omit<Board, "columns">;

// Represents a column within a board
export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

// Represents a task within a column
export interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string;
}

// Represents a subtask within a task
export interface Subtask {
  id: string;
  title: string;
}
