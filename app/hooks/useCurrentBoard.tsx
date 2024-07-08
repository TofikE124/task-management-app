"use client";
import { useContext } from "react";
import { CurrentBoardContext } from "../contexts/CurrentBoardProvider";

const useCurrentBoard = () => {
  const context = useContext(CurrentBoardContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentBoard must be used within a CurrentBoardProvider"
    );
  }
  return context;
};

export default useCurrentBoard;
