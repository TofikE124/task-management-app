import { useEffect, useState } from "react";
import { getBoardSummaries } from "../services/taskService";
import { BoardSummary } from "../types/taskTypes";

const useBoardSummaries = () => {
  const [boardSummaries, setBoardSummaries] = useState<BoardSummary[]>([]);

  useEffect(() => {
    getBoardSummaries().then((summaries) => {
      setBoardSummaries(summaries);
    });
  }, []);

  return { boardSummaries };
};

export default useBoardSummaries;
