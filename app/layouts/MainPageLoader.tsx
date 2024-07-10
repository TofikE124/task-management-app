"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import LogoLoading from "../components/LogoLoading";
import useMountStatus from "../hooks/useMountStatus";
import { motion } from "framer-motion";

const MainPageLoader = ({ children }: PropsWithChildren) => {
  const [timeHasPassed, setTimeHasPassed] = useState(false);
  const mounted = useMountStatus();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setTimeHasPassed(true);
    }, 3000);

    return () => clearTimeout(timeOutId);
  }, []);

  return (
    <>
      {mounted && timeHasPassed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      ) : (
        <LogoLoading></LogoLoading>
      )}
    </>
  );
};

export default MainPageLoader;
