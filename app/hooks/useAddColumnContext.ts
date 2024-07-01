import { useContext } from "react";
import { AddColumnContext } from "../contexts/AddColumnProvider";

export const useAddColumnContext = () => {
  const context = useContext(AddColumnContext);
  if (!context) throw new Error("Context can only be used inside of provider");
  return context;
};
