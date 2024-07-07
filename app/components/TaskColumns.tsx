import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, color, motion } from "framer-motion";
import React, { LegacyRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { v4 } from "uuid";
import { z } from "zod";
import { PANELS } from "../constatnts/panels";
import { QuickActionItems } from "../constatnts/QuickActionItems";
import { DELETE_TYPE, useDeleteContext } from "../contexts/deleteProvider";
import { usePanel } from "../contexts/PanelProvider";
import { useAddColumnContext } from "../hooks/useAddColumnContext";
import useCurrentBoard from "../hooks/useCurrentBoard";
import useEdgeScroll from "../hooks/useEdgeScroll";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useQuickActionSidebarProvider } from "../hooks/useQuickActionSidebarProvider";
import { useTaskData } from "../hooks/useTaskData";
import { columnSchema } from "../schemas/columnSchema";
import {
  addColumn,
  getCheckedTasks,
  moveColumn,
  moveTask,
} from "../services/appDataService";
import { checkIfColumnExists } from "../services/utilities";
import { ColumnType, TaskType } from "../types/taskTypes";
import { Button, MotionButton } from "./Button";
import DraggableItem from "./draggableList/DraggableItem";
import DraggableList from "./draggableList/DraggableList";
import DropIndicator from "./draggableList/DropIndicator";
import LoadingSkeleton from "./LoadingSkeleton";
import TextField from "./TextField";
import { useLoading } from "../contexts/LoadingProvider";
import { useTheme } from "next-themes";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import useMountStatus from "../hooks/useMountStatus";
import { getRandomColor } from "../utilities/colors";

const TaskColumns = () => {
  const { currentBoard } = useCurrentBoard();
  const { loading } = useLoading();
  if (loading) return <ColumnsLoading></ColumnsLoading>;
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
    e.dataTransfer.setData("type", "column");
    e.dataTransfer.setData("columnId", column.id);
    e.dataTransfer.setData("boardId", currentBoardId || "");
  };
  const handleDrop = (e: React.DragEvent, beforeId: string) => {
    const columnId = e.dataTransfer.getData("columnId");
    if (!columnId) return;
    moveColumn(currentBoardId || "", columnId, beforeId);
  };

  const containerRef = useEdgeScroll({ containerName: ["wrapper", "column"] });

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-x-scroll overflow-y-hidden flex gap-6 pl-6 pt-6 pb-12 pr-[50px]"
    >
      <DraggableList
        containerName="wrapper"
        containerId="wrapper"
        gap="16px"
        activeClass={false}
        onDrop={(e: React.DragEvent, before) => {
          handleDrop(e, before);
        }}
      >
        {columns.map((column) => (
          <DraggableItem
            containerName="wrapper"
            containerId="wrapper"
            beforeId={column.id}
            key={column.id}
            onDragStart={(e: React.DragEvent) => {
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

  // useEffect(() => {
  //   !isOnScreen
  //     ? hideItem(QuickActionItems.COLUMN_ADD)
  //     : showItem(QuickActionItems.COLUMN_ADD);
  // }, [isOnScreen]);

  useEffect(() => {
    if (!isVisible || !ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", inline: "end" });
  }, [isVisible]);

  return (
    <div ref={ref} className="relative min-w-[280px]">
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
    e.dataTransfer.setData("type", "task");
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
              onDragStart={(e) => handleDragStart(e, task)}
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
        className="py-6 px-4 rounded-lg space-y-2 bg-white dark:bg-dark-grey"
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
  const { openPanel } = usePanel();
  const { updateAction } = useDeleteContext();
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
    <motion.div
      ref={ref as LegacyRef<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      layout
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
    </motion.div>
  );
};

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
  const { isVisible, hide, show } = useAddColumnContext();

  return (
    <div className="h-full w-full relative ml-6 mt-6">
      <AnimatePresence>
        {isVisible ? (
          <ColumnForm onAdd={hide} onCancel={hide}></ColumnForm>
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
                onClick={show}
                type="button"
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
  const { currentBoardId, currentBoard } = useCurrentBoard();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<columnSchemaType>({
    resolver: zodResolver(columnSchema),
  });

  useEffect(() => {
    if (!currentBoardId) return;
    setValue("boardId", currentBoardId);
  }, [currentBoardId]);

  const onSubmit = (data: columnSchemaType) => {
    if (!currentBoardId) return;
    if (checkIfColumnExists(currentBoard!, data.title))
      setError("title", {
        message: `A column witht the title '${data.title} already exists'`,
      });
    else {
      const newColumn: ColumnType = {
        id: v4(),
        title: data.title,
        color: getRandomColor(),
        tasks: [],
        boardId: currentBoardId,
      };
      addColumn(currentBoardId, newColumn);
      onAdd();
    }
  };

  return (
    <motion.div
      key="column-form"
      initial={{
        scale: 0,
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
      }}
      animate={{ scale: 1, translate: "0% 0%", top: 0, left: 0 }}
      transition={{ duration: disableAnimation ? 0 : 0.25 }}
      exit={{ scale: 0, top: "50%", left: "50%", translate: "-50% -50%" }}
      className="absolute top-0 left-0 h-[200px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full bg-white dark:bg-dark-grey h-fit p-3 rounded-lg space-y-4"
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

const ColumnsLoading = () => {
  const mounted = useMountStatus();

  return (
    <div
      key={mounted ? 0 : 1}
      className="h-full w-full overflow-x-scroll overflow-y-hidden flex gap-6 pl-6 pt-6 pb-12 pr-[50px]"
    >
      <ColumnLoading count={2}></ColumnLoading>
      <ColumnLoading count={3}></ColumnLoading>
      <ColumnLoading count={1}></ColumnLoading>
      <ColumnLoading count={2}></ColumnLoading>
      <ColumnLoading count={1}></ColumnLoading>
    </div>
  );
};

interface ColumnLoadingProps {
  count?: number;
}

const ColumnLoading = ({ count = 1 }: ColumnLoadingProps) => {
  const arr = new Array(count);
  arr.fill(0);
  return (
    <div className="flex flex-col gap-[2px] w-[280px]">
      <ColumnHeaderLoading></ColumnHeaderLoading>
      <div className="flex flex-col gap-1 relative mt-[2px]">
        {arr.map((x, index) => (
          <TaskLoading key={index}></TaskLoading>
        ))}
      </div>
    </div>
  );
};

const ColumnHeaderLoading = () => {
  const { resolvedTheme } = useTheme();

  return (
    <LoadingSkeleton
      width="100%"
      height="18px"
      baseColor={`${resolvedTheme == "dark" ? "#2B2C37" : "#fff"} `}
      highlightColor={`${resolvedTheme == "dark" ? "#343641" : "#f9f9f9"} `}
      containerClassName="h-[18px]"
      className="cursor-pointer"
    ></LoadingSkeleton>
  );
};

const TaskLoading = () => {
  const colors = resolveConfig(tailwindConfig).theme.colors as any;
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2 py-6 px-4 relative h-[98.75px] w-[280px]">
      <div className="absolute inset-0">
        <LoadingSkeleton
          height="98.75px"
          borderRadius="8px"
          baseColor={`${
            resolvedTheme == "dark" ? colors["dark-grey"] : colors.white
          } `}
          highlightColor={`${
            resolvedTheme == "dark"
              ? colors["dark-grey-highlight"]
              : colors["white-highlight"]
          } `}
          containerClassName="h-[98.75px]"
          className="cursor-pointer"
        ></LoadingSkeleton>
      </div>
      <LoadingSkeleton
        width="100%"
        height="20px"
        borderRadius="8px"
        baseColor={`${
          resolvedTheme == "dark" ? colors["charcoal-grey"] : colors["ghost"]
        } `}
        highlightColor={`${
          resolvedTheme == "dark"
            ? colors["charcoal-grey-highlight"]
            : colors["ghost-highlight"]
        } `}
        containerClassName="h-[20px]"
      ></LoadingSkeleton>
      <LoadingSkeleton
        width="100%"
        height="15px"
        borderRadius="8px"
        baseColor={`${
          resolvedTheme == "dark" ? colors["charcoal-grey"] : colors["ghost"]
        } `}
        highlightColor={`${
          resolvedTheme == "dark"
            ? colors["charcoal-grey-highlight"]
            : colors["ghost-highlight"]
        } `}
        containerClassName="h-[15px]"
      ></LoadingSkeleton>
    </div>
  );
};
