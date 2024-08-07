"use client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { BoardType, ColumnType, TaskType } from "../types/taskTypes";
import appDataService from "../services/appDataService";
import useCurrentBoard from "../hooks/useCurrentBoard";
import observableService from "../services/observableService";

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
    const subscription = appDataService.appData$.subscribe((data) => {
      const task = observableService.getTask(
        currentBoardId || "",
        taskData?.activeTask?.id || ""
      );

      if (task) setTaskData({ activeTask: task });
    });

    return () => subscription.unsubscribe();
  }, [currentBoardId, taskData?.activeTask?.id]);

  return (
    <TaskDataContext.Provider value={{ taskData, updateTaskData }}>
      {children}
    </TaskDataContext.Provider>
  );
};
