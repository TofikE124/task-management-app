import { SessionContextValue } from "next-auth/react";
import { map } from "rxjs";
import {
  AppData,
  BoardSummary,
  BoardType,
  ColumnType,
  Subtask,
  TaskType,
} from "../types/taskTypes";
import { AppDataApiService } from "./appDataApiService";
import { LocalStorageService } from "./appDataLocalStorageService";
import observableService from "./observableService";
import { DataServiceBase } from "./DataServiceBase";
import { fromBoardsToSummaries } from "./utilities";

// Interface for data service
export interface IDataService {
  getAppData(): Promise<AppData>;

  // Board CRUD operations
  createBoard(board: BoardType): Promise<BoardType | null>;
  editBoard(board: BoardType): Promise<BoardType | null>;
  deleteBoard(boardId: string): Promise<BoardType | null>;
  moveBoard(boardId: string, beforeId: string): Promise<void>;

  // Column CRUD operations
  addColumn(boardId: string, column: ColumnType): Promise<ColumnType | null>;
  editColumn(boardId: string, column: ColumnType): Promise<ColumnType | null>;
  deleteColumn(boardId: string, columnId: string): Promise<ColumnType | null>;
  moveColumn(
    boardId: string,
    column1Id: string,
    beforeId: string
  ): Promise<void>;

  // Task CRUD operations
  createTask(boardId: string, task: TaskType): Promise<TaskType | null>;
  editTask(
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ): Promise<TaskType | null>;
  deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Promise<TaskType | null>;
  moveTask(
    boardId: string,
    columnId: string,
    newColumnId: string,
    taskId: string,
    beforeId: string
  ): Promise<void>;

  // Subtask operations
  checkSubtask(
    boardId: string,
    columnId: string,
    taskId: string,
    subtaskId: string,
    value: boolean
  ): Promise<void>;
}

// Initialize the appropriate data service based on the user's session
let dataService: IDataService;

export class AppDataService extends DataServiceBase {
  public appData$ = observableService.appData$;
  public boards$ = this.appData$.pipe(map(({ boards }) => boards));
  public boardSummaries$ = this.appData$.pipe(
    map(({ boards }) => fromBoardsToSummaries(boards))
  );

  private async verifyData() {
    const data = await dataService.getAppData();
    observableService.updateAppData(data);
  }

  public initializeDataService = async (
    session: SessionContextValue | null
  ) => {
    if (session?.data?.user) {
      dataService = new AppDataApiService();
    } else {
      dataService = new LocalStorageService();
    }
  };

  public initializeApp = async (
    session: SessionContextValue | null
  ): Promise<AppData> => {
    await this.initializeDataService(session);
    const data = await dataService.getAppData();
    observableService.updateAppData(data);
    return data;
  };

  public getBoardData = async (boardId: string): Promise<BoardType | null> => {
    const data = await dataService.getAppData();
    return data.boards.find(({ id }) => id === boardId) || null;
  };

  public createBoard = async (
    newBoard: BoardType
  ): Promise<BoardType | null> => {
    return this.executeOperation<BoardType>(
      async () => {
        observableService.addBoard(newBoard);
        const createdBoard = await dataService.createBoard(newBoard);
        return createdBoard;
      },
      () => {},
      "An error occurred while creating the board"
    );
  };

  public editBoard = async (
    editedBoard: BoardType
  ): Promise<BoardType | null> => {
    return this.executeOperation<BoardType>(
      async () => {
        observableService.updateBoard(editedBoard);
        const updatedBoard = await dataService.editBoard(editedBoard);
        return updatedBoard;
      },
      () => {},
      "An error occurred while editing the board"
    );
  };

  public deleteBoard = async (boardId: string): Promise<BoardType | null> => {
    return this.executeOperation<BoardType>(
      async () => {
        observableService.deleteBoard(boardId);
        const deletedBoard = await dataService.deleteBoard(boardId);
        return deletedBoard;
      },
      () => {},
      "An error occurred while deleting the board"
    );
  };

  public moveBoard = async (boardId: string, before: string): Promise<void> => {
    this.executeOperation<void>(
      async () => {
        observableService.moveBoard(boardId, before);
        await dataService.moveBoard(boardId, before);
      },
      () => {},
      "An error occurred while moving the board"
    );
  };

  public addColumn = async (
    boardId: string,
    newColumn: ColumnType
  ): Promise<ColumnType | null> => {
    return this.executeOperation<ColumnType>(
      async () => {
        observableService.addColumn(boardId, newColumn);
        const addedColumn = await dataService.addColumn(boardId, newColumn);
        return addedColumn;
      },
      () => {},
      "An error occurred while adding the column"
    );
  };

  public editColumn = async (
    boardId: string,
    editedColumn: ColumnType
  ): Promise<ColumnType | null> => {
    return this.executeOperation<ColumnType>(
      async () => {
        observableService.updateColumn(boardId, editedColumn);
        const updatedColumn = await dataService.editColumn(
          boardId,
          editedColumn
        );
        return updatedColumn;
      },
      () => {},
      "An error occurred while editing the column"
    );
  };

  public deleteColumn = async (
    boardId: string,
    columnId: string
  ): Promise<ColumnType | null> => {
    return this.executeOperation<ColumnType>(
      async () => {
        observableService.deleteColumn(boardId, columnId);
        const deletedColumn = await dataService.deleteColumn(boardId, columnId);
        return deletedColumn;
      },
      () => {},
      "An error occurred while deleting the column"
    );
  };

  public moveColumn = async (
    boardId: string,
    columnId: string,
    beforeId: string
  ): Promise<void> => {
    this.executeOperation<void>(
      async () => {
        observableService.moveColumn(boardId, columnId, beforeId);
        await dataService.moveColumn(boardId, columnId, beforeId);
      },
      () => {},
      "An error occurred while moving the column"
    );
  };

  public createTask = async (
    boardId: string,
    task: TaskType
  ): Promise<TaskType | null> => {
    return this.executeOperation<TaskType>(
      async () => {
        observableService.addTask(boardId, task);
        const createdTask = await dataService.createTask(boardId, task);
        return createdTask;
      },
      () => {},
      "An error occurred while creating the task"
    );
  };

  public editTask = async (
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ): Promise<TaskType | null> => {
    return this.executeOperation<TaskType>(
      async () => {
        observableService.updateTask(boardId, taskId, oldColumnId, newTask);
        const updatedTask = await dataService.editTask(
          boardId,
          taskId,
          oldColumnId,
          newTask
        );
        return updatedTask;
      },
      () => {},
      "An error occurred while editing the task"
    );
  };

  public deleteTask = async (
    boardId: string,
    columnId: string,
    taskId: string
  ): Promise<TaskType | null> => {
    return this.executeOperation<TaskType>(
      async () => {
        observableService.deleteTask(boardId, columnId, taskId);
        const deletedTask = await dataService.deleteTask(
          boardId,
          columnId,
          taskId
        );
        return deletedTask;
      },
      () => {},
      "An error occurred while deleting the task"
    );
  };

  public moveTask = async (
    boardId: string,
    columnId: string,
    newColumnId: string,
    taskId: string,
    beforeId: string
  ): Promise<void> => {
    this.executeOperation<void>(
      async () => {
        observableService.moveTask(
          boardId,
          columnId,
          newColumnId,
          taskId,
          beforeId
        );
        await dataService.moveTask(
          boardId,
          columnId,
          newColumnId,
          taskId,
          beforeId
        );
      },
      () => {},
      "An error occurred while moving the task"
    );
  };

  public checkSubtask = async (
    boardId: string,
    columnId: string,
    taskId: string,
    subtaskId: string,
    value: boolean
  ): Promise<void> => {
    this.executeOperation<void>(
      async () => {
        observableService.checkSubtask(
          boardId,
          columnId,
          taskId,
          subtaskId,
          value
        );
        await dataService.checkSubtask(
          boardId,
          columnId,
          taskId,
          subtaskId,
          value
        );
      },
      () => {},
      "An error occurred while checking the subtask"
    );
  };
}

const appDataService = new AppDataService();
export default appDataService;
