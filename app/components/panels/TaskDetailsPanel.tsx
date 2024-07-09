import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import { useTaskData } from "@/app/hooks/useTaskData";
import Checkbox from "../Checkbox";
import Dropdown from "../Dropdown/Dropdown";
import Panel from "../Panel";

import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import VerticalEllipsisPanel from "../VerticalEllipsesPanel";
import { useEffect } from "react";
import {
  fromColIdToOption,
  fromColToOption,
  getCheckedTasks,
} from "@/app/services/utilities";
import appDataService from "@/app/services/appDataService";

const TaskDetailsPanel = () => {
  const { isPanelOpen } = usePanel();
  const { taskData, updateTaskData } = useTaskData();
  const { currentBoard, currentBoardId } = useCurrentBoard();

  const activeTask = taskData?.activeTask;

  const resetPanel = () => {
    if (!isPanelOpen(PANELS.TASK_FORM_PANEL)) updateTaskData({});
  };
  useOnPanelClose(PANELS.TASK_DETAILS_PANEL, resetPanel);

  if (!activeTask && isPanelOpen(PANELS.TASK_DETAILS_PANEL))
    throw new Error("Task is not found");

  if (!activeTask) return;

  // Important
  const statusArr = currentBoard?.columns.map(fromColToOption) || [];

  return (
    <Panel name={PANELS.TASK_DETAILS_PANEL} className="w-[480px]">
      <div className="space-y-6">
        <div className="flex items-center gap-6 justify-between">
          <h2 className="heading-l text-black dark:text-white">
            {activeTask?.title}
          </h2>
          <TaskMoreOptions></TaskMoreOptions>
        </div>
        <p className="text-medium-grey body-l">{activeTask?.description}</p>
        <div>
          <p className="text-medium-grey">
            Subtasks ({getCheckedTasks(activeTask?.subtasks || [])} of{" "}
            {activeTask?.subtasks.length})
          </p>
          <div className="flex flex-col gap-2 mt-4 max-h-[150px] overflow-y-scroll scrollbar-rounded select-none">
            {activeTask?.subtasks.map((sub) => (
              <Checkbox
                label={sub.title}
                value={sub.id}
                checked={sub.checked}
                key={sub.id}
                onChange={(v) => {
                  appDataService.checkSubtask(
                    currentBoardId!,
                    activeTask?.columnId,
                    activeTask?.id,
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
            activeTask?.columnId || ""
          )}
          title="Current Status"
          onChange={(option) => {
            appDataService.moveTask(
              currentBoardId!,
              activeTask?.columnId || "",
              option.value,
              activeTask?.id || "",
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
      className="sm:translate-x-[calc(-100%+10px)] sm:origin-top-right sm:mt-1"
    ></VerticalEllipsisPanel>
  );
};

export default TaskDetailsPanel;
