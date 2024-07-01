import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import React, {
  forwardRef,
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { v4 } from "uuid";
import { z } from "zod";
import { PANELS } from "../constatnts/panels";
import { QuickActionItems } from "../constatnts/QuickActionItems";
import { usePanel } from "../contexts/PanelProvider";
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
  reorderColumns,
} from "../services/taskService";
import { ColumnType, TaskType } from "../types/taskTypes";
import { Button, MotionButton } from "./Button";
import TextField from "./TextField";
import { useAddColumnContext } from "../hooks/useAddColumnContext";
import { setEnvironmentData } from "worker_threads";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleDragOverOver = (e: MouseEvent) => {
    e.preventDefault();

    // Get the width of the viewport
    const viewportWidth = window.innerWidth;

    // Get the current position of the cursor relative to the viewport
    const cursorX = e.clientX;
    setCurrentX(cursorX);

    const target = e.target as HTMLDivElement;

    // target.style.transform = `translateX(${cursorX - e.offsetX}px)`;

    // Define the edge threshold (e.g., 100 pixels from the right edge)
    const rightEdgeThreshold = viewportWidth - 20;
    const leftEdgeThreshold = containerRef.current?.offsetLeft || 0;

    // Check if the cursor is near the right edge
    if (cursorX >= rightEdgeThreshold) {
      containerRef.current?.scrollBy({ left: 20 });
    } else if (cursorX <= leftEdgeThreshold + 40) {
      containerRef.current?.scrollBy({ left: -20 });
    }
  };

  return (
    <Reorder.Group
      ref={containerRef}
      className="h-full w-full overflow-x-scroll overflow-y-hidden flex gap-6 pl-6 pt-6 pb-12 pr-[50px]"
      values={columns}
      onReorder={(newColumns) => {
        reorderColumns(currentBoardId || "", newColumns);
      }}
      axis="x"
    >
      {columns.map((column) => (
        <Reorder.Item
          draggable
          value={column}
          key={column.id}
          onDrag={handleDragOverOver}
          onDragStart={(e: MouseEvent) => setStartX(e.clientX)}
          onDragEnd={() => {
            setStartX(0);
            setCurrentX(0);
          }}
        >
          <Column column={column}></Column>
        </Reorder.Item>
      ))}
      <AddColumn />
      <BurnBarrel></BurnBarrel>
    </Reorder.Group>
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
  const [active, setActive] = useState(false);
  const { currentBoardId } = useCurrentBoard();

  const dragControls = useDragControls();

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
    <AnimatePresence>
      <motion.div className="min-w-[280px] h-full flex flex-col cursor-grab focus:active:cursor-grabbing">
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
          className={`my-6 transition-colors h-full ${
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
      </motion.div>
    </AnimatePresence>
  );
};

interface TaskProps {
  task: TaskType;
  columnId: string;
  handleDragStart: (e: any, task: TaskType) => void;
}
const Task = ({ task, columnId, handleDragStart }: TaskProps) => {
  const { openPanel } = usePanel();
  const { updateTaskData } = useTaskData();

  const handleClick = () => {
    updateTaskData({ activeTask: task });
    openPanel(PANELS.TASK_DETAILS_PANEL);
  };

  return (
    <>
      <DropIndicator beforeId={task.id} columnId={columnId}></DropIndicator>
      <motion.div
        onClick={handleClick}
        layout
        layoutId={task.id}
        draggable="true"
        className="py-6 px-4 rounded-lg space-y-2 bg-white dark:bg-dark-grey cursor-grab active:cursor-grabbing focus:cursor-grabbing select-none"
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <h3 className="heading-m text-black dark:text-white">{task.title}</h3>
        <p className="text-medium-grey">
          {getCheckedTasks(task.subtasks)} of {task.subtasks.length} subtasks
        </p>
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
