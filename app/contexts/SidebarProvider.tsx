"use client";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type SidebarProviderType = {
  isVisible: boolean | null;
  showSidebar: () => void;
  hideSidebar: () => void;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarProviderType | null>(null);

const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  const showSidebar = () => {
    setIsVisible(true);
  };

  const hideSidebar = () => {
    setIsVisible(false);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const SIDEBAR_KEY = "isSidebarVisible";

  useEffect(() => {
    const isSidebarVisible = JSON.parse(
      localStorage.getItem(SIDEBAR_KEY) ||
        (window.innerWidth > 768 ? "true" : "false")
    );
    setIsVisible(isSidebarVisible);
  }, []);

  useEffect(() => {
    if (isVisible == null) return;
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(isVisible));
  }, [isVisible]);

  return (
    <SidebarContext.Provider
      value={{ isVisible, showSidebar, hideSidebar, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
