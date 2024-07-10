import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";
import { useOnPanelClose } from "@/app/hooks/useOnPanelClose";
import { useTaskData } from "@/app/hooks/useTaskData";
import { boardSchema } from "@/app/schemas/boardSchema";
import { BoardType, ColumnType } from "@/app/types/taskTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { take } from "rxjs";
import { v4 } from "uuid";
import { z } from "zod";
import { Button } from "../Button";
import Panel from "../Panel";
import TextField from "../TextField";
import ListEditor from "../listEditor/ListEditor";
import appDataService from "@/app/services/appDataService";
import { getRandomColor } from "@/app/utilities/colors";

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
    defaultValues: { columns: [], title: "" },
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
    validateBoardName(data.title).then((isValid) => {
      if (!isValid)
        setError("title", {
          message: `Board with the name "${data.title}" already exists`,
        });
      else {
        const boardId = v4();
        const newBoard: BoardType = {
          id: boardId,
          title: data.title,
          columns: data.columns.map((item) => ({
            id: v4(),
            color: getRandomColor(),
            title: item.title,
            tasks: [],
            boardId,
          })),
        };
        appDataService.createBoard(newBoard);
        closePanel(PANELS.BOARD_FORM_PANEL);
      }
    });
  };

  const handleEditBoard = (data: boardSchemaType) => {
    validateBoardName(data.title).then((isValid) => {
      if (isValid) {
        const editedBoard: BoardType = {
          id: activeBoard?.id!,
          title: data.title,
          columns: data.columns.map((item) => {
            const col = getColumn(activeBoard?.columns || [], item.id);
            return {
              id: item.id,
              color: col?.color || "#fff",
              title: item.title,
              tasks: col?.tasks || [],
              boardId: activeBoard!.id,
            };
          }),
        };
        appDataService.editBoard(editedBoard);
        closePanel(PANELS.BOARD_FORM_PANEL);
      } else {
        setError("title", {
          message: `Board with the name "${data.title}" already exists`,
        });
      }
    });
  };

  const validateBoardName = async (boardName: string) => {
    if (boardName == activeBoard?.title) return true;
    return appDataService.boards$
      .pipe(take(1))
      .subscribe((boards) => boards.every((board) => board.title != boardName));
  };

  useEffect(() => {
    setValue("title", activeBoard?.title || "");
    setValue("columns", activeBoard?.columns || []);
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
              errorMessage={errors.title?.message}
              {...register("title")}
            ></TextField>
            <ListEditor
              title="Board Columns"
              addButtonTitle="+ Add New Column"
              itemPlaceholder="e.g Todo"
              listName="columns"
              fieldName="title"
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
