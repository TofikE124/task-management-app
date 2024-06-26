import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";

import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import { useTaskData } from "@/app/hooks/useTaskData";
import { taskSchema } from "@/app/schemas/taskSchema";
import {
  createTask,
  editTask,
  findColumn,
  fromColIdToOption,
  fromColToOption,
  getStatusArr,
} from "@/app/services/taskService";

import { Button } from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import ListEditor from "../listEditor/ListEditor";
import Panel from "../Panel";
import TextField from "../TextField";

import { Subtask, TaskType } from "@/app/types/taskTypes";

const getIsSubtaskChecked = (subtasks: Subtask[], subtaskId: string) => {
  return subtasks.find((sub) => sub.id == subtaskId)?.checked || false;
};

type TaskSchemaType = z.infer<typeof taskSchema>;

const TaskFormPanel = () => {
  const { currentBoard, currentBoardId } = useCurrentBoard();
  const { taskData, updateTaskData } = useTaskData();
  const { closePanel } = usePanel();
  const { activeTask, activeColumn } = taskData || {};
  const [isEditing, setIsEditing] = useState(false);
  const { isPanelOpen } = usePanel();

  // Form setup
  const methods = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: { list: [], title: "", description: "", status: "" },
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = methods;

  // Status options
  const statusArr = getStatusArr(currentBoard);

  const getDefaultOption = () => {
    if (activeTask) {
      return fromColToOption(
        findColumn(currentBoard?.columns!, activeTask.columnId)!
      );
    }
    if (activeColumn) return fromColToOption(activeColumn);
    return statusArr[0];
  };

  useEffect(() => {
    setIsEditing(Boolean(activeTask));
    setValue(
      "list",
      activeTask?.subtasks.map((subtask) => ({
        id: subtask.id,
        value: subtask.title,
      })) || []
    );
    setValue("title", activeTask?.title || "");
    setValue("description", activeTask?.description || "");
    setValue("status", getDefaultOption()?.value || "");
  }, [activeTask, activeColumn, isPanelOpen(PANELS.TASK_FORM_PANEL)]);

  const resetPanel = () => {
    reset();
    if (!isPanelOpen(PANELS.TASK_DETAILS_PANEL)) updateTaskData({});
  };

  useOnPanelClose(PANELS.TASK_FORM_PANEL, resetPanel);

  // Form submit handler
  const onSubmit = (data: TaskSchemaType) => {
    const task: TaskType = {
      id: isEditing ? activeTask?.id! : v4(),
      title: data.title,
      description: data.description,
      columnId: data.status,
      subtasks: data.list.map((item) => ({
        id: v4(),
        title: item.value,
        checked: isEditing
          ? getIsSubtaskChecked(activeTask?.subtasks || [], item.id)
          : false,
      })),
    };

    if (isEditing)
      editTask(currentBoardId!, activeTask?.id!, activeTask?.columnId!, task);
    else createTask(currentBoardId!, task);
    closePanel(PANELS.TASK_FORM_PANEL);
  };

  return (
    <FormProvider {...methods}>
      <Panel name={PANELS.TASK_FORM_PANEL}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <h2 className="heading-l text-black dark:text-white">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h2>
            <TextField
              placeholder="e.g Take coffee break"
              title="Title"
              errorMessage={errors.title?.message}
              {...register("title")}
            />
            <TextField
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              title="Description"
              errorMessage={errors.description?.message}
              textarea
              {...register("description")}
              className="h-[120px]"
            />
            <ListEditor
              title="Subtasks"
              addButtonTitle="+ Add New Subtask"
              itemPlaceholder="e.g Make a coffee"
            />
            <Dropdown
              options={statusArr}
              title="Status"
              onChange={(v) => setValue("status", v.value)}
              defaultOption={fromColIdToOption(
                currentBoard?.columns || [],
                watch("status")
              )}
            />
            {errors.status?.message && (
              <p className="text-red">{errors.status.message}</p>
            )}
            <Button type="submit" variant="primary" size="sm">
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </Panel>
    </FormProvider>
  );
};

export default TaskFormPanel;
