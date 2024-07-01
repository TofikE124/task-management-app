import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import { useTaskData } from "@/app/hooks/useTaskData";
import { boardSchema } from "@/app/schemas/boardSchema";
import {
  createBoard,
  editBoard,
  fetchBoards,
} from "@/app/services/taskService";
import { BoardType, ColumnType, TaskType } from "@/app/types/taskTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { isValid, z } from "zod";
import { Button } from "../Button";
import Panel from "../Panel";
import TextField from "../TextField";
import ListEditor from "../listEditor/ListEditor";

const getColumn = (columns: ColumnType[], columnId: string) => {
  return columns.find((col) => col.id == columnId);
};

type boardSchemaType = z.infer<typeof boardSchema>;

const BoardFormPanel = () => {
  const { taskData, updateTaskData } = useTaskData();
  const activeBoard = taskData?.activeBoard;
  const { closePanel, isPanelOpen } = usePanel();

  const methods = useForm<boardSchemaType>({
    resolver: zodResolver(boardSchema),
    defaultValues: { list: [], name: "" },
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    setValue,
    reset,
  } = methods;

  useOnPanelClose(PANELS.BOARD_FORM_PANEL, reset);

  const onSubmit = (data: boardSchemaType) => {
    if (activeBoard) {
      handleEditBoard(data);
    } else {
      handleCreateBoard(data);
    }
  };

  const handleCreateBoard = (data: boardSchemaType) => {
    fetchBoards().then((boards) => {
      if (!boards.every((board) => board.title != data.name)) {
        setError("name", {
          message: `Board with the name "${data.name}" already exists`,
        });
      } else {
        const newBoard: BoardType = {
          id: v4(),
          title: data.name,
          columns: data.list.map((item) => ({
            id: item.id,
            color: "#fff",
            title: item.value,
            tasks: [],
          })),
        };
        createBoard(newBoard);
        closePanel(PANELS.BOARD_FORM_PANEL);
      }
    });
  };

  const handleEditBoard = (data: boardSchemaType) => {
    validateEdit(data).then((isValid) => {
      if (isValid) {
        const editedBoard: BoardType = {
          id: activeBoard?.id!,
          title: data.name,
          columns: data.list.map((item) => {
            const col = getColumn(activeBoard?.columns || [], item.id);
            return {
              id: item.id,
              color: col?.color || "#fff",
              title: item.value,
              tasks: col?.tasks || [],
            };
          }),
        };
        editBoard(editedBoard);
        closePanel(PANELS.BOARD_FORM_PANEL);
      } else {
        setError("name", {
          message: `Board with the name "${data.name}" already exists`,
        });
      }
    });
  };

  const validateEdit = async (data: boardSchemaType) => {
    if (data.name == activeBoard?.title) return true;
    return fetchBoards().then((boards) =>
      boards.every((board) => board.title != data.name)
    );
  };

  useEffect(() => {
    setValue("name", activeBoard?.title || "");
    setValue(
      "list",
      activeBoard?.columns.map((col) => ({ id: col.id, value: col.title })) ||
        []
    );
  }, [activeBoard]);

  const resetPanel = () => {
    updateTaskData({});
    reset();
  };

  useOnPanelClose(PANELS.BOARD_FORM_PANEL, resetPanel);

  return (
    <FormProvider {...methods}>
      <Panel name={PANELS.BOARD_FORM_PANEL}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <h2 className="heading-l text-black dark:text-white">
              {activeBoard ? "Edit Board" : "Add New Board"}
            </h2>
            <TextField
              placeholder="e.g Web Design"
              title="Board Name"
              errorMessage={errors.name?.message}
              {...register("name")}
            ></TextField>
            <ListEditor
              title="Board Columns"
              addButtonTitle="+ Add New Column"
              itemPlaceholder="e.g Todo"
            ></ListEditor>
            <Button type="submit" variant="primary" size="sm">
              {activeBoard ? "Save Changes" : "Create New Board"}
            </Button>
          </div>
        </form>
      </Panel>
    </FormProvider>
  );
};

export default BoardFormPanel;
