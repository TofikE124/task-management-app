import { AppData, BoardType, ColumnType, TaskType } from "../types/taskTypes";
import { IDataService } from "./appDataService";
import { findBoard, findColumn } from "./utilities";

const APP_DATA_KEY = "appData";

export class LocalStorageService implements IDataService {
  // Implementation of methods for local storage handling
  async getAppData(): Promise<AppData> {
    return JSON.parse(localStorage.getItem(APP_DATA_KEY) || "{}");
  }

  async updateAppData(data: AppData) {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  }

  async createBoard(board: BoardType): Promise<BoardType | null> {
    const data = await this.getAppData();
    data.boards.push(board);
    this.updateAppData(data);

    return null;
  }

  async editBoard(board: BoardType): Promise<BoardType | null> {
    const data = await this.getAppData();
    data.boards = data.boards.map((b) => (b.id == board.id ? board : b));
    this.updateAppData(data);
    return null;
  }

  async deleteBoard(boardId: string): Promise<BoardType | null> {
    const data = await this.getAppData();
    data.boards = data.boards.filter((b) => b.id != boardId);
    this.updateAppData(data);
    return null;
  }

  async moveBoard(boardId: string, beforeId: string): Promise<void> {
    const data = await this.getAppData();

    const { boards } = data;
    const index1 = boards.findIndex((b) => b.id == boardId);
    let index2 =
      beforeId == "-1"
        ? boards.length
        : boards.findIndex((b) => b.id == beforeId);

    index2 = index2 > index1 ? index2 - 1 : index2;

    const item = boards.splice(index1, 1)[0];
    boards.splice(index2, 0, item);

    this.updateAppData(data);
  }

  async addColumn(
    boardId: string,
    column: ColumnType
  ): Promise<ColumnType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;
    board.columns.push(column);

    this.updateAppData(data);

    return null;
  }

  async editColumn(
    boardId: string,
    column: ColumnType
  ): Promise<ColumnType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;
    board.columns = board.columns.map((col) =>
      col.id == column.id ? column : col
    );

    this.updateAppData(data);

    return null;
  }

  async deleteColumn(
    boardId: string,
    columnId: string
  ): Promise<ColumnType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;
    board.columns = board.columns.filter((col) => col.id != columnId);

    this.updateAppData(data);

    return null;
  }

  async moveColumn(
    boardId: string,
    column1Id: string,
    beforeId: string
  ): Promise<void> {
    const data = await this.getAppData();
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

    this.updateAppData(data);
  }

  async createTask(boardId: string, task: TaskType): Promise<TaskType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;
    const column = findColumn(board.columns, task.columnId);
    if (!column) return null;
    column.tasks.push(task);

    this.updateAppData(data);
    return null;
  }

  async editTask(
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ): Promise<TaskType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;

    const oldColumn = board.columns.find((col) => col.id === oldColumnId);
    if (!oldColumn) return null;

    const newColumn = findColumn(board.columns, newTask.columnId);
    if (!newColumn) return null;

    if (oldColumn === newColumn) {
      newColumn.tasks = newColumn.tasks.map((task) =>
        task.id === taskId ? newTask : task
      );
    } else {
      oldColumn.tasks = oldColumn.tasks.filter((task) => task.id !== taskId);
      newColumn.tasks.push(newTask);
    }

    this.updateAppData(data);
    return null;
  }

  async deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Promise<TaskType | null> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return null;

    const column = findColumn(board.columns, columnId);
    if (!column) return null;

    column.tasks = column.tasks.filter((task) => task.id !== taskId);

    this.updateAppData(data);
    return null;
  }

  async moveTask(
    boardId: string,
    columnId: string,
    newColumnId: string,
    taskId: string,
    beforeId: string
  ): Promise<void> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const fromCol = findColumn(board.columns, columnId);
    const toCol = findColumn(board.columns, newColumnId);
    if (!fromCol || !toCol) return;

    const taskIndex = fromCol.tasks.findIndex((task) => task.id === taskId);
    const task = fromCol.tasks.splice(taskIndex, 1)[0];

    const beforeIndex =
      beforeId === "-1"
        ? toCol.tasks.length
        : toCol.tasks.findIndex((task) => task.id === beforeId);
    toCol.tasks.splice(beforeIndex, 0, { ...task, columnId: toCol.id });

    this.updateAppData(data);
  }

  async checkSubtask(
    boardId: string,
    columnId: string,
    taskID: string,
    subtaskId: string,
    value: boolean
  ): Promise<void> {
    const data = await this.getAppData();
    const board = findBoard(data.boards, boardId);
    if (!board) return;

    const column = findColumn(board.columns, columnId);
    if (!column) return;

    const task = column.tasks.find((task) => task.id === taskID);
    if (!task) return;

    const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
    if (!subtask) return;

    subtask.checked = value;

    this.updateAppData(data);
  }
}
