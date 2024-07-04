import { PANELS } from "@/app/constatnts/panels";
import { QuickActionItems } from "@/app/constatnts/QuickActionItems";
import { usePanel } from "@/app/contexts/PanelProvider";
import React from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import QuickActionItem from "../QuickActionItem";
import { DELETE_TYPE, useDeleteContext } from "@/app/contexts/deleteProvider";

const BurnBarrelQuickAction = () => {
  const { updateAction } = useDeleteContext();
  const { openPanel } = usePanel();

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
  };

  return (
    <QuickActionItem
      name={QuickActionItems.BURN_BARREL}
      activeClass="border-red bg-red/50"
      idleClass="bg-main-purple"
      activeItem={
        <FaFire className="animate-bounce text-[30px] pointer-events-none text-white dark:text-red-hover"></FaFire>
      }
      idleItem={<FiTrash className="text-white"></FiTrash>}
      onDrop={handleDrop}
    ></QuickActionItem>
  );
};

export default BurnBarrelQuickAction;
