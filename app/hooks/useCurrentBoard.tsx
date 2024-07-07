import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { appData$, boards$ } from "../services/appDataService";
import { BoardType } from "../types/taskTypes";
import { getCurrentBoardId, saveCurrentBoardId } from "../services/utilities";
import observableService from "../services/observableService";

const useCurrentBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);

  const setBoardToFirst = () => {
    const firstBoardId = observableService.getFirstBoardId();
    if (firstBoardId) {
      {
        setCurrentBoardId(firstBoardId);
        navigateToBoard(firstBoardId);
      }
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
    () => subscription.unsubscribe();
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

  return { currentBoardId, currentBoard, navigateToBoard };
};

export default useCurrentBoard;
