// services/localStorageService.js

import { AppData, BoardType } from "../types/taskTypes";

const STORAGE_KEY = "taskData";

export const saveToLocalStorage = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromLocalStorage = (): { boards: BoardType[] } => {
  if (typeof localStorage == "undefined") return { boards: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { boards: [] };
};

export const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
