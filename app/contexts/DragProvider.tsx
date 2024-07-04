"use client";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type DragProviderType = {
  draggedItemContainerName: string | null;
  updateDraggedItemContainerName: (name: string) => void;
  isDragging: boolean;
};

export const DragContext = createContext<DragProviderType | null>(null);

const DragProvider = ({ children }: PropsWithChildren) => {
  const [draggedItemContainerName, setDraggedItemContainerName] = useState<
    null | string
  >(null);

  const updateDraggedItemContainerName = (name: string) => {
    setDraggedItemContainerName(name);
  };

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDrop = () => setIsDragging(false);

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragContext.Provider
      value={{
        draggedItemContainerName,
        updateDraggedItemContainerName,
        isDragging,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

export default DragProvider;
