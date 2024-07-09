"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import appDataService from "../services/appDataService";

// Define an enum for delete action types
export enum DELETE_TYPE {
  TASK = "Task",
  COLUMN = "Column",
  BOARD = "Board",
}

type DeleteTask = {
  type: DELETE_TYPE.TASK;
  taskId: string;
  columnId: string;
  boardId: string;
};

type DeleteColumn = {
  type: DELETE_TYPE.COLUMN;
  columnId: string;
  boardId: string;
};

type DeleteBoard = {
  type: DELETE_TYPE.BOARD;
  boardId: string;
};

type DeleteAction = DeleteTask | DeleteColumn | DeleteBoard;

type DeleteContextType = {
  action: DeleteAction | null;
  deleteItem: () => void;
  updateAction: (action: DeleteAction) => void;
};

export const deleteContext = createContext<DeleteContextType | null>(null);

const DeleteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [action, setAction] = useState<DeleteAction | null>(null);

  const updateAction = (action: DeleteAction) => setAction(action);

  const deleteItem = () => {
    if (!action) return;

    switch (action.type) {
      case DELETE_TYPE.TASK:
        appDataService.deleteTask(
          action.boardId,
          action.columnId,
          action.taskId
        );
        break;
      case DELETE_TYPE.COLUMN:
        appDataService.deleteColumn(action.boardId, action.columnId);
        break;
      case DELETE_TYPE.BOARD:
        appDataService.deleteBoard(action.boardId);
        break;
      default:
        throw new Error("Unknown delete action type");
    }
  };

  return (
    <deleteContext.Provider value={{ action, updateAction, deleteItem }}>
      {children}
    </deleteContext.Provider>
  );
};

export default DeleteProvider;

// Hook to use the delete context
export const useDeleteContext = () => {
  const context = useContext(deleteContext);
  if (!context) {
    throw new Error("useDeleteContext must be used within a DeleteProvider");
  }
  return context;
};
