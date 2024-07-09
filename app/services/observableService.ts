import { BehaviorSubject, map } from "rxjs";
import {
  AppData,
  BoardSummary,
  BoardType,
  ColumnType,
  TaskType,
} from "../types/taskTypes";
import {
  fromBoardsToSummaries,
  findBoard,
  findColumn,
  findTask,
} from "./utilities";

import { Observable } from "rxjs";

export interface IObservableService {
  appData$: Observable<AppData>;
  boards$: Observable<BoardType[]>;
  boardSummaries$: Observable<BoardSummary[]>;

  updateAppData(appData: AppData): void;

  getBoardData(boardId: string): BoardType | null;

  addBoard(newBoard: BoardType): void;
  updateBoard(updatedBoard: BoardType): void;
  deleteBoard(boardId: string): void;
  moveBoard(boardId: string, beforeId: string): void;

  addColumn(boardId: string, newColumn: ColumnType): void;
  updateColumn(boardId: string, updatedColumn: ColumnType): void;
  deleteColumn(boardId: string, columnId: string): void;
  moveColumn(boardId: string, column1Id: string, beforeId: string): void;

  addTask(boardId: string, task: TaskType): void;
  updateTask(
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ): void;
  deleteTask(boardId: string, columnId: string, taskId: string): void;
  moveTask(
    boardId: string,
    fromColId: string,
    taskId: string,
    toColId: string,
    beforeId: string
  ): void;

  checkSubtask(
    boardId: string,
    columnId: string,
    taskId: string,
    subtaskId: string,
    value: boolean
  ): void;
}

export class ObservableServic implements IObservableService {
  private appDataSubject = new BehaviorSubject<AppData>({ boards: [] });

  public appData$ = this.appDataSubject.asObservable();
  public boards$ = this.appData$.pipe(map(({ boards }) => boards));
  public boardSummaries$ = this.appData$.pipe(
    map(({ boards }) => fromBoardsToSummaries(boards))
  );

  public getCurrentData(): AppData {
    return this.appDataSubject.value;
  }

  public updateAppData(data: AppData) {
    this.appDataSubject.next(data);
  }

  public getBoardData(boardId: string): BoardType | null {
    const data = this.appDataSubject.value;
    return findBoard(data.boards, boardId) || null;
  }

  public addBoard(newBoard: BoardType) {
    const currentData = this.appDataSubject.value;
    const updatedData: AppData = {
      ...currentData,
      boards: [...currentData.boards, newBoard],
    };
    this.appDataSubject.next(updatedData);
  }

  public updateBoard(updatedBoard: BoardType) {
    const data = this.appDataSubject.value;
    data.boards = data.boards.map((board) =>
      board.id === updatedBoard.id ? updatedBoard : board
    );
    this.appDataSubject.next(data);
  }

  public deleteBoard(boardId: string) {
    const data = this.appDataSubject.value;
    data.boards = data.boards.filter((board) => board.id !== boardId);
    this.appDataSubject.next(data);
  }

  public moveBoard(boardId: string, beforeId: string) {
    const data = this.appDataSubject.value;
    const { boards } = data;
    const index1 = boards.findIndex((b) => b.id == boardId);
    let index2 =
      beforeId == "-1"
        ? boards.length
        : boards.findIndex((b) => b.id == beforeId);

    index2 = index2 > index1 ? index2 - 1 : index2;

    const item = boards.splice(index1, 1)[0];
    boards.splice(index2, 0, item);

    this.appDataSubject.next(data);
  }

  public addColumn(boardId: string, newColumn: ColumnType) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;
    const newColumns = [...board.columns, newColumn];
    const updatedBoard = { ...board, columns: newColumns };
    const updatedData = {
      boards: data.boards.map((b) => (b.id == boardId ? updatedBoard : b)),
    };
    this.appDataSubject.next(updatedData);
  }

  public updateColumn(boardId: string, updatedColumn: ColumnType) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;
    const column = findColumn(board.columns, updatedColumn.id);
    if (!column) return;
    Object.assign(column, updatedColumn);
    this.appDataSubject.next(data);
  }

  public deleteColumn(boardId: string, columnId: string) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;
    const updatedBoard = {
      ...board,
      columns: board.columns.filter((col) => col.id !== columnId),
    };
    const updatedData = {
      ...data,
      boards: data.boards.map((b) => (b.id == boardId ? updatedBoard : b)),
    };
    this.appDataSubject.next(updatedData);
  }

  public moveColumn(boardId: string, column1Id: string, beforeId: string) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const { columns } = board;
    const column1Index = columns.findIndex((col) => col.id === column1Id);
    const column2Index =
      beforeId === "-1"
        ? columns.length
        : columns.findIndex((col) => col.id === beforeId);

    if (column1Index === -1 || column2Index === -1) return;

    const [movedColumn] = columns.splice(column1Index, 1);
    columns.splice(column2Index, 0, movedColumn);
    this.appDataSubject.next(data);
  }

  public addTask(boardId: string, task: TaskType) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const column = findColumn(board.columns, task.columnId);
    if (!column) return;

    const updatedColumn = { ...column, tasks: [...column.tasks, task] };
    const updatedBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id == updatedColumn.id ? updatedColumn : c
      ),
    };
    const updatedData = {
      boards: data.boards.map((b) => (b.id == boardId ? updatedBoard : b)),
    };

    this.appDataSubject.next(updatedData);
  }

  public updateTask(
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const oldColumn = board.columns.find((col) => col.id === oldColumnId);
    if (!oldColumn) return;

    const newColumn = findColumn(board.columns, newTask.columnId);
    if (!newColumn) return;

    if (oldColumn === newColumn) {
      newColumn.tasks = newColumn.tasks.map((task) =>
        task.id === taskId ? newTask : task
      );
    } else {
      oldColumn.tasks = oldColumn.tasks.filter((task) => task.id !== taskId);
      newColumn.tasks.push(newTask);
    }

    const updatedData = {
      ...data,
      boards: data.boards.map((b) => (b.id == boardId ? { ...board } : b)),
    };

    this.appDataSubject.next(updatedData);
  }

  public deleteTask(boardId: string, columnId: string, taskId: string) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const column = findColumn(board.columns, columnId);
    if (!column) return;

    column.tasks = column.tasks.filter((task) => task.id !== taskId);

    const updatedData = {
      ...data,
      boards: data.boards.map((b) => (b.id == boardId ? { ...board } : b)),
    };

    this.appDataSubject.next(updatedData);
  }

  public moveTask(
    boardId: string,
    fromColId: string,
    toColId: string,
    taskId: string,
    beforeId: string
  ) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const fromCol = findColumn(board.columns, fromColId);
    const toCol = findColumn(board.columns, toColId);
    if (!fromCol || !toCol) return;

    const taskIndex = fromCol.tasks.findIndex((task) => task.id === taskId);
    const task = fromCol.tasks.splice(taskIndex, 1)[0];

    const beforeIndex =
      beforeId === "-1"
        ? toCol.tasks.length
        : toCol.tasks.findIndex((task) => task.id === beforeId);
    toCol.tasks.splice(beforeIndex, 0, { ...task, columnId: toCol.id });

    const updatedData: AppData = {
      ...data,
      boards: data.boards.map((b) => (b.id == board.id ? { ...board } : b)),
    };

    this.appDataSubject.next(updatedData);
  }

  public checkSubtask(
    boardId: string,
    columnId: string,
    taskId: string,
    subtaskId: string,
    value: boolean
  ) {
    const data = this.appDataSubject.value;
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const column = findColumn(board.columns, columnId);
    if (!column) return;

    const task = column.tasks.find((task) => task.id === taskId);
    if (!task) return;

    const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
    if (!subtask) return;

    subtask.checked = value;
    this.appDataSubject.next(data);
  }

  public getTask(boardId: string, taskId: string) {
    const data = this.appDataSubject.value;
    const board = findBoard(data?.boards || [], boardId);
    if (!board) return null;
    for (const column of board.columns) {
      const task = findTask(column.tasks, taskId);
      if (task) return task;
    }
    return null;
  }

  public getFirstBoardId = (): string | null => {
    const firstBoard = this.appDataSubject.value.boards[0];
    return firstBoard ? firstBoard.id : null;
  };
}

const observableService = new ObservableServic();
export default observableService;
