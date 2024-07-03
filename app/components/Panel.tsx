import React, { ReactNode, useEffect, useState } from "react";
import { usePanel } from "../contexts/PanelProvider";
import { twMerge } from "tailwind-merge";
interface PanelProps {
  name: string;
  children?: ReactNode;
  className?: string;
}

const Panel = ({ children, name, className }: PanelProps) => {
  const { isPanelOpen, closePanel } = usePanel();

  return (
    <div
      className={`fixed z-30 inset-0 grid place-items-center transition-all duration-300 ${
        isPanelOpen(name) ? "visible" : "invisible"
      }`}
    >
      <div
        className={twMerge(
          `relative z-30 bg-white dark:bg-dark-grey p-8 w-[480px] rounded-md max-w-[480px] transition-transform duration-300 ${
            isPanelOpen(name) ? "scale-100" : "scale-0"
          }`,
          className
        )}
      >
        {children}
      </div>
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-all duration-200 ${
          isPanelOpen(name) ? "opacity-100 visible " : "opacity-0 invisible"
        }`}
        onClick={() => closePanel(name)}
      ></div>
    </div>
  );
};

export default Panel;
