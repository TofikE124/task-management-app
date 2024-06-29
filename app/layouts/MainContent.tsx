import React, { PropsWithChildren } from "react";
import { useSidebarProvider } from "../hooks/useSidebarProvider";
import { motion } from "framer-motion";

const MainContent = ({ children }: PropsWithChildren) => {
  const { isVisible } = useSidebarProvider();

  return (
    <div
      className={`flex flex-col w-full col-end-3 transition-[width] duration-500  ${
        isVisible ? "max-w-[calc(100vw-300px)]" : "w-screen"
      }`}
    >
      {children}
    </div>
  );
};

export default MainContent;
