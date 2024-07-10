import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useRef } from "react";
import DropIndicator from "./DropIndicator";
import { useDrag } from "@/app/hooks/useDrag";

interface DraggableItemProps {
  containerName: string;
  containerId: string;
  beforeId: string;
  onDragStart?: (e: any) => void;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}
const DraggableItem = ({
  containerName,
  beforeId,
  containerId,
  onDragStart = () => {},
  onClick = () => {},
  children,
}: DraggableItemProps) => {
  const { updateDraggedItemContainerName } = useDrag();

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    if (!e.dataTransfer) return;
    updateDraggedItemContainerName(containerName);
    e.dataTransfer.setData(`containerName`, containerName);
    e.dataTransfer.effectAllowed = "move";
    onDragStart(e);
  };

  return (
    <div>
      <DropIndicator
        beforeId={beforeId}
        containerName={containerName}
        containerId={containerId}
      ></DropIndicator>
      <motion.div
        onClick={onClick}
        layout
        layoutId={beforeId}
        draggable="true"
        dragPropagation={false}
        className="cursor-grab h-full active:cursor-grabbing focus:cursor-grabbing select-none"
        onDragStart={handleDragStart}
        data-container-name={containerName}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DraggableItem;
