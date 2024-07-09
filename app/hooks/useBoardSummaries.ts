import { useEffect, useState } from "react";
import { BoardSummary } from "../types/taskTypes";
import appDataService from "../services/appDataService";

const useBoardSummaries = () => {
  const [boardSummaries, setBoardSummaries] = useState<BoardSummary[]>([]);

  useEffect(() => {
    const subscription = appDataService.boardSummaries$.subscribe(
      (summaries) => {
        setBoardSummaries(summaries);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { boardSummaries };
};

export default useBoardSummaries;
