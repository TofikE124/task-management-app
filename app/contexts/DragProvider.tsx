"use client";
import React, { createContext, PropsWithChildren, useState } from "react";

type DragProviderType = {
  draggedItemContainerName: string | null;
  updateDraggedItemContainerName: (name: string) => void;
};

export const DragContext = createContext<DragProviderType | null>(null);

const DragProvider = ({ children }: PropsWithChildren) => {
  const [draggedItemContainerName, setDraggedItemContainerName] = useState<
    null | string
  >(null);

  const updateDraggedItemContainerName = (name: string) => {
    setDraggedItemContainerName(name);
  };
  return (
    <DragContext.Provider
      value={{ draggedItemContainerName, updateDraggedItemContainerName }}
    >
      {children}
    </DragContext.Provider>
  );
};

export default DragProvider;
