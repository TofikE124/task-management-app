"use client";
import { createContext, PropsWithChildren, useState } from "react";

type QuickActionSidebarContextType = {
  hideItem: (name: string) => void;
  showItem: (name: string) => void;
  isVisible: (name: string) => boolean;
  isActive: (name: string) => boolean;
  activateItem: (name: string) => void;
  deactivateItem: (name: string) => void;
};

export const QuickActionSidebarContext =
  createContext<QuickActionSidebarContextType | null>(null);

const QuickActionSidebarProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<
    Record<string, { isVisible: boolean; isActive: boolean }>
  >({});

  const defaultObj = { isVisible: false, isActive: false };
  const getItem = (name: string) => items[name] || defaultObj;

  const isVisible = (name: string) => {
    const visible = items[name]?.isVisible;
    return visible;
  };

  const showItem = (name: string) => {
    const item = getItem(name);
    setItems((prev) => ({ ...prev, [name]: { ...item, isVisible: true } }));
  };

  const hideItem = (name: string) => {
    const item = getItem(name);
    setItems((prev) => ({ ...prev, [name]: { ...item, isVisible: false } }));
  };

  const isActive = (name: string) => {
    const active = items[name]?.isActive;
    return active;
  };

  const activateItem = (name: string) => {
    const item = getItem(name);
    setItems((prev) => ({ ...prev, [name]: { ...item, isActive: true } }));
  };

  const deactivateItem = (name: string) => {
    const item = getItem(name);
    setItems((prev) => ({ ...prev, [name]: { ...item, isActive: false } }));
  };

  return (
    <QuickActionSidebarContext.Provider
      value={{
        isVisible,
        hideItem,
        showItem,
        activateItem,
        deactivateItem,
        isActive,
      }}
    >
      {children}
    </QuickActionSidebarContext.Provider>
  );
};

export default QuickActionSidebarProvider;
