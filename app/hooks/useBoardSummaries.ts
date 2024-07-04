import { useEffect, useState } from "react";
import { boardSummaries$ } from "../services/appDataService";
import { BoardSummary } from "../types/taskTypes";

const useBoardSummaries = () => {
  const [boardSummaries, setBoardSummaries] = useState<BoardSummary[]>([]);

  useEffect(() => {
    const subscription = boardSummaries$.subscribe((summaries) => {
      setBoardSummaries(summaries);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { boardSummaries };
};

export default useBoardSummaries;
