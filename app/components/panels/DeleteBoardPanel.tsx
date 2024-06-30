import { PANELS } from "@/app/constatnts/panels";
import React from "react";
import { Button } from "../Button";
import Panel from "../Panel";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import { usePanel } from "@/app/contexts/PanelProvider";
import { deleteBoard } from "@/app/services/taskService";

const DeleteBoardPanel = () => {
  const { closePanel } = usePanel();
  const { currentBoard, currentBoardId } = useCurrentBoard();

  const handleDelete = () => {
    deleteBoard(currentBoardId || "");
    closePanel(PANELS.DELETE_BOARD_PANEL);
  };

  const handleCancel = () => {
    closePanel(PANELS.DELETE_BOARD_PANEL);
  };

  return (
    <Panel name={PANELS.DELETE_BOARD_PANEL}>
      <div className="bg-white dark:bg-dark-grey rounded-md flex flex-col gap-6">
        <h2 className="heading-l text-red">Delete this board?</h2>
        <p className="text-medium-grey body-l">
          Are you sure you want to delete the ‘{currentBoard?.title}’ board?
          This action will remove all columns and tasks and cannot be reversed.
        </p>
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="grow"
          >
            Delete
          </Button>
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="sm"
            className="grow"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Panel>
  );
};

export default DeleteBoardPanel;
