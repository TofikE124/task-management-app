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
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);

  const setBoardToFirst = () => {
    const firstBoardId = getFirstBoardId();
    if (firstBoardId) {
      navigateToBoard(firstBoardId);
    } else setCurrentBoardId(null);
  };

  useEffect(() => {
    if (!currentBoardId) {
      setCurrentBoard(null);
      return;
    }
    boards$.subscribe((boards) => {
      const board = boards.find((board) => board.id == currentBoardId)!;
      if (!board) setBoardToFirst();
      else setCurrentBoard(board);
    });
  }, [currentBoardId]);

  useEffect(() => {
    const boardId = searchParams.get("currentBoardId");
    if (boardId) setCurrentBoardId(boardId);
    else setBoardToFirst();
  }, [searchParams]);

  const navigateToBoard = (boardId: string) => {
    router.push(`/?currentBoardId=${boardId}`);
    saveCurrentBoardId(boardId);
  };

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
