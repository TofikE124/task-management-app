import React, { DragEventHandler, useState } from "react";
import useCurrentBoard from "../hooks/useCurrentBoard";
import { ColumnType, TaskType } from "../types/taskTypes";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { deleteTask, moveTask } from "../services/taskService";
import { motion } from "framer-motion";
import { Button, MotionButton } from "./Button";

const TaskColumns = () => {
  const { currentBoard } = useCurrentBoard();
  if (!currentBoard?.columns.length)
    return (
      <div className="w-full h-full grid place-items-center text-center">
        <div>
          <h3 className="heading-l text-medium-grey">
            This board is empty. Create a new column to get started.
          </h3>
          <Button variant="primary" size="lg" className="mt-8">
            + Add New Column
          </Button>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full overflow-x-scroll flex gap-6 pl-6 pt-6 pb-12 pr-[50px]">
      {currentBoard.columns.map((column) => (
        <Column column={column} key={column.id}></Column>
      ))}
      <BurnBarrel></BurnBarrel>
    </div>
  );
};

interface ColumnProps {
  column: ColumnType;
}

const Column = ({ column }: ColumnProps) => {
  const [active, setActive] = useState(false);
  const { currentBoardId } = useCurrentBoard();

  const handleDragStart = (e: React.DragEvent, task: TaskType) => {
    e.dataTransfer.setData("boardId", currentBoardId || "");
    e.dataTransfer.setData("columnId", column.id);
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    clearHighlights();
    setActive(false);

    const boardId = e.dataTransfer.getData("boardId");
    const columnId = e.dataTransfer.getData("columnId");
    const taskId = e.dataTransfer.getData("taskId");

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    moveTask(boardId, columnId, column.id, taskId, before);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    hightlightIndicator(e);
    setActive(true);
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
      document.querySelectorAll(`[data-column-id="${column.id}"]`)
    );
  };

  const getNearestIndicator = (e: React.DragEvent, indicators: Element[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

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
  };

  return (
    <div className="min-w-[280px] flex flex-col">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: column.color }}
        ></div>
        <h4 className="heading-s text-medium-grey text-nowrap">
          {column.title}
        </h4>
      </div>
      <div
        className={`my-6 transition-colors ${
          active
            ? "bg-medium-grey/10 shadow-medium-grey/15 dark:bg-slate-grey/15 shadow-[0px_4px_10px] dark:shadow-slate-grey/20"
            : "bg-neutral-800/0"
        } grow `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.tasks.map((task) => (
          <Task
            handleDragStart={handleDragStart}
            task={task}
            key={task.id}
            columnId={column.id}
          ></Task>
        ))}
        <DropIndicator beforeId="-1" columnId={column.id}></DropIndicator>
        <AddTask column={column}></AddTask>
      </div>
    </div>
  );
};

interface TaskProps {
  task: TaskType;
  columnId: string;
  handleDragStart: (e: any, task: TaskType) => void;
}
const Task = ({ task, columnId, handleDragStart }: TaskProps) => {
  return (
    <>
      <DropIndicator beforeId={task.id} columnId={columnId}></DropIndicator>
      <motion.div
        layout
        layoutId={task.id}
        draggable="true"
        className="py-6 px-4 rounded-lg space-y-2 bg-white dark:bg-dark-grey cursor-grab active:cursor-grabbing focus:cursor-grabbing select-none"
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <h3 className="heading-m text-black dark:text-white">{task.title}</h3>
        <p className="text-medium-grey">0 of {task.subtasks.length} subtasks</p>
      </motion.div>
    </>
  );
};

interface DropIndicatorProps {
  beforeId: string;
  columnId: string;
}
const DropIndicator = ({ beforeId, columnId }: DropIndicatorProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      data-before={beforeId}
      data-column-id={columnId}
      className="my-0.5 h-0.5 w-full bg-main-purple opacity-0"
    ></div>
  );
};

const BurnBarrel = () => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    setActive(false);

    const boardId = e.dataTransfer.getData("boardId");
    const columnId = e.dataTransfer.getData("columnId");
    const taskId = e.dataTransfer.getData("taskId");
    deleteTask(boardId, columnId, taskId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    {
      setActive(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid size-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red bg-red/50 text-white dark:text-red-hover"
          : "bg-main-purple/50 text-white border-main-purple dark:bg-transparent  dark:text-medium-grey dark:border-medium-grey"
      }`}
    >
      {active ? (
        <FaFire className="animate-bounce"></FaFire>
      ) : (
        <FiTrash></FiTrash>
      )}
    </div>
  );
};

interface AddTaskProps {
  column: ColumnType;
}

const AddTask = ({ column }: AddTaskProps) => {
  return (
    <MotionButton layout variant="primary" size="sm" className="w-full">
      + Add Task
    </MotionButton>
  );
};

export default TaskColumns;
