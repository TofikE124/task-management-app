import { BehaviorSubject, map } from "rxjs";
import { AppData, Board, BoardSummary } from "../types/taskTypes";
import { loadFromLocalStorage, saveToLocalStorage } from "./storageService";

// BehaviorSubject for app-wide state
const appDataSubject = new BehaviorSubject<AppData>({ boards: [] });

// Observable for app-wide state
export const appData$ = appDataSubject.asObservable();

// Observable for boards
export const board$ = appData$.pipe(map(({ boards }) => boards));

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
const fromBoardsToSummaries = (boards: Board[]): BoardSummary[] => {
  return boards.map(({ id, title }) => ({ id, title }));
};

// Function to get a specific board's data
export const getBoardData = async (
  boardId: string,
  userId?: string
): Promise<Board | null> => {
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
  newBoard: Board,
  userId?: string
): Promise<Board | null> => {
  let addedBoard: Board | null = null;

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
export const fetchBoards = async (): Promise<Board[]> => {
  const data = await getAppData();
  return data.boards;
};
