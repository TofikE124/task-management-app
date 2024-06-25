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
      <div className="flex gap-4 relative z-20">
        <Image width={16} height={16} alt="Board icon" src={boardIcon} />
        <h3
          className={`heading-m ${active ? "text-white" : "text-medium-grey"}`}
        >
          {summary.title}
        </h3>
      </div>
      <div
        className={`absolute -left-8 -top-2 py-4 bottom-0 right-0 rounded-r-[100px] ${
          active
            ? "bg-main-purple"
            : "dark:group-hover:bg-white group-hover:bg-lines-light duration-200"
        }`}
      ></div>
    </div>
  );
};

export default SidebarBoardSummary;
