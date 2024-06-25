"use client";
import { useEffect, useState } from "react";

// Custom hook to manage component loading state and theme
const useMountStatus = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set mounted to true when component mounts
  }, []);

  return mounted;
};

export default useMountStatus;
