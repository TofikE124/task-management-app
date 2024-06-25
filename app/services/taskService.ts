import { Router, useRouter } from "next/router";
import { Board, BoardSummary } from "../types/taskTypes";
import { loadFromLocalStorage } from "./storageService";

export const getBoardSummaries = async (
  userId?: string
): Promise<BoardSummary[]> => {
  let data;
  if (userId) {
  } else {
    data = loadFromLocalStorage();
  }

  if (!data || !data.boards) {
    return [];
  }

  return Object.values(data.boards).map(({ id, title }) => ({ id, title }));
};

export const getBoardData = async (
  boardId: string,
  userId?: string
): Promise<Board | null> => {
  if (userId) {
  } else {
    return loadFromLocalStorage()?.boards.filter(({ id }) => id == boardId)[0];
  }
  return null;
};

const CURRENT_BOARD_ID_KEY = "currentBoardId";
export const getCurrentBoardId = () => {
  return localStorage.getItem(CURRENT_BOARD_ID_KEY);
};

export const saveCurrentBoardId = (currentBoardId: string) => {
  localStorage.setItem(CURRENT_BOARD_ID_KEY, currentBoardId);
};
