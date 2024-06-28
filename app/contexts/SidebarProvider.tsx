"use client";
import React, { createContext, PropsWithChildren, useState } from "react";

type SidebarProviderType = {
  isVisible: boolean;
  showSidebar: () => void;
  hideSidebar: () => void;
};

export const SidebarContext = createContext<SidebarProviderType | null>(null);

const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState(true);

  const showSidebar = () => {
    setIsVisible(true);
  };

  const hideSidebar = () => {
    setIsVisible(false);
  };

  return (
    <SidebarContext.Provider value={{ isVisible, showSidebar, hideSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
