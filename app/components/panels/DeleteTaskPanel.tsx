import React from "react";
import Panel from "../Panel";
import { PANELS } from "@/app/constatnts/panels";
import { useTaskData } from "@/app/hooks/useTaskData";
import { Button } from "../Button";
import { usePanel } from "@/app/contexts/PanelProvider";
import { deleteTask } from "@/app/services/taskService";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";

const DeleteTaskPanel = () => {
  const { currentBoardId } = useCurrentBoard();
  const { taskData } = useTaskData();
  const { closePanel } = usePanel();

  const task = taskData?.activeTask;

  const handleCancel = () => {
    closePanel(PANELS.DELETE_TASK_PANEL);
  };

  const handleDelete = () => {
    if (!task || !currentBoardId) return;
    deleteTask(currentBoardId, task?.columnId, task?.id);
    closePanel(PANELS.DELETE_TASK_PANEL);
    closePanel(PANELS.TASK_DETAILS_PANEL);
  };

  return (
    <Panel name={PANELS.DELETE_TASK_PANEL}>
      <div className="bg-white dark:bg-dark-grey rounded-md flex flex-col gap-6">
        <h2 className="heading-l text-red">Delete this task?</h2>
        <p className="text-medium-grey body-l">
          Are you sure you want to delete the ‘{task?.title}’ task and its
          subtasks? This action cannot be reversed.
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

export default DeleteTaskPanel;
