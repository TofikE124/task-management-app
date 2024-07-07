import { Board } from "@prisma/client";
import { BoardType, ColumnType, Subtask, TaskType } from "../types/taskTypes";

// Helper Functions
export const fromBoardsToSummaries = (boards: BoardType[]) => {
  return boards.map(({ id, title }) => ({ id, title }));
};

export const findBoard = (boards: BoardType[], boardId: string) => {
  return boards.find((board) => board.id == boardId);
};

export const findColumn = (columns: ColumnType[], columnId: string) => {
  return columns.find((col) => col.id == columnId);
};

export const findTask = (tasks: TaskType[], taskId: string) => {
  return tasks.find((task) => task.id == taskId);
};

export const getCheckedTasks = (subtasks: Subtask[]) => {
  return subtasks.reduce((sum, sub) => sum + (sub.checked ? 1 : 0), 0);
};

export const fromColToOption = (col: ColumnType) => ({
  value: col.id,
  label: col.title,
});

export const fromColIdToOption = (columns: ColumnType[], colId: string) => {
  const col = findColumn(columns, colId);
  if (!col) return;
  return fromColToOption(col);
};

export const getStatusArr = (currentBoard: BoardType | null) => {
  return currentBoard?.columns.map(fromColToOption) || [];
};

export const checkIfColumnExists = (board: BoardType, columnTitle: string) => {
  return !board?.columns.every((col) => col.title != columnTitle);
};

// Local Storage Management
const CURRENT_BOARD_ID_KEY = "currentBoardId";

export const getCurrentBoardId = (): string | null => {
  return localStorage.getItem(CURRENT_BOARD_ID_KEY);
};

export const saveCurrentBoardId = (currentBoardId: string) => {
  localStorage.setItem(CURRENT_BOARD_ID_KEY, currentBoardId);
};
