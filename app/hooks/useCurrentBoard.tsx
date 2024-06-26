import { useEffect, useState } from "react";
import {
  getBoardData,
  getCurrentBoardId,
  getFirstBoardId,
  saveCurrentBoardId,
} from "../services/taskService";
import { useRouter, useSearchParams } from "next/navigation";
import { Board } from "../types/taskTypes";

const useCurrentBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>("");
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (getCurrentBoardId()) setCurrentBoardId(getCurrentBoardId());
    else setCurrentBoardId(getFirstBoardId());
  }, [searchParams]);

  useEffect(() => {
    if (currentBoardId) {
      navigateToBoard(currentBoardId);
      getBoardData(currentBoardId).then((board) => setCurrentBoard(board));
    }
  }, [currentBoardId]);

  const navigateToBoard = (boardId: string) => {
    router.push(`/?currentBoardId=${boardId}`);
    saveCurrentBoardId(boardId);
  };

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
