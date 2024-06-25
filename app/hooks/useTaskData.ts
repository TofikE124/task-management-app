import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBoardSummaries, getCurrentBoardId } from "../services/taskService";

const useTaskData = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {}, [searchParams]);
};

export default useTaskData;
