"use client";
import React, { createContext, PropsWithChildren, useState } from "react";

type AddColumnContextType = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
};

export const AddColumnContext = createContext<AddColumnContextType | null>(
  null
);

const AddColumnProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => {
    setIsVisible(true);
  };
  const hide = () => {
    setIsVisible(false);
  };

  return (
    <AddColumnContext.Provider value={{ isVisible, show, hide }}>
      {children}
    </AddColumnContext.Provider>
  );
};

export default AddColumnProvider;
