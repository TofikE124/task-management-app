import { useEffect, useState } from "react";
import {
  getBoardData,
  getBoardSummaries,
  getCurrentBoardId,
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
    setCurrentBoardId(getCurrentBoardId());
  }, [searchParams]);

  useEffect(() => {
    if (currentBoardId) {
      navigateToBoard(currentBoardId);
      getBoardData(currentBoardId).then((board) => setCurrentBoard(board));
    } else {
      getBoardSummaries().then((summaries) => {
        setCurrentBoardId(summaries[0]?.id);
      });
    }
  }, [currentBoardId]);

  useEffect(() => {}, [currentBoardId]);

  const navigateToBoard = (boardId: string) => {
    router.push(`/?currentBoardId=${boardId}`);
    saveCurrentBoardId(boardId);
  };

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
