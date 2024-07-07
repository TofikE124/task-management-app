import { useContext } from "react";
import { TaskDataContext } from "../contexts/TaskDataProvider";

export const useTaskData = () => {
  const context = useContext(TaskDataContext);
  if (!context) {
    throw new Error("useTaskData must be used within a TaskDataProvider");
  }
  return context;
};
