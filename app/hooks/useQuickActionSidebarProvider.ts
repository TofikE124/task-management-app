import { useContext } from "react";
import { QuickActionSidebarContext } from "../contexts/QuickActionSidebarProvider";

export const useQuickActionSidebarProvider = () => {
  const context = useContext(QuickActionSidebarContext);
  if (!context) throw new Error("Context can only be used inside of provider");
  return context;
};
