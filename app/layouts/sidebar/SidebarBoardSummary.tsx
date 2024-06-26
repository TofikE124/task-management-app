import { BoardSummary } from "@/app/types/taskTypes";
import Image from "next/image";

import boardIcon from "/public/images/icon-board.svg";

interface Props {
  active: boolean;
  summary: BoardSummary;
  onClick?: () => void;
}

const SidebarBoardSummary = ({
  active,
  summary,
  onClick = () => {},
}: Props) => {
  return (
    <div
      className="relative cursor-pointer group select-none"
      onClick={onClick}
    >
      <div
        className={`flex gap-4 relative z-20 py-4 pl-8 -ml-8 rounded-r-[100px]  ${
          active
            ? "bg-main-purple"
            : "dark:group-hover:bg-white group-hover:bg-lines-light duration-200"
        }`}
      >
        <Image width={16} height={16} alt="Board icon" src={boardIcon} />
        <h3
          className={`heading-m ${active ? "text-white" : "text-medium-grey"}`}
        >
          {summary.title}
        </h3>
      </div>
    </div>
  );
};

export default SidebarBoardSummary;
