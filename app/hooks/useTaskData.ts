import { useContext } from "react";
import { TaskDataContext } from "../contexts/TskDataProvider";

export const useTaskData = () => {
  const context = useContext(TaskDataContext);
  if (!context) {
    throw new Error("useTaskData must be used within a TaskDataProvider");
  }
  return context;
};
