import { PANELS } from "@/app/constatnts/panels";
import { DELETE_TYPE, useDeleteContext } from "@/app/contexts/deleteProvider";
import Panel from "../Panel";
import { Button } from "../Button";
import { usePanel } from "@/app/contexts/PanelProvider";

const ConfirmPanel = () => {
  const { closePanel } = usePanel();
  const { action, deleteItem } = useDeleteContext();

  const deleteSequel: Record<DELETE_TYPE, string> = {
    Board: "all columns and tasks",
    Column: "all tasks",
    Task: "all the subtasks",
  };

  const handleDelete = () => {
    deleteItem();
    closePanel(PANELS.CONFIRM_PANEL);
  };
  const handleCancel = () => {
    closePanel(PANELS.CONFIRM_PANEL);
  };

  return (
    <Panel name={PANELS.CONFIRM_PANEL}>
      <div className="bg-white dark:bg-dark-grey rounded-md flex flex-col gap-6">
        <h2 className="heading-l text-red">
          Are you sure you want to delete this {action?.type}?
        </h2>
        <p className="text-medium-grey body-l">
          Are you sure you want to delete the {action?.type}? This action will
          remove {deleteSequel[action?.type!]} and cannot be reversed.
        </p>
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="grow"
          >
            Delete
          </Button>
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="sm"
            className="grow"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Panel>
  );
};

export default ConfirmPanel;
