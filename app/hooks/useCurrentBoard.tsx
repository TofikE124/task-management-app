import { useEffect, useState } from "react";
import {
  boards$,
  getBoardData,
  getCurrentBoardId,
  getFirstBoardId,
  saveCurrentBoardId,
} from "../services/taskService";
import { useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../types/taskTypes";

const useCurrentBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>("");
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);

  useEffect(() => {
    if (!currentBoardId) return;
    boards$.subscribe((boards) => {
      setCurrentBoard(boards.find((board) => board.id == currentBoardId)!);
    });
  }, [currentBoardId]);

  useEffect(() => {
    if (getCurrentBoardId()) setCurrentBoardId(getCurrentBoardId());
    else setCurrentBoardId(getFirstBoardId());
  }, [searchParams]);

  const navigateToBoard = (boardId: string) => {
    router.push(`/?currentBoardId=${boardId}`);
    saveCurrentBoardId(boardId);
  };

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
