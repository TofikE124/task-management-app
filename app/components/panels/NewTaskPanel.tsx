import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import useCurrentBoard from "@/app/hooks/useCurrentBoard";
import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import { taskSchema } from "@/app/schemas/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import ListEditor from "../listEditor/ListEditor";
import Panel from "../Panel";
import TextField from "../TextField";
import { useTaskData } from "@/app/hooks/useTaskData";
import { useEffect } from "react";
import Panels from "@/app/layouts/Panels";
import { TaskType } from "@/app/types/taskTypes";
import { v4 } from "uuid";
import { createTask } from "@/app/services/taskService";

type taskSchemaType = z.infer<typeof taskSchema>;

const NewTaskPanel = () => {
  const { currentBoard, currentBoardId } = useCurrentBoard();
  const { taskData } = useTaskData();
  const { closePanel, isPanelOpen } = usePanel();

  const methods = useForm<taskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: { list: [], title: "", description: "", status: "" },
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    reset,
    setValue,
  } = methods;

  useOnPanelClose(PANELS.NEW_TASK_PANEL, reset);
  const onSubmit = (data: taskSchemaType) => {
    const task: TaskType = {
      id: v4(),
      title: data.title,
      description: data.description,
      status: data.status,
      subtasks: data.list.map((item) => ({ id: v4(), title: item.value })),
    };

    createTask(currentBoardId!, task);
    closePanel(PANELS.NEW_TASK_PANEL);
  };

  const statusArr =
    currentBoard?.columns.map((col) => ({
      value: col.id,
      label: col.title,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Panel name={PANELS.NEW_TASK_PANEL}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <h2 className="heading-l text-black dark:text-white">
              Add New Task
            </h2>
            <TextField
              placeholder="e.g Take coffee break"
              title="Title"
              errorMessage={errors.title?.message}
              {...register("title")}
            ></TextField>
            <TextField
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              title="Description"
              errorMessage={errors.description?.message}
              textarea
              {...register("description")}
              className="h-[120px]"
            ></TextField>
            <ListEditor
              title="Subtasks"
              addButtonTitle="+ Add New Subtask"
              itemPlaceholder="e.g Make a coffee"
            ></ListEditor>

            <Dropdown
              options={statusArr}
              defaultOption={statusArr[0]}
              title="Status"
              onChange={(v) => setValue("status", v.value)}
            ></Dropdown>

            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Panel>
    </FormProvider>
  );
};

export default NewTaskPanel;
