import { BehaviorSubject, iif, map } from "rxjs";
import {
  AppData,
  BoardType,
  BoardSummary,
  ColumnType,
  TaskType,
} from "../types/taskTypes";
import { loadFromLocalStorage, saveToLocalStorage } from "./storageService";

// BehaviorSubject for app-wide state
const appDataSubject = new BehaviorSubject<AppData>({ boards: [] });

// Observable for app-wide state
export const appData$ = appDataSubject.asObservable();

// Observable for boards
export const boards$ = appData$.pipe(map(({ boards }) => boards));

// Observable for board summaries
export const boardSummaries$ = appData$.pipe(
  map(({ boards }) => fromBoardsToSummaries(boards))
);

// Initialize the application with data
export const initializeApp = () => {
  getAppData().then((data) => {
    appDataSubject.next(data);
  });
};

// Function to get application data based on user ID (placeholder for future database interaction)
const getAppData = async (userId?: string): Promise<AppData> => {
  if (userId) {
    return { boards: [] }; // Placeholder logic for database interaction
  } else {
    return loadFromLocalStorage() || { boards: [] }; // Load from local storage if no user ID
  }
};

// Function to convert boards to summaries
const fromBoardsToSummaries = (boards: BoardType[]): BoardSummary[] => {
  return boards.map(({ id, title }) => ({ id, title }));
};

// Function to get a specific board's data
export const getBoardData = async (
  boardId: string,
  userId?: string
): Promise<BoardType | null> => {
  if (userId) {
    // Placeholder for future database interaction
  } else {
    const data = loadFromLocalStorage();
    if (data) {
      return data.boards.find(({ id }) => id === boardId) || null;
    }
  }
  return null;
};

// Key for current board ID in local storage
const CURRENT_BOARD_ID_KEY = "currentBoardId";

// Function to get the current board ID from local storage
export const getCurrentBoardId = (): string | null => {
  return localStorage.getItem(CURRENT_BOARD_ID_KEY);
};

// Function to save the current board ID to local storage
export const saveCurrentBoardId = (currentBoardId: string) => {
  localStorage.setItem(CURRENT_BOARD_ID_KEY, currentBoardId);
};

// Function to create a new board
export const createBoard = async (
  newBoard: BoardType,
  userId?: string
): Promise<BoardType | null> => {
  let addedBoard: BoardType | null = null;

  if (userId) {
    // Placeholder for future database interaction
  } else {
    const data = loadFromLocalStorage() || { boards: [] };
    data.boards.push(newBoard);
    saveToLocalStorage(data);
    addedBoard = newBoard;
    appDataSubject.next(data); // Update appDataSubject with new data
  }

  return addedBoard;
};

// Function to get the ID of the first board in the list
export const getFirstBoardId = (): string | null => {
  const firstBoard = appDataSubject.value.boards[0];
  return firstBoard ? firstBoard.id : null;
};

// Function to fetch board summaries on demand
export const fetchBoardSummaries = async (): Promise<BoardSummary[]> => {
  const data = await getAppData();
  return fromBoardsToSummaries(data.boards);
};

// Function to fetch boards on demand
export const fetchBoards = async (): Promise<BoardType[]> => {
  const data = await getAppData();
  return data.boards;
};

// Funcion to delete a task

export const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  userId?: string
) => {
  if (userId) {
  } else {
    const { boards } = loadFromLocalStorage();
    const board = findBoard(boards, boardId);
    if (!board) return;
    const column = findColumn(board.columns, columnId);
    if (!column) return;
    column.tasks = column.tasks.filter((task) => task.id !== taskId);

    const appData = { boards };
    updateAppData(appData);
  }
};

export const createTask = (
  boardId: string,
  task: TaskType,
  userId?: string
) => {
  if (userId) {
  } else {
    const { boards } = loadFromLocalStorage();
    const board = findBoard(boards, boardId);
    if (!board) return;

    const column = findColumn(board.columns, task.status);
    column?.tasks.push(task);

    updateAppData({ boards });
  }
};

export const moveTask = (
  boardId: string,
  columnId: string,
  newColumnId: string,
  taskId: string,
  beforeId: string,
  userId?: string
) => {
  if (userId) {
  } else {
    const { boards } = loadFromLocalStorage();
    const board = findBoard(boards, boardId);
    if (!board) return;
    const column = findColumn(board.columns, columnId);
    const newColumn = findColumn(board.columns, newColumnId);
    if (!column || !newColumn) return;

    const taskToMove = findTask(column?.tasks, taskId);
    if (!taskToMove) return;

    column.tasks = column.tasks.filter((task) => task != taskToMove);
    const index = newColumn.tasks.findIndex((task) => task.id == beforeId);
    if (beforeId == "-1") {
      newColumn.tasks = [...newColumn.tasks, taskToMove];
    } else {
      newColumn.tasks.splice(index, 0, taskToMove);
    }
    updateAppData({ boards });
  }
};

const updateAppData = (appData: AppData) => {
  saveToLocalStorage(appData);
  appDataSubject.next(appData);
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
