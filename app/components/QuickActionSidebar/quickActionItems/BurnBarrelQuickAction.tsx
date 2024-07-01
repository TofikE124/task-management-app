import React from "react";
import QuickActionItem from "../QuickActionItem";
import { QuickActionItems } from "@/app/constatnts/QuickActionItems";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { deleteTask } from "@/app/services/taskService";

const BurnBarrelQuickAction = () => {
  const handleDrop = (e: React.DragEvent) => {
    const boardId = e.dataTransfer.getData("boardId");
    const columnId = e.dataTransfer.getData("columnId");
    const taskId = e.dataTransfer.getData("taskId");
    deleteTask(boardId, columnId, taskId);
  };

  return (
    <QuickActionItem
      name={QuickActionItems.BURN_BARREL}
      activeClass="border-red bg-red/50"
      idleClass="bg-main-purple"
      activeItem={
        <FaFire className="animate-bounce text-[30px] pointer-events-none text-white dark:text-red-hover"></FaFire>
      }
      idleItem={<FiTrash className="text-white "></FiTrash>}
      onDrop={handleDrop}
    ></QuickActionItem>
  );
};

export default BurnBarrelQuickAction;
