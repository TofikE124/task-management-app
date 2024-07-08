"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  Suspense,
  useEffect,
  useState,
} from "react";
import { boards$ } from "../services/appDataService";
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
    else if (currentBoardId && boards.length) setBoardToFirst();
  }, [boards, currentBoardId]);

  useEffect(() => {
    const subscription = boards$.subscribe((boards) => setBoards(boards));
    return () => subscription.unsubscribe();
  }, [currentBoardId]);

  useEffect(() => {
    const boardId = searchParams.get("currentBoardId");
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
