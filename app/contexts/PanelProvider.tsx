"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PanelContextType {
  openPanel: (name: string) => void;
  closePanel: (name: string) => void;
  isPanelOpen: (name: string) => boolean;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  const openPanel = (name: string) => {
    setOpenPanels((prev) => ({ ...prev, [name]: true }));
  };

  const closePanel = (name: string) => {
    setOpenPanels((prev) => ({ ...prev, [name]: false }));
  };

  const isPanelOpen = (name: string) => {
    return openPanels[name];
  };

  return (
    <PanelContext.Provider value={{ openPanel, closePanel, isPanelOpen }}>
      {children}
    </PanelContext.Provider>
  );
};

const usePanel = () => {
  const context = useContext<PanelContextType | undefined>(PanelContext);
  if (!context) {
    throw new Error("usePanel must be used within a PanelProvider");
  }
  return context;
};

export { PanelProvider, usePanel };
