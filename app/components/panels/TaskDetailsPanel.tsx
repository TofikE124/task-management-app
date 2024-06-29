import { PANELS } from "@/app/constatnts/panels";
import Panel from "../Panel";
import { useTaskData } from "@/app/hooks/useTaskData";
import { usePanel } from "@/app/contexts/PanelProvider";
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
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import Image from "next/image";

import VerticalEllipsis from "/public/images/icon-vertical-ellipsis.svg";
import { useEffect, useRef, useState } from "react";
import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";

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
  const [isVisible, setIsVisible] = useState(false);

  const optionsRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    openPanel(PANELS.TASK_FORM_PANEL);
    setIsVisible(false);
  };

  const handleDelete = () => {
    openPanel(PANELS.DELETE_TASK_PANEL);
    setIsVisible(false);
  };

  useOnPanelClose(PANELS.TASK_DETAILS_PANEL, () => setIsVisible(false));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  return (
    <div className="relative" ref={optionsRef}>
      <div
        className="cursor-pointer pl-2 select-none"
        onClick={() => setIsVisible((v) => !v)}
      >
        <Image
          width={4.5}
          height={20}
          alt="Vertical Ellipsis"
          src={VerticalEllipsis}
        />
      </div>
      <div
        className={`absolute  top-[100%] left-0 mt-6 bg-white dark:bg-very-dark-grey p-4 w-[200px] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] rounded-lg transition-all duration-300 origin-top-left ${
          isVisible
            ? "opacity-1 visible scale-100 translate-y-0"
            : "opacity-0 invisible scale-50 -translate-y-1"
        }`}
      >
        <p
          onClick={handleEdit}
          className="body-l text-medium-grey mb-4 text-nowrap hover:underline cursor-pointer"
        >
          Edit Task
        </p>
        <p
          onClick={handleDelete}
          className="body-l text-red text-nowrap hover:underline cursor-pointer"
        >
          Delete Task
        </p>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
