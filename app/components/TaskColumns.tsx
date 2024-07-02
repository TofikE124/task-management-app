import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { v4 } from "uuid";
import { z } from "zod";
import { PANELS } from "../constatnts/panels";
import { QuickActionItems } from "../constatnts/QuickActionItems";
import { usePanel } from "../contexts/PanelProvider";
import { useAddColumnContext } from "../hooks/useAddColumnContext";
import useCurrentBoard from "../hooks/useCurrentBoard";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useQuickActionSidebarProvider } from "../hooks/useQuickActionSidebarProvider";
import { useTaskData } from "../hooks/useTaskData";
import { columnSchema } from "../schemas/columnSchema";
import {
  addColumn,
  checkIfColumnExists,
  getCheckedTasks,
  moveTask,
  swapColumns,
} from "../services/taskService";
import { ColumnType, TaskType } from "../types/taskTypes";
import { Button, MotionButton } from "./Button";
import DraggableItem from "./draggableList/DraggableItem";
import DraggableList from "./draggableList/DraggableList";
import DropIndicator from "./draggableList/DropIndicator";
import TextField from "./TextField";
import useEdgeScroll from "../hooks/useEdgeScroll";

const TaskColumns = () => {
  const { currentBoard } = useCurrentBoard();

  if (!currentBoard) {
    return <AppEmpty></AppEmpty>;
  }
  if (!currentBoard.columns.length) return <BoardEmpty />;

  return <Columns columns={currentBoard.columns}></Columns>;
};

interface ColumnProps {
  column: ColumnType;
}

const Columns = ({ columns }: { columns: ColumnType[] }) => {
  const { currentBoardId } = useCurrentBoard();
  const handleDragStart = (e: React.DragEvent, column: ColumnType) => {
    e.dataTransfer.setData("columnId", column.id);
  };
  const handleDrop = (e: React.DragEvent, beforeId: string) => {
    const columnId = e.dataTransfer.getData("columnId");
    if (!columnId) return;
    swapColumns(currentBoardId || "", columnId, beforeId);
  };

  const containerRef = useEdgeScroll();

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-x-scroll overflow-y-hidden flex gap-6 pl-6 pt-6 pb-12 pr-[50px]"
    >
      <DraggableList
        containerName="app"
        containerId="app"
        gap="16px"
        activeClass={false}
        onDrop={(e: React.DragEvent, before) => {
          handleDrop(e, before);
        }}
      >
        {columns.map((column) => (
          <DraggableItem
            containerName="app"
            containerId="app"
            beforeId={column.id}
            key={column.id}
            handleDragStart={(e: React.DragEvent) => {
              handleDragStart(e, column);
            }}
          >
            <Column column={column} key={column.id}></Column>
          </DraggableItem>
        ))}
      </DraggableList>

      <AddColumn />
      <BurnBarrel></BurnBarrel>
    </div>
  );
};

const AddColumn = () => {
  const { hideItem, showItem } = useQuickActionSidebarProvider();
  const { isVisible, hide, show } = useAddColumnContext();

  const { ref, isVisible: isOnScreen } = useIntersectionObserver({
    threshold: 0.3,
  });

  useEffect(() => {
    if (!isVisible || !ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", inline: "end" });
  }, [isVisible]);

  useEffect(() => {
    !isOnScreen
      ? hideItem(QuickActionItems.COLUMN_ADD)
      : showItem(QuickActionItems.COLUMN_ADD);
  }, [isOnScreen]);

  return (
    <div
      ref={ref}
      className={`relative min-w-[280px] ${isVisible ? "-order-1" : ""}`}
    >
      <AnimatePresence>
        {isVisible ? (
          <ColumnForm
            onAdd={hide}
            onCancel={hide}
            disableAnimation
          ></ColumnForm>
        ) : (
          <MotionButton
            variant="primary"
            size="sm"
            onClick={show}
            className="h-fit w-full"
            layout
          >
            + Add Column
          </MotionButton>
        )}
      </AnimatePresence>
    </div>
  );
};

const Column = ({ column }: ColumnProps) => {
  const { currentBoardId } = useCurrentBoard();

  const handleDragStart = (e: React.DragEvent, task: TaskType) => {
    e.stopPropagation();
    e.dataTransfer.setData("boardId", currentBoardId || "");
    e.dataTransfer.setData("columnId", column.id);
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (e: React.DragEvent, before: string) => {
    const boardId = e.dataTransfer.getData("boardId");
    const columnId = e.dataTransfer.getData("columnId");
    const taskId = e.dataTransfer.getData("taskId");

    moveTask(boardId, columnId, column.id, taskId, before);
  };

  return (
    <AnimatePresence>
      <motion.div className="select-none min-w-[280px] z-50 h-full flex flex-col cursor-grab focus:active:cursor-grabbing">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: column.color }}
          ></div>
          <h4 className="heading-s text-medium-grey text-nowrap">
            {column.title}
          </h4>
        </div>
        <DraggableList
          containerName="column"
          containerId={column.id}
          onDrop={handleDrop}
          axis="y"
        >
          {column.tasks.map((task) => (
            <DraggableItem
              containerName="column"
              handleDragStart={(e) => handleDragStart(e, task)}
              key={task.id}
              beforeId={task.id}
              containerId={column.id}
            >
              <Task task={task}></Task>
            </DraggableItem>
          ))}
          <DropIndicator
            containerName="column"
            beforeId="-1"
            containerId={column.id}
          ></DropIndicator>
          <AddTask column={column}></AddTask>
        </DraggableList>
      </motion.div>
    </AnimatePresence>
  );
};

interface TaskProps {
  task: TaskType;
}
const Task = ({ task }: TaskProps) => {
  const { openPanel } = usePanel();
  const { updateTaskData } = useTaskData();

  const handleClick = () => {
    updateTaskData({ activeTask: task });
    openPanel(PANELS.TASK_DETAILS_PANEL);
  };

  return (
    <>
      <motion.div
        onClick={handleClick}
        className="py-6 px-4 rounded-lg space-y-2 bg-white dark:bg-dark-grey pointer-events-none"
      >
        <h3 className="heading-m text-black dark:text-white">{task.title}</h3>
        <p className="text-medium-grey">
          {getCheckedTasks(task.subtasks)} of {task.subtasks.length} subtasks
        </p>
      </motion.div>
    </>
  );
};

const BurnBarrel = () => {
  const { showItem, hideItem } = useQuickActionSidebarProvider();
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.3,
  });
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    setActive(false);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    {
      setActive(false);
    }
  };

  useEffect(() => {
    isVisible
      ? showItem(QuickActionItems.BURN_BARREL)
      : hideItem(QuickActionItems.BURN_BARREL);
  }, [isVisible]);

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`grid size-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red bg-red/50 text-white dark:text-red-hover"
          : "bg-main-purple/50 text-white border-main-purple dark:bg-transparent  dark:text-medium-grey dark:border-medium-grey"
      }`}
    >
      {active ? (
        <FaFire className="animate-bounce pointer-events-none"></FaFire>
      ) : (
        <FiTrash></FiTrash>
      )}
    </div>
  );
};

interface BurnBarrelSmallProps {
  isVisible: boolean;
  active: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

interface AddTaskProps {
  column: ColumnType;
}

const AddTask = ({ column }: AddTaskProps) => {
  const { openPanel } = usePanel();
  const { updateTaskData } = useTaskData();

  const handleClick = () => {
    updateTaskData({ activeColumn: column });
    openPanel(PANELS.TASK_FORM_PANEL);
  };

  return (
    <MotionButton
      layout
      variant="primary"
      size="sm"
      className="w-full"
      onClick={handleClick}
    >
      + Add Task
    </MotionButton>
  );
};

const AppEmpty = () => {
  const { openPanel } = usePanel();

  return (
    <div className="w-full h-full grid place-items-center text-center">
      <div>
        <h3 className="heading-l text-medium-grey">
          You don't have any boards yet. Create a new board to get started
        </h3>
        <Button
          variant="primary"
          size="lg"
          className="mt-8"
          onClick={() => {
            openPanel(PANELS.BOARD_FORM_PANEL);
          }}
        >
          + Create New Board
        </Button>
      </div>
    </div>
  );
};
const BoardEmpty = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="h-full w-full relative ml-6 mt-6">
      <AnimatePresence>
        {isFormVisible ? (
          <ColumnForm
            key="form"
            onCancel={() => setIsFormVisible(false)}
            onAdd={() => setIsFormVisible(false)}
          />
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            exit={{ scale: 0 }}
            key="board-empty"
            className="w-full h-full grid place-items-center text-center"
          >
            <div>
              <h3 className="heading-l text-medium-grey">
                This board is empty. Create a new column to get started.
              </h3>
              <Button
                variant="primary"
                size="lg"
                className="mt-8"
                onClick={() => setIsFormVisible(true)}
              >
                + Add New Column
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type columnSchemaType = z.infer<typeof columnSchema>;

interface ColumnFormProps {
  onCancel: () => void;
  onAdd: () => void;
  disableAnimation?: boolean;
}

const ColumnForm = ({
  onCancel,
  onAdd,
  disableAnimation = false,
}: ColumnFormProps) => {
  const { currentBoardId } = useCurrentBoard();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<columnSchemaType>({
    resolver: zodResolver(columnSchema),
  });

  const onSubmit = (data: columnSchemaType) => {
    if (!currentBoardId) return;
    checkIfColumnExists(currentBoardId, data.title).then((exists) => {
      if (exists) {
        setError("title", {
          message: `A column witht the title '${data.title} already exists'`,
        });
      } else {
        const newColumn: ColumnType = {
          id: v4(),
          title: data.title,
          color: "#fff",
          tasks: [],
        };
        addColumn(currentBoardId, newColumn);
        onAdd();
      }
    });
  };

  return (
    <motion.div
      key="column-form"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: disableAnimation ? 0 : 0.25 }}
      exit={{ scale: 0 }}
      layout
      className="absolute top-0 left-0 h-full min-w-[280px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="  flex flex-col w-full bg-white dark:bg-dark-grey h-fit p-3 rounded-lg space-y-4"
      >
        <TextField
          placeholder="e.g Todo"
          title="Column Name"
          {...register("title")}
          errorMessage={errors.title?.message}
        ></TextField>
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            size="sm"
            className="grow w-full"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="grow w-full">
            Add Column
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
export default TaskColumns;
