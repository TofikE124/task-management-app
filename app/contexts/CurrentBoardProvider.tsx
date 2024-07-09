"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import appDataService from "../services/appDataService";
import observableService from "../services/observableService";
import { saveCurrentBoardId } from "../services/utilities";
import { BoardType } from "../types/taskTypes";

interface CurrentBoardContextType {
  currentBoardId: string | null;
  currentBoard: BoardType | null;
  navigateToBoard: (boardId: string | null) => void;
}

export const CurrentBoardContext = createContext<CurrentBoardContextType>(
  {} as CurrentBoardContextType
);

export const CurrentBoardProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [gotSearchParams, setGotSearchParams] = useState(false);

  const setBoardToFirst = () => {
    const firstBoardId = observableService.getFirstBoardId();
    if (firstBoardId) {
      setCurrentBoardId(firstBoardId);
      navigateToBoard(firstBoardId);
    } else {
      setCurrentBoardId(null);
      navigateToBoard(null);
    }
  };

  useEffect(() => {
    if (!boards.length) setCurrentBoard(null);
    const board = boards.find((b) => b.id == currentBoardId);
    if (board) setCurrentBoard(board);
    else if (
      (!currentBoardId && boards.length && gotSearchParams) ||
      (currentBoardId && !board && boards.length && gotSearchParams)
    )
      setBoardToFirst();
  }, [boards, currentBoardId]);

  useEffect(() => {
    const subscription = appDataService.boards$.subscribe((boards) =>
      setBoards(boards)
    );
    return () => subscription.unsubscribe();
  }, [currentBoardId]);

  useEffect(() => {
    const boardId = searchParams.get("currentBoardId");
    setGotSearchParams(true);
    setCurrentBoardId(boardId);
  }, [searchParams]);

  const navigateToBoard = (boardId: string | null) => {
    if (boardId) {
      router.push(`/?currentBoardId=${boardId}`);
      saveCurrentBoardId(boardId);
    } else {
      router.push(`/`);
    }
  };

  return (
    <CurrentBoardContext.Provider
      value={{ currentBoardId, currentBoard, navigateToBoard }}
    >
      {children}
    </CurrentBoardContext.Provider>
  );
};
