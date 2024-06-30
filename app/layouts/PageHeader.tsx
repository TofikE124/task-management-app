import { Button } from "../components/Button";
import VerticalEllipsisPanel from "../components/VerticalEllipsesPanel";
import { PANELS } from "../constatnts/panels";
import { usePanel } from "../contexts/PanelProvider";
import useCurrentBoard from "../hooks/useCurrentBoard";
import { useTaskData } from "../hooks/useTaskData";

const PageHeader = () => {
  const { currentBoard } = useCurrentBoard();

  return (
    <div className="bg-white dark:bg-dark-grey border-b border-lines-light dark:border-lines-dark">
      <div className="flex items-center justify-between py-5 px-6 w-full">
        <h2 className="heading-xl text-black dark:text-white">
          {currentBoard?.title}
        </h2>
        <div className="flex items-center gap-5">
          <AddTask></AddTask>
          <PageHeaderMoreOptions></PageHeaderMoreOptions>
        </div>
      </div>
    </div>
  );
};

const AddTask = () => {
  const { currentBoard } = useCurrentBoard();
  const { openPanel } = usePanel();

  const handleClick = () => {
    openPanel(PANELS.TASK_FORM_PANEL);
  };

  return (
    <Button
      variant="primary"
      size="sm"
      disabled={!currentBoard?.columns.length}
      onClick={handleClick}
    >
      + Add New Task
    </Button>
  );
};

const PageHeaderMoreOptions = () => {
  const { currentBoard } = useCurrentBoard();
  const { openPanel } = usePanel();
  const { updateTaskData } = useTaskData();
  const handleEdit = () => {
    if (!currentBoard) return;
    updateTaskData({ activeBoard: currentBoard });
    openPanel(PANELS.BOARD_FORM_PANEL);
  };

  const handleDelete = () => {
    openPanel(PANELS.DELETE_BOARD_PANEL);
  };

  return (
    <VerticalEllipsisPanel
      firstOptionText="Edit Board"
      secondOptionText="Delete Board"
      onFirstOptionClick={handleEdit}
      onSecondOptionClick={handleDelete}
      className="translate-x-[calc(-100%+20px)] origin-top-right mt-6"
    ></VerticalEllipsisPanel>
  );
};

export default PageHeader;
