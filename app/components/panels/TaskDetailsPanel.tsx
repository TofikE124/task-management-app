import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import { useTaskData } from "@/app/hooks/useTaskData";
import {
  checkSubtask,
  fromColIdToOption,
  fromColToOption,
  getCheckedTasks,
  getTask,
  moveTask,
} from "@/app/services/taskService";
import Checkbox from "../Checkbox";
import Dropdown from "../Dropdown/Dropdown";
import Panel from "../Panel";

import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import { useEffect, useRef, useState } from "react";
import VerticalEllipsisPanel from "../VerticalEllipsesPanel";

const TaskDetailsPanel = () => {
  const { isPanelOpen } = usePanel();
  const { taskData, updateTaskData } = useTaskData();
  const { currentBoard, currentBoardId } = useCurrentBoard();

  const activeTask = taskData?.activeTask;
  if (!activeTask && isPanelOpen(PANELS.TASK_DETAILS_PANEL))
    throw new Error("Task is not found");

  const task = getTask(currentBoardId!, activeTask?.id || "");
  const statusArr = currentBoard?.columns.map(fromColToOption) || [];

  const resetPanel = () => {
    if (!isPanelOpen(PANELS.TASK_FORM_PANEL)) updateTaskData({});
  };

  useOnPanelClose(PANELS.TASK_DETAILS_PANEL, resetPanel);

  return (
    <Panel name={PANELS.TASK_DETAILS_PANEL}>
      <div className="space-y-6">
        <div className="flex items-center gap-6 justify-between">
          <h2 className="heading-l text-black dark:text-white">
            {task?.title}
          </h2>
          <TaskMoreOptions></TaskMoreOptions>
        </div>
        <p className="text-medium-grey body-l">{task?.description}</p>
        <div>
          <p className="text-medium-grey">
            Subtasks ({getCheckedTasks(task?.subtasks || [])} of{" "}
            {task?.subtasks.length})
          </p>
          <div className="flex flex-col gap-2 mt-4 max-h-[150px] overflow-y-scroll scrollbar-rounded select-none">
            {task?.subtasks.map((sub) => (
              <Checkbox
                label={sub.title}
                value={sub.id}
                checked={sub.checked}
                key={sub.id}
                onChange={(v) => {
                  checkSubtask(
                    currentBoardId!,
                    task?.columnId,
                    task?.id,
                    sub.id,
                    v
                  );
                }}
              ></Checkbox>
            ))}
          </div>
        </div>
        <Dropdown
          options={statusArr}
          defaultOption={fromColIdToOption(
            currentBoard?.columns || [],
            task?.columnId || ""
          )}
          title="Current Status"
          onChange={(option) => {
            moveTask(
              currentBoardId!,
              task?.columnId || "",
              option.value,
              task?.id || "",
              "-1"
            );
          }}
        />
      </div>
    </Panel>
  );
};

const TaskMoreOptions = () => {
  const { openPanel } = usePanel();

  const handleEdit = () => {
    openPanel(PANELS.TASK_FORM_PANEL);
  };

  const handleDelete = () => {
    openPanel(PANELS.DELETE_TASK_PANEL);
  };

  return (
    <VerticalEllipsisPanel
      onFirstOptionClick={handleEdit}
      onSecondOptionClick={handleDelete}
      firstOptionText="Edit Task"
      secondOptionText="Delete Task"
    ></VerticalEllipsisPanel>
  );
};

export default TaskDetailsPanel;
