// import { SessionContextValue } from "next-auth/react";
// import { map } from "rxjs";
// import {
//   AppData,
//   BoardSummary,
//   BoardType,
//   ColumnType,
//   Subtask,
//   TaskType,
// } from "../types/taskTypes";
// import { AppDataApiService } from "./appDataApiService";
// import { LocalStorageService } from "./appDataLocalStorageService";
// import observableService from "./observableService";

// // Interface for data service
// export interface IDataService {
//   getAppData(): Promise<AppData>;

//   // Board CRUD operations
//   createBoard(board: BoardType): Promise<BoardType | null>;
//   editBoard(board: BoardType): Promise<BoardType | null>;
//   deleteBoard(boardId: string): Promise<BoardType | null>;
//   moveBoard(boardId: string, beforeId: string): Promise<void>;

//   // Column CRUD operations
//   addColumn(boardId: string, column: ColumnType): Promise<ColumnType | null>;
//   editColumn(boardId: string, column: ColumnType): Promise<ColumnType | null>;
//   deleteColumn(boardId: string, columnId: string): Promise<ColumnType | null>;
//   moveColumn(
//     boardId: string,
//     column1Id: string,
//     beforeId: string
//   ): Promise<void>;

//   // Task CRUD operations
//   createTask(boardId: string, task: TaskType): Promise<TaskType | null>;
//   editTask(
//     boardId: string,
//     taskId: string,
//     oldColumnId: string,
//     newTask: TaskType
//   ): Promise<TaskType | null>;
//   deleteTask(
//     boardId: string,
//     columnId: string,
//     taskId: string
//   ): Promise<TaskType | null>;
//   moveTask(
//     boardId: string,
//     columnId: string,
//     newColumnId: string,
//     taskId: string,
//     beforeId: string
//   ): Promise<void>;

//   // Subtask operations
//   checkSubtask(
//     boardId: string,
//     columnId: string,
//     taskID: string,
//     subtaskId: string,
//     value: boolean
//   ): Promise<void>;
// }

// // Initialize the appropriate data service based on the user's session
// let dataService: IDataService;

// export const initializeDataService = async (
//   session: SessionContextValue | null
// ) => {
//   if (session?.data?.user) {
//     dataService = new AppDataApiService();
//   } else {
//     dataService = new LocalStorageService();
//   }
// };

// // BehaviorSubject for app-wide state
// export const appData$ = observableService.appData$;

// // Initialization Functions
// export const initializeApp = async (
//   session: SessionContextValue | null
// ): Promise<AppData> => {
//   await initializeDataService(session);
//   const data = await dataService.getAppData();
//   observableService.updateAppData(data);
//   return data;
// };

// // Observable for boards
// export const boards$ = appData$.pipe(map(({ boards }) => boards));

// // Observable for board summaries
// export const boardSummaries$ = appData$.pipe(
//   map(({ boards }) => fromBoardsToSummaries(boards))
// );

// // Board Management Functions
// export const getBoardData = async (
//   boardId: string
// ): Promise<BoardType | null> => {
//   const data = await dataService.getAppData();
//   return data.boards.find(({ id }) => id === boardId) || null;
// };

// export const createBoard = async (
//   newBoard: BoardType
// ): Promise<BoardType | null> => {
//   const beforeData = observableService.getCurrentData();
//   try {
//     observableService.addBoard(newBoard);
//     const createdBoard = await dataService.createBoard(newBoard);
//     return createdBoard;
//   } catch (error) {
//     console.error("Error creating board:", error);
//     observableService.updateAppData(beforeData);
//     return null;
//   }
// };

// export const editBoard = async (
//   editedBoard: BoardType
// ): Promise<BoardType | null> => {
//   try {
//     observableService.updateBoard(editedBoard);
//     return await dataService.editBoard(editedBoard);
//   } catch (error) {
//     console.error("Error editing board", error);
//     return null;
//   }
// };

// export const deleteBoard = async (
//   boardId: string
// ): Promise<BoardType | null> => {
//   try {
//     observableService.deleteBoard(boardId);
//     return await dataService.deleteBoard(boardId);
//   } catch (error) {
//     console.error("Error deleting board: ", error);
//     return null;
//   }
// };

// export const moveBoard = async (
//   boardId: string,
//   before: string
// ): Promise<void> => {
//   try {
//     observableService.moveBoard(boardId, before);

//     await dataService.moveBoard(boardId, before);
//   } catch (error) {
//     console.error("Error moving board :", error);
//   }
// };

// // Column Management Functions
// export const addColumn = async (
//   boardId: string,
//   newColumn: ColumnType
// ): Promise<ColumnType | null> => {
//   try {
//     observableService.addColumn(boardId, newColumn);

//     const addedColumn = await dataService.addColumn(boardId, newColumn);
//     return addedColumn;
//   } catch (error) {
//     console.error("Error adding column: ", error);
//     return null;
//   }
// };

// export const editColumn = async (
//   boardId: string,
//   editedColumn: ColumnType
// ): Promise<ColumnType | null> => {
//   try {
//     observableService.updateColumn(boardId, editedColumn);

//     return await dataService.editColumn(boardId, editedColumn);
//   } catch (error) {
//     console.error("Error editing column: ", error);
//     return null;
//   }
// };

// export const deleteColumn = async (
//   boardId: string,
//   columnId: string
// ): Promise<ColumnType | null> => {
//   try {
//     observableService.deleteColumn(boardId, columnId);

//     return await dataService.deleteColumn(boardId, columnId);
//   } catch (error) {
//     console.error("Error deleting column: ", error);
//     return null;
//   }
// };

// export const moveColumn = async (
//   boardId: string,
//   columnId: string,
//   beforeId: string
// ): Promise<void> => {
//   try {
//     observableService.moveColumn(boardId, columnId, beforeId);

//     await dataService.moveColumn(boardId, columnId, beforeId);
//   } catch (error) {
//     console.error("Error moving column: ", error);
//   }
// };

// // Task Management Functions
// export const createTask = async (
//   boardId: string,
//   task: TaskType
// ): Promise<TaskType | null> => {
//   try {
//     observableService.addTask(boardId, task);

//     return await dataService.createTask(boardId, task);
//   } catch (error) {
//     console.error("Error creating task: ", error);
//     return null;
//   }
// };

// export const editTask = async (
//   boardId: string,
//   taskId: string,
//   oldColumnId: string,
//   newTask: TaskType
// ): Promise<TaskType | null> => {
//   try {
//     observableService.updateTask(boardId, taskId, oldColumnId, newTask);

//     return await dataService.editTask(boardId, taskId, oldColumnId, newTask);
//   } catch (error) {
//     console.error("Error editing task: ", error);
//     return null;
//   }
// };

// export const deleteTask = async (
//   boardId: string,
//   columnId: string,
//   taskId: string
// ): Promise<TaskType | null> => {
//   try {
//     observableService.deleteTask(boardId, columnId, taskId);

//     return await dataService.deleteTask(boardId, columnId, taskId);
//   } catch (error) {
//     console.error("Error deleting task: ", error);
//     return null;
//   }
// };

// export const moveTask = async (
//   boardId: string,
//   columnId: string,
//   newColumnId: string,
//   taskId: string,
//   beforeId: string
// ): Promise<void> => {
//   try {
//     observableService.moveTask(
//       boardId,
//       columnId,
//       newColumnId,
//       taskId,
//       beforeId
//     );

//     await dataService.moveTask(
//       boardId,
//       columnId,
//       newColumnId,
//       taskId,
//       beforeId
//     );
//   } catch (error) {
//     console.error("Error moving task: ", error);
//   }
// };

// // Subtask Operations
// export const checkSubtask = async (
//   boardId: string,
//   columnId: string,
//   taskId: string,
//   subtaskId: string,
//   value: boolean
// ): Promise<void> => {
//   try {
//     observableService.checkSubtask(boardId, columnId, taskId, subtaskId, value);

//     await dataService.checkSubtask(boardId, columnId, taskId, subtaskId, value);
//   } catch (error) {
//     console.error("Error checking subtask: ", error);
//   }
// };

// // Helper Functions
// const fromBoardsToSummaries = (boards: BoardType[]): BoardSummary[] => {
//   return boards.map(({ id, title }) => ({ id, title }));
// };

// const findBoard = (boards: BoardType[], boardId: string) => {
//   return boards.find((board) => board.id == boardId);
// };

// const findColumn = (columns: ColumnType[], columnId: string) => {
//   return columns.find((col) => col.id == columnId);
// };

// export const findTask = (tasks: TaskType[], taskId: string) => {
//   return tasks.find((task) => task.id == taskId);
// };

// export const getTask = async (
//   boardId: string,
//   taskId: string
// ): Promise<TaskType | null> => {
//   const data = await dataService?.getAppData();
//   const board = findBoard(data?.boards || [], boardId);
//   if (!board) return null;
//   for (const column of board.columns) {
//     const task = findTask(column.tasks, taskId);
//     if (task) return task;
//   }
//   return null;
// };

// export const getCheckedTasks = (subtasks: Subtask[]) => {
//   return subtasks.reduce((sum, sub) => sum + (sub.checked ? 1 : 0), 0);
// };

// export const fromColToOption = (col: ColumnType) => ({
//   value: col.id,
//   label: col.title,
// });

// export const fromColIdToOption = (columns: ColumnType[], colId: string) => {
//   const col = findColumn(columns, colId);
//   if (!col) return;
//   return fromColToOption(col);
// };

// export const getStatusArr = (currentBoard: BoardType | null) => {
//   return currentBoard?.columns.map(fromColToOption) || [];
// };
