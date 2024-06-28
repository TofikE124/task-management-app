import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useTaskData = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {}, [searchParams]);
};

export default useTaskData;
