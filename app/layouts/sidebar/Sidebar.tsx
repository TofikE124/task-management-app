import Image from "next/image";
import ThemeSwitch from "../../components/ThemeSwitch";

import useBoardSummaries from "@/app/hooks/useBoardSummaries";
import useCurrentBoard from "../../hooks/useCurrentBoard";
import SidebarBoardSummary from "./SidebarBoardSummary";
import SidebarCreateNewBoard from "./SidebarCreateNewBoard";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import hideSidebar from "/public/images/icon-hide-sidebar.svg";
import logoDark from "/public/images/logo-dark.svg";
import logoLight from "/public/images/logo-light.svg";
import iconShowSidebar from "/public/images/icon-show-sidebar.svg";

const Sidebar = () => {
  const { boardSummaries } = useBoardSummaries();
  const { currentBoardId, navigateToBoard } = useCurrentBoard();

  const [isVisible, setIsVisible] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            className="bg-white dark:bg-dark-grey h-full border-r border-lines-light dark:border-lines-dark"
            initial={{ marginLeft: "-300px" }}
            animate={{ marginLeft: 0 }}
            exit={{ marginLeft: "-300px" }}
            ref={ref}
          >
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
                <div className="flex flex-col mt-5">
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
              <div className="pl-6 flex flex-col  gap-5 mt-auto select-none">
                <ThemeSwitch></ThemeSwitch>
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    setIsVisible(false);
                  }}
                >
                  <Image
                    width={18}
                    height={16}
                    alt="Hide Icon"
                    src={hideSidebar}
                  />
                  <p className="heading-m text-medium-grey">Hide Sidebar</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {!isVisible ? (
          <motion.div
            initial={{ translateX: "-100%" }}
            animate={{ translateX: "0" }}
            exit={{ translateX: "-100%" }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 bottom-4 cursor-pointer"
            onClick={() => setIsVisible(true)}
          >
            <div className="w-14 h-12 rounded-r-full bg-main-purple grid place-items-center">
              <Image
                src={iconShowSidebar}
                width={16}
                height={10}
                alt="Show sidebar icon"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
