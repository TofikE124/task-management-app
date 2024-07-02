import { useContext } from "react";
import { DragContext } from "../contexts/DragProvider";

export const useDrag = () => {
  const context = useContext(DragContext);
  if (!context) throw new Error("Can't use context outside of Provider");
  return context;
};
