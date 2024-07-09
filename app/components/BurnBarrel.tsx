import { motion } from "framer-motion";
import React, { LegacyRef, useState } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { PANELS } from "../constatnts/panels";
import { useDeleteContext, DELETE_TYPE } from "../contexts/deleteProvider";
import { usePanel } from "../contexts/PanelProvider";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

interface BurnBarrelPorps {
  width?: number;
  height?: number;
}

const BurnBarrel = ({ width, height }: BurnBarrelPorps) => {
  const { openPanel } = usePanel();
  const { updateAction } = useDeleteContext();
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.3,
  });
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    openPanel(PANELS.CONFIRM_PANEL);
    const type = e.dataTransfer.getData("type");
    if (type == "task") {
      const boardId = e.dataTransfer.getData("boardId");
      const columnId = e.dataTransfer.getData("columnId");
      const taskId = e.dataTransfer.getData("taskId");
      updateAction({ boardId, columnId, taskId, type: DELETE_TYPE.TASK });
    } else if (type == "column") {
      const boardId = e.dataTransfer.getData("boardId");
      const columnId = e.dataTransfer.getData("columnId");
      updateAction({ boardId, columnId, type: DELETE_TYPE.COLUMN });
    } else if (type == "board") {
      const boardId = e.dataTransfer.getData("boardId");
      updateAction({ boardId, type: DELETE_TYPE.BOARD });
    }

    setActive(false);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    {
      setActive(false);
    }
  };

  return (
    <motion.div
      ref={ref as LegacyRef<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      layout
      className={`grid shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red bg-red/50 text-white dark:text-red-hover"
          : "bg-main-purple/50 text-white border-main-purple dark:bg-transparent  dark:text-medium-grey dark:border-medium-grey"
      }`}
      style={{
        width: width ?? 220,
        height: height ?? 220,
      }}
    >
      {active ? (
        <FaFire className="animate-bounce pointer-events-none"></FaFire>
      ) : (
        <FiTrash></FiTrash>
      )}
    </motion.div>
  );
};

export default BurnBarrel;
