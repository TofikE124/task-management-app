// services/appDataService.ts

import { BehaviorSubject, map } from "rxjs";
import { DefaultSession, getServerSession } from "next-auth";
import {
  AppData,
  BoardType,
  ColumnType,
  TaskType,
  Subtask,
  BoardSummary,
} from "../types/taskTypes";
import { LocalStorageService } from "./appDataLocalStorageService";
import { ApiService } from "./appDataApiService";
import { SessionContextValue, useSession } from "next-auth/react";

// Interface for data service
interface IDataService {
  getAppData(): Promise<AppData>;
  saveAppData(data: AppData): void;
}

// Initialize the appropriate data service based on the user's session
let dataService: IDataService;

export const initializeDataService = async (
  session: SessionContextValue | null
) => {
  const id = "";
  if (session?.data?.user) {
    dataService = new ApiService(id);
  } else {
    dataService = new LocalStorageService();
  }
};

// BehaviorSubject for app-wide state
const appDataSubject = new BehaviorSubject<AppData>({ boards: [] });
export const appData$ = appDataSubject.asObservable();

// State Management Functions
const updateAppData = (appData: AppData) => {
  dataService.saveAppData(appData);
  appDataSubject.next(appData);
};

// Initialization Functions
export const initializeApp = async (session: SessionContextValue | null) => {
  console.log("init");
  await initializeDataService(session);
  console.log(dataService);
  const data = await dataService.getAppData();
  appDataSubject.next(data);
};

// Observable for boards
export const boards$ = appData$.pipe(map(({ boards }) => boards));

// Observable for board summaries
export const boardSummaries$ = appData$.pipe(
  map(({ boards }) => fromBoardsToSummaries(boards))
);

// Board Management Functions
export const getBoardData = async (
  boardId: string
): Promise<BoardType | null> => {
  const data = await dataService.getAppData();
  return data.boards.find(({ id }) => id === boardId) || null;
};

export const createBoard = async (
  newBoard: BoardType
): Promise<BoardType | null> => {
  const data = await dataService.getAppData();
  data.boards.push(newBoard);
  updateAppData(data);
  return newBoard;
};

export const editBoard = async (editedBoard: BoardType) => {
  const data = await dataService.getAppData();
  data.boards = data.boards.map((board) =>
    board.id == editedBoard.id ? editedBoard : board
  );
  updateAppData(data);
};

export const deleteBoard = async (boardId: string) => {
  const data = await dataService.getAppData();
  data.boards = data.boards.filter((board) => board.id != boardId);
  updateAppData(data);
};

// Column Management Functions
export const addColumn = async (boardId: string, newColumn: ColumnType) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  board?.columns.unshift(newColumn);
  updateAppData(data);
};

export const deleteColumn = async (boardId: string, columnId: string) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  board.columns = board.columns.filter((col) => col.id !== columnId);
  updateAppData(data);
};

export const moveColumn = async (
  boardId: string,
  column1Id: string,
  beforeId: string
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;

  const { columns } = board;
  const column1Index = columns.findIndex((col) => col.id === column1Id);
  const column2Index =
    beforeId == "-1"
      ? columns.length
      : columns.findIndex((col) => col.id === beforeId);

  if (column1Index == -1 || column2Index == -1) return;
  const [movedColumn] = columns.splice(column1Index, 1);
  columns.splice(column2Index, 0, movedColumn);
  updateAppData(data);
};

// Task Management Functions
export const createTask = async (boardId: string, task: TaskType) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  const column = findColumn(board.columns, task.columnId);
  column?.tasks.push(task);
  updateAppData(data);
};

export const editTask = async (
  boardId: string,
  taskId: string,
  oldColumnId: string,
  newTask: TaskType
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  const oldColumn = board.columns.find((col) => col.id == oldColumnId);
  const newColumn = findColumn(board.columns, newTask.columnId);
  if (!newColumn || !oldColumn) return;
  if (oldColumn == newColumn) {
    newColumn.tasks = newColumn?.tasks.map((task) =>
      task.id == taskId ? newTask : task
    );
  } else {
    oldColumn.tasks.splice(
      oldColumn.tasks.findIndex((task) => task.id == taskId),
      1
    );
    newColumn.tasks.push(newTask);
  }
  updateAppData(data);
};

export const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  const column = findColumn(board.columns, columnId);
  if (!column) return;
  column.tasks = column.tasks.filter((task) => task.id !== taskId);
  updateAppData(data);
};

export const moveTask = async (
  boardId: string,
  columnId: string,
  newColumnId: string,
  taskId: string,
  beforeId: string
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  const column = findColumn(board.columns, columnId);
  const newColumn = findColumn(board.columns, newColumnId);
  if (!column || !newColumn) return;
  const taskToMove = findTask(column?.tasks, taskId);
  if (!taskToMove) return;
  column.tasks = column.tasks.filter((task) => task != taskToMove);
  const index = newColumn.tasks.findIndex((task) => task.id == beforeId);
  taskToMove.columnId = newColumn.id;
  if (beforeId == "-1") {
    newColumn.tasks = [...newColumn.tasks, taskToMove];
  } else {
    newColumn.tasks.splice(index, 0, taskToMove);
  }
  updateAppData(data);
};

export const checkSubtask = async (
  boardId: string,
  columnId: string,
  taskID: string,
  subtaskId: string,
  value: boolean
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
  if (!board) return;
  const column = findColumn(board.columns, columnId);
  if (!column) return;
  const task = findTask(column.tasks, taskID);
  if (!task) return;
  task.subtasks = task?.subtasks.map((sub) =>
    sub.id == subtaskId ? { ...sub, checked: value } : sub
  );
  updateAppData(data);
};

// Helper Functions
const fromBoardsToSummaries = (boards: BoardType[]): BoardSummary[] => {
  return boards.map(({ id, title }) => ({ id, title }));
};

const findBoard = (boards: BoardType[], boardId: string) => {
  return boards.find((board) => board.id == boardId);
};

const findColumn = (columns: ColumnType[], columnId: string) => {
  return columns.find((col) => col.id == columnId);
};

const findTask = (tasks: TaskType[], taskId: string) => {
  return tasks.find((task) => task.id == taskId);
};

export const getTask = async (
  boardId: string,
  taskId: string
): Promise<TaskType | null> => {
  const data = await dataService?.getAppData();
  const board = findBoard(data?.boards || [], boardId);
  if (!board) return null;
  for (const column of board.columns) {
    const task = findTask(column.tasks, taskId);
    if (task) return task;
  }
  return null;
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

export const checkIfColumnExists = async (
  boardId: string,
  columnTitle: string
) => {
  const data = await dataService.getAppData();
  const board = findBoard(data.boards, boardId);
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

export const getFirstBoardId = (): string | null => {
  const firstBoard = appDataSubject.value.boards[0];
  return firstBoard ? firstBoard.id : null;
};

export const moveBoard = async (boardId: string, beforeId: string) => {
  const data = await dataService.getAppData();
  const boardIndex1 = data.boards.findIndex((b) => b.id == boardId);
  const boardIndex2 =
    beforeId == "-1"
      ? data.boards.length
      : data.boards.findIndex((b) => b.id == beforeId);

  if (boardIndex1 == -1 || boardIndex2 == -1) return;

  const [movedBoard] = data.boards.splice(boardIndex1, 1);
  const newIndex = boardIndex2 > boardIndex1 ? boardIndex2 - 1 : boardIndex2;
  data.boards.splice(newIndex, 0, movedBoard);

  updateAppData(data);
};
