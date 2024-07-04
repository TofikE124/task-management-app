import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  boards$,
  getFirstBoardId,
  saveCurrentBoardId,
} from "../services/appDataService";
import { BoardType } from "../types/taskTypes";

const useCurrentBoard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);

  const setBoardToFirst = () => {
    const firstBoardId = getFirstBoardId();
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
    const subscription = boards$.subscribe((boards) => setBoards(boards));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentBoardId && !boards.length) {
      setCurrentBoard(null);
    } else {
      const board = boards.find((board) => board.id == currentBoardId)!;
      if (!board) setBoardToFirst();
      else setCurrentBoard(board);
    }
  }, [currentBoardId, boards]);

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
