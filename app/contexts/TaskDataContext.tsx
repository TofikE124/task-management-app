"use client";
import { createContext, PropsWithChildren, useState } from "react";
import { ColumnType, TaskType } from "../types/taskTypes";

interface TaskData {
  activeColumn?: ColumnType;
  activeTask?: TaskType;
}

interface TaskDataType {
  taskData: TaskData | null;
  updateTaskData: (data: TaskData) => void;
}

export const TaskDataContext = createContext<TaskDataType | null>(null);

export const TaskDataProvider = ({ children }: PropsWithChildren) => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);

  const updateTaskData = (data: TaskData) => {
    setTaskData(data);
  };

  return (
    <TaskDataContext.Provider value={{ taskData, updateTaskData }}>
      {children}
    </TaskDataContext.Provider>
  );
};
