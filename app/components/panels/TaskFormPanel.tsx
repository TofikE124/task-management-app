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
import { Button } from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import ListEditor from "../listEditor/ListEditor";
import Panel from "../Panel";
import TextField from "../TextField";

import { Subtask, TaskType } from "@/app/types/taskTypes";
import {
  fromColIdToOption,
  fromColToOption,
  getStatusArr,
} from "@/app/services/utilities";
import appDataService from "@/app/services/appDataService";

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
    defaultValues: { subtasks: [], title: "", description: "", columnId: "" },
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
      return fromColIdToOption(
        currentBoard?.columns || [],
        activeTask.columnId || ""
      );
    }
    if (activeColumn) return fromColToOption(activeColumn);
    return statusArr[0];
  };

  useEffect(() => {
    setIsEditing(Boolean(activeTask));
    setValue(
      "subtasks",
      activeTask?.subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        checked: subtask.checked,
      })) || []
    );
    setValue("title", activeTask?.title || "");
    setValue("description", activeTask?.description || "");
    setValue("columnId", getDefaultOption()?.value || "");
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
      columnId: data.columnId,
      subtasks: data.subtasks.map((item) => ({
        id: v4(),
        title: item.title,
        checked: isEditing
          ? getIsSubtaskChecked(activeTask?.subtasks || [], item.id)
          : false,
      })),
    };

    if (isEditing)
      appDataService.editTask(
        currentBoardId!,
        activeTask?.id!,
        activeTask?.columnId!,
        task
      );
    else appDataService.createTask(currentBoardId!, task);
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
              listName="subtasks"
              fieldName="title"
            />
            <Dropdown
              options={statusArr}
              title="Status"
              onChange={(v) => setValue("columnId", v.value)}
              defaultOption={fromColIdToOption(
                currentBoard?.columns || [],
                watch("columnId")
              )}
            />
            {errors.columnId?.message && (
              <p className="text-red">{errors.columnId.message}</p>
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
