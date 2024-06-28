// Represents the entire application data structure
export interface AppData {
  boards: BoardType[];
}

// Represents a board with columns
export interface BoardType {
  id: string;
  title: string;
  columns: ColumnType[];
}

// Represents a summary of a board without columns
export type BoardSummary = Omit<BoardType, "columns">;

// Represents a column within a board
export interface ColumnType {
  id: string;
  title: string;
  color: string;
  tasks: TaskType[];
}

// Represents a task within a column
export interface TaskType {
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
