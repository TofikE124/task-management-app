import Image from "next/image";
import useCurrentBoard from "../hooks/useCurrentBoard";
import dotsIcon from "/public/images/icon-vertical-ellipsis.svg";
import { Button } from "../components/Button";

const PageHeader = () => {
  const { currentBoard } = useCurrentBoard();

  return (
    <div className="bg-white dark:bg-dark-grey border-b border-lines-light dark:border-lines-dark">
      <div className="flex items-center justify-between py-5 px-6 w-full">
        <h2 className="heading-xl text-black dark:text-white">
          {currentBoard?.title}
        </h2>
        <div className="flex items-center gap-5">
          <Button
            variant="primary"
            size="sm"
            disabled={!currentBoard?.columns.length}
          >
            + Add New Task
          </Button>
          <div className="cursor-pointer px-[6px] select-none">
            <Image src={dotsIcon} width={4} height={20} alt="Dots icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
