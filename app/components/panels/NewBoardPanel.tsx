import { usePanel } from "@/app/contexts/PanelProvider";
import { boardSchema } from "@/app/schemas/boardSchema";
import { createBoard } from "@/app/services/taskService";
import { Board } from "@/app/types/taskTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import Button from "../Button";
import Panel from "../Panel";
import TextField from "../TextField";
import ListEditor from "../listEditor/ListEditor";
import { PANELS } from "@/app/constatnts/panels";

type boardSchemaType = z.infer<typeof boardSchema>;

const NewBoardPanel = () => {
  const { closePanel } = usePanel();

  const methods = useForm<boardSchemaType>({
    resolver: zodResolver(boardSchema),
    defaultValues: { list: [], name: "" },
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit = (data: boardSchemaType) => {
    const newBoard: Board = {
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
  };

  return (
    <FormProvider {...methods}>
      <Panel name={PANELS.NEW_BOARD_PANEL}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <h2 className="heading-l text-black dark:text-white">
              Add New Board
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
            ></ListEditor>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              onClick={() => closePanel(PANELS.NEW_BOARD_PANEL)}
            >
              Create New Board
            </Button>
          </div>
        </form>
      </Panel>
    </FormProvider>
  );
};

export default NewBoardPanel;
