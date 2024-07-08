import Image from "next/image";
import { Button } from "../components/Button";
import VerticalEllipsisPanel from "../components/VerticalEllipsesPanel";
import { PANELS } from "../constatnts/panels";
import { usePanel } from "../contexts/PanelProvider";
import useCurrentBoard from "../hooks/useCurrentBoard";
import { useTaskData } from "../hooks/useTaskData";

import MobileLogo from "/public/images/logo-mobile.svg";
import CheveronDown from "/public/images/icon-chevron-down.svg";
import { useSidebar } from "../hooks/useSidebarProvider";

const PageHeader = () => {
  const { currentBoard } = useCurrentBoard();

  return (
    <div className="bg-white dark:bg-dark-grey border-b border-lines-light dark:border-lines-dark w-full">
      <div className="flex items-center justify-between py-5 px-6 w-full">
        <>
          <h2 className="heading-xl text-black dark:text-white sm:hidden">
            {currentBoard?.title}
          </h2>
          <MobilePageHeaderTitle></MobilePageHeaderTitle>
        </>
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
      <h1 className="lgmd:hidden heading-l">+</h1>
      <span className="sm:hidden">+ Add New Task</span>
    </Button>
  );
};

const MobilePageHeaderTitle = () => {
  const { currentBoard } = useCurrentBoard();
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="flex items-center gap-4 lgmd:hidden"
      onClick={toggleSidebar}
    >
      <Image width={24} height={24} src={MobileLogo} alt="Mobile Logog" />
      <div className="flex items-center gap-2 cursor-pointer">
        <h2 className="heading-xl text-black dark:text-white">
          {currentBoard?.title}
        </h2>
        <Image width={8} height={4} src={CheveronDown} alt="Mobile Logog" />
      </div>
    </div>
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
      disabled={!currentBoard}
    ></VerticalEllipsisPanel>
  );
};

export default PageHeader;
