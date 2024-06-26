import React from "react";
import { usePanel } from "../contexts/PanelProvider";
interface PanelProps {
  name: string;
  children: React.ReactNode;
}

const Panel = ({ children, name }: PanelProps) => {
  const { isPanelOpen, closePanel } = usePanel();

  return (
    <div
      className={`fixed z-30 inset-0 grid place-items-center transition-all duration-300 ${
        isPanelOpen(name) ? "visible" : "invisible"
      }`}
    >
      <div
        className={`relative z-30 bg-white dark:bg-dark-grey p-8 rounded-md min-w-[480px] transition-transform duration-300 ${
          isPanelOpen(name) ? "scale-100" : "scale-0"
        }`}
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
