import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  boards$,
  getCurrentBoardId,
  getFirstBoardId,
  saveCurrentBoardId,
} from "../services/taskService";
import { BoardType } from "../types/taskTypes";

const useCurrentBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>("");
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);

  const getFirstBoard = () => {
    setCurrentBoardId(getFirstBoardId());
  };

  useEffect(() => {
    if (!currentBoardId) return;
    boards$.subscribe((boards) => {
      const board = boards.find((board) => board.id == currentBoardId)!;
      if (!board) getFirstBoard();
      else setCurrentBoard(board);
    });
  }, [currentBoardId]);

  useEffect(() => {
    const boardId = getCurrentBoardId();
    if (boardId) setCurrentBoardId(boardId);
    else getFirstBoard();
  }, [searchParams]);

  const navigateToBoard = (boardId: string) => {
    router.push(`/?currentBoardId=${boardId}`);
    saveCurrentBoardId(boardId);
  };

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
