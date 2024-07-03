import { useDrag } from "@/app/hooks/useDrag";
import React, { ReactNode, useState } from "react";

interface DraggableListProps {
  containerId: string;
  children: ReactNode;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, beforeId: string) => void;
  axis?: "x" | "y";
  gap?: string;
  activeClass?: boolean;
  containerName: string;
}

const DraggableList = ({
  containerName,
  containerId,
  onDragLeave = () => {},
  onDragOver = () => {},
  onDrop = () => {},
  children,
  axis = "x",
  gap = "0px",
  activeClass = true,
}: DraggableListProps) => {
  const { draggedItemContainerName } = useDrag();
  const [active, setActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    clearHighlights();
    setActive(false);

    if (draggedItemContainerName != containerName) return;

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";
    onDrop(e, before);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    if (draggedItemContainerName != containerName) return;

    hightlightIndicator(e);
    setActive(true);
    onDragOver(e);
  };

  const hightlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights();
    const el = getNearestIndicator(e, indicators) as any;
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els?: any[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => (i.style.opacity = "0"));
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-${containerName}-id="${containerId}"][data-type="dropIndicator"]`
      )
    );
  };

  const getNearestIndicator = (e: React.DragEvent, indicators: Element[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        let offset;
        if (axis == "x") offset = e.clientX - (box.right + DISTANCE_OFFSET);
        else offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el as any;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    clearHighlights();
    setActive(false);

    onDragLeave(e);
  };

  return (
    <div
      className={`transition-colors h-full ${
        axis == "x" ? "flex" : "flex flex-col"
      } ${
        activeClass
          ? active
            ? "bg-medium-grey/10 shadow-medium-grey/15 dark:bg-slate-grey/15 shadow-[0px_4px_10px] dark:shadow-slate-grey/20"
            : "bg-neutral-800/0"
          : ""
      } `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-id={containerId}
      style={{ gap }}
    >
      {children}
    </div>
  );
};

export default DraggableList;
