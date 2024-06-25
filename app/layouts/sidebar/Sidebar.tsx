import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import { getBoardSummaries } from "../../services/taskService";
import { BoardSummary } from "../../types/taskTypes";

import useCurrentBoard from "../../hooks/useCurrentBoard";
import SidebarBoardSummary from "./SidebarBoardSummary";
import hideSidebar from "/public/images/icon-hide-sidebar.svg";
import logoDark from "/public/images/logo-dark.svg";
import logoLight from "/public/images/logo-light.svg";
import useBoardSummaries from "@/app/hooks/useBoardSummaries";
import SidebarCreateNewBoard from "./SidebarCreateNewBoard";

const Sidebar = () => {
  const { boardSummaries } = useBoardSummaries();
  const { currentBoardId, navigateToBoard } = useCurrentBoard();

  return (
    <div className="bg-white dark:bg-dark-grey h-full border-r border-lines-light dark:border-lines-dark">
      <div className="flex flex-col py-8 pr-6 h-full">
        <div className="pl-8">
          <Image
            width={152}
            height={25}
            alt="Logo Dark"
            src={logoDark}
            className="hidden dark:block"
          />
          <Image
            width={152}
            height={25}
            alt="Logo Light"
            src={logoLight}
            className="dark:hidden"
          />
        </div>
        <div className="pl-8 mt-14">
          <p className="heading-s uppercase text-medium-grey dark:text-white">
            All Boards ({boardSummaries.length})
          </p>
          <div className="flex flex-col gap-7 mt-5">
            {boardSummaries.map((summary) => (
              <SidebarBoardSummary
                key={summary.id}
                summary={summary}
                active={currentBoardId == summary.id}
                onClick={() => navigateToBoard(summary.id)}
              ></SidebarBoardSummary>
            ))}
            <SidebarCreateNewBoard></SidebarCreateNewBoard>
          </div>
        </div>
        <div className="pl-6 flex flex-col  gap-5 mt-auto">
          <ThemeSwitch></ThemeSwitch>
          <div className="flex items-center gap-4 cursor-pointer">
            <Image width={18} height={16} alt="Hide Icon" src={hideSidebar} />
            <p className="heading-m text-medium-grey">Hide Sidebar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
