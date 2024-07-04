"use client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { BoardType, ColumnType, TaskType } from "../types/taskTypes";
import { appData$, getTask } from "../services/appDataService";
import useCurrentBoard from "../hooks/useCurrentBoard";

interface TaskData {
  activeColumn?: ColumnType;
  activeTask?: TaskType;
  activeBoard?: BoardType;
}

interface TaskDataType {
  taskData: TaskData | null;
  updateTaskData: (data: TaskData) => void;
}

export const TaskDataContext = createContext<TaskDataType | null>(null);

export const TaskDataProvider = ({ children }: PropsWithChildren) => {
  const { currentBoardId } = useCurrentBoard();
  const [taskData, setTaskData] = useState<TaskData | null>(null);

  const updateTaskData = (data: TaskData) => {
    setTaskData(data);
  };

  useEffect(() => {
    appData$.subscribe((data) => {
      getTask(currentBoardId || "", taskData?.activeTask?.id || "").then(
        (task) => (task ? setTaskData({ activeTask: task }) : null)
      );
    });
  }, []);

  return (
    <TaskDataContext.Provider value={{ taskData, updateTaskData }}>
      {children}
    </TaskDataContext.Provider>
  );
};
