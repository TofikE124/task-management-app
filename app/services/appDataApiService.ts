import axios from "axios";
import { AppData, BoardType, ColumnType, TaskType } from "../types/taskTypes";
import { IDataService } from "./appDataService";

export class AppDataApiService implements IDataService {
  // Implementation of methods for API handling
  async getAppData(): Promise<AppData> {
    const boards = (await axios.get<BoardType[]>("/api/boards")).data;
    return { boards };
  }

  async createBoard(board: BoardType): Promise<BoardType | null> {
    const createdBoard = (await axios.post("/api/boards", board)).data;
    return createdBoard;
  }

  async editBoard(board: BoardType): Promise<BoardType | null> {
    const editedBoard = (await axios.patch("/api/boards", board)).data;
    return editedBoard;
  }

  async deleteBoard(boardId: string): Promise<BoardType | null> {
    const deletedBoard = (await axios.delete(`/api/boards/${boardId}`)).data;
    return deletedBoard;
  }

  async moveBoard(boardId: string, beforeId: string): Promise<void> {
    const updatedBoards = await axios.patch(`/api/boards/order/${boardId}`, {
      beforeId,
    });
  }

  async addColumn(
    boardId: string,
    column: ColumnType
  ): Promise<ColumnType | null> {
    const addedColumn = (
      await axios.post("/api/columns", column, {
        params: {
          boardId,
        },
      })
    ).data;
    return addedColumn;
  }

  async editColumn(
    boardId: string,
    column: ColumnType
  ): Promise<ColumnType | null> {
    const editedColumn = (
      await axios.patch(`/api/columns/${column.id}`, column)
    ).data;
    return editedColumn;
  }

  async deleteColumn(
    boardId: string,
    columnId: string
  ): Promise<ColumnType | null> {
    const deletedColumn = (await axios.delete(`/api/columns/${columnId}`)).data;
    return deletedColumn;
  }

  async moveColumn(
    boardId: string,
    columnId: string,
    beforeId: string
  ): Promise<void> {
    const newColumns = await axios.patch(`/api/columns/order/${columnId}`, {
      boardId,
      beforeId,
    });
    newColumns;
  }

  async createTask(boardId: string, task: TaskType): Promise<TaskType | null> {
    const createdTask = (await axios.post<TaskType>("/api/tasks", task)).data;
    return createdTask;
  }

  async editTask(
    boardId: string,
    taskId: string,
    oldColumnId: string,
    newTask: TaskType
  ): Promise<TaskType | null> {
    const editedTask = (await axios.patch(`/api/tasks/${taskId}`, newTask))
      .data;
    return editedTask;
  }

  async deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Promise<TaskType | null> {
    const deletedTask = (await axios.delete(`/api/tasks/${taskId}`)).data;
    return deletedTask;
  }

  async moveTask(
    boardId: string,
    columnId: string,
    newColumnId: string,
    taskId: string,
    beforeId: string
  ): Promise<void> {
    const updatedTasks = (
      await axios.patch(`/api/tasks/order/${taskId}`, {
        boardId,
        columnId,
        newColumnId,
        beforeId,
      })
    ).data;
  }

  async checkSubtask(
    boardId: string,
    columnId: string,
    taskID: string,
    subtaskId: string,
    value: boolean
  ): Promise<void> {
    const updatedSubtask = await axios.patch(
      `/api/subtasks/check/${subtaskId}`,
      { checked: value }
    );
    console.log(updatedSubtask);
  }
}
