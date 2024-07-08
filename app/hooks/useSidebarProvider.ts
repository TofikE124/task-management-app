import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarProvider";

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Context can only be used inside of provider");
  return context;
};
