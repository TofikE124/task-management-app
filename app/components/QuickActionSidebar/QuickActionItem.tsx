import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import { useQuickActionSidebarProvider } from "../../hooks/useQuickActionSidebarProvider";

interface ActionItemProps {
  name: string;
  activeClass: string;
  idleClass: string;
  activeItem: ReactNode;
  idleItem: ReactNode;
  noDrag?: boolean;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onClick?: () => void;
}
const QuickActionItem = ({
  name,
  activeClass,
  idleClass,
  activeItem,
  idleItem,
  noDrag,
  onDragOver = () => {},
  onDragLeave = () => {},
  onDrop = () => {},
  onClick = () => {},
}: ActionItemProps) => {
  const { isVisible, isActive, activateItem, deactivateItem } =
    useQuickActionSidebarProvider();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (noDrag) e.dataTransfer.dropEffect = "none";
    activateItem(name);

    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    deactivateItem(name);

    onDragLeave(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    deactivateItem(name);

    onDrop(e);
  };

  const handleMouseEnter = () => {
    activateItem(name);
  };

  const handleMouseLeave = () => {
    deactivateItem(name);
  };

  return (
    <AnimatePresence>
      {!isVisible(name) ? (
        <motion.div
          layout
          initial={{ translateX: "100%" }}
          animate={{ translateX: "0" }}
          exit={{ translateX: "100%" }}
          transition={{ duration: 0.25 }}
          className={`rounded-l-2xl  p-4 grid place-content-center cursor-pointer ${
            isActive(name) ? activeClass : idleClass
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
        >
          <AnimatePresence>
            {isActive(name) ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
                className="size-[75px] grid place-content-center pointer-events-none"
              >
                {activeItem}
              </motion.div>
            ) : (
              idleItem
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default QuickActionItem;
