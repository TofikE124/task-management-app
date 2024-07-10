"use client";
import Image from "next/image";
import ThemeSwitch from "../components/ThemeSwitch";

import useBoardSummaries from "@/app/hooks/useBoardSummaries";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import useCurrentBoard from "../hooks/useCurrentBoard";

import { useSidebar } from "@/app/hooks/useSidebarProvider";
import hideSidebarIcon from "/public/images/icon-hide-sidebar.svg";
import iconShowSidebar from "/public/images/icon-show-sidebar.svg";
import logoDark from "/public/images/logo-dark.svg";
import logoLight from "/public/images/logo-light.svg";
import DraggableList from "@/app/components/draggableList/DraggableList";
import DraggableItem from "@/app/components/draggableList/DraggableItem";
import DropIndicator from "@/app/components/draggableList/DropIndicator";
import Icon from "@/app/components/Icon";
import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";

import { BoardSummary } from "@/app/types/taskTypes";
import boardIcon from "/public/images/icon-board.svg";
import { Button, ButtonVaraiants } from "../components/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import { useTheme } from "next-themes";
import useMountStatus from "../hooks/useMountStatus";
import { useLoading } from "../contexts/LoadingProvider";
import appDataService from "../services/appDataService";
import BurnBarrel from "../components/BurnBarrel";

const Sidebar = () => {
  const { isVisible } = useSidebar();
  const { boardSummaries } = useBoardSummaries();
  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className={`bg-white dark:bg-dark-grey w-[300px] h-full border-r border-lines-light dark:border-lines-dark transition-[margin] duration-500 z-30 sm:fixed ${
          isVisible ? "ml-0" : "ml-[-300px]"
        }`}
        ref={ref}
      >
        <div className="flex flex-col py-8 pr-6 h-full">
          <Logo></Logo>
          <div className="pl-8 mt-14">
            <p className="heading-s uppercase text-medium-grey dark:text-white">
              All Boards ({boardSummaries.length})
            </p>
            <BoardsList
              onDragStart={() => {
                setIsDragging(true);
              }}
              onDrop={() => {
                setIsDragging(false);
              }}
            ></BoardsList>
          </div>
          <AnimatePresence>
            {boardSummaries.length && isDragging ? (
              <motion.div
                layout
                className="mx-auto lgmd:hidden my-auto py-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BurnBarrel></BurnBarrel>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <SidebarFooter></SidebarFooter>
        </div>
      </div>
      <BlackOverlay></BlackOverlay>
      <ShowSidebar></ShowSidebar>
    </>
  );
};

interface BoardListProps {
  onDragStart?: () => void;
  onDrop?: () => void;
}

const BoardsList = ({
  onDragStart = () => {},
  onDrop = () => {},
}: BoardListProps) => {
  const { boardSummaries } = useBoardSummaries();
  const { currentBoardId, navigateToBoard } = useCurrentBoard();
  const { loading } = useLoading();
  const mounted = useMountStatus();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    onDragStart();
    e.dataTransfer.setData("type", "board");
    e.dataTransfer.setData("boardId", id);
  };

  const handleDrop = (e: React.DragEvent, before: string) => {
    onDrop();
    const type = e.dataTransfer.getData("type");
    if (type != "board") return;
    const boardId = e.dataTransfer.getData("boardId");
    appDataService.moveBoard(boardId, before);
  };

  if (loading && mounted) return <BoardsListLoading></BoardsListLoading>;

  return (
    <motion.div className="flex flex-col mt-5" layout>
      <DraggableList
        onDrop={handleDrop}
        containerName="boards"
        containerId="boards"
        axis="y"
        className="pb-6"
      >
        {boardSummaries.map((summary) => (
          <DraggableItem
            beforeId={summary.id}
            containerId="boards"
            containerName="boards"
            onDragStart={(e) => handleDragStart(e, summary.id)}
            key={summary.id}
          >
            <SidebarBoardSummary
              key={summary.id}
              summary={summary}
              active={currentBoardId == summary.id}
              onClick={() => navigateToBoard(summary.id)}
            ></SidebarBoardSummary>
          </DraggableItem>
        ))}
        <DropIndicator
          beforeId="-1"
          containerId="boards"
          containerName="boards"
        ></DropIndicator>
      </DraggableList>

      <SidebarCreateNewBoard></SidebarCreateNewBoard>
    </motion.div>
  );
};

const BoardsListLoading = () => {
  return (
    <div className="flex flex-col gap-2 mt-5 relative ml-[-64px]">
      <BoardLoadingSelected></BoardLoadingSelected>
      <BoardLoading></BoardLoading>
      <BoardLoading></BoardLoading>
      <BoardLoading></BoardLoading>
      <BoardLoading></BoardLoading>
    </div>
  );
};

const BoardLoadingSelected = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const colors = theme.colors as any;

  return (
    <LoadingSkeleton
      width="calc(100%)"
      height="48px"
      borderRadius="100px"
      containerClassName="h-[48px]"
      baseColor={colors["main-purple"]}
      highlightColor={colors["main-purple-highlight"]}
      className="cursor-pointer"
    ></LoadingSkeleton>
  );
};

const BoardLoading = () => {
  const { resolvedTheme } = useTheme();
  const { theme } = resolveConfig(tailwindConfig);
  const colors = theme.colors as any;

  return (
    <LoadingSkeleton
      width="calc(100%)"
      height="48px"
      borderRadius="100px"
      containerClassName="h-[48px]"
      baseColor={
        resolvedTheme == "dark" ? colors["charcoal-grey"] : colors["ghost"]
      }
      highlightColor={
        resolvedTheme == "dark"
          ? colors["charcoal-grey-highlight"]
          : colors["ghost-highlight"]
      }
      className="cursor-pointer"
    ></LoadingSkeleton>
  );
};

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

const SidebarCreateNewBoard = () => {
  const { openPanel } = usePanel();
  return (
    <motion.div
      onClick={() => openPanel(PANELS.BOARD_FORM_PANEL)}
      className="relative cursor-pointer group select-none"
      layout
    >
      <div className="flex gap-4 py-4 relative z-20">
        <Icon
          width={16}
          height={16}
          src="/images/icon-board.svg"
          bgColorClass="bg-main-purple"
        ></Icon>
        <h3 className="heading-m text-main-purple">+ Create New Board</h3>
      </div>
    </motion.div>
  );
};

const ShowSidebar = () => {
  const { isVisible, showSidebar } = useSidebar();

  return (
    <AnimatePresence>
      {!isVisible ? (
        <motion.div
          initial={{ translateX: "-100%" }}
          animate={{ translateX: "0" }}
          exit={{ translateX: "-100%" }}
          transition={{ duration: 0.5 }}
          className="fixed left-0 bottom-8 cursor-pointer z-50 sm:hidden"
          onClick={showSidebar}
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
  );
};

const SidebarFooter = () => {
  const { hideSidebar } = useSidebar();

  return (
    <div className="pl-6 flex flex-col  gap-5 mt-auto select-none">
      <Authentication></Authentication>
      <ThemeSwitch></ThemeSwitch>
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={hideSidebar}
      >
        <Image width={18} height={16} alt="Hide Icon" src={hideSidebarIcon} />
        <p className="heading-m text-medium-grey">Hide Sidebar</p>
      </div>
    </div>
  );
};

const Authentication = () => {
  const session = useSession();
  const { loading } = useLoading();
  const mounted = useMountStatus();

  const buttonMap: Record<
    "authenticated" | "unauthenticated" | "loading",
    { variant: ButtonVaraiants; text: string; onClick?: () => void }
  > = {
    authenticated: {
      text: "Logout",
      variant: { variant: "destructive", size: "sm" },
      onClick: () => signOut(),
    },
    unauthenticated: {
      text: "Login",
      variant: { variant: "secondary", size: "sm" },
      onClick: () => signIn("google"),
    },
    loading: {
      text: "loading...",
      variant: { variant: "secondary", size: "sm" },
    },
  };

  const button = buttonMap[session.status];

  if (loading && mounted)
    return <AuthenticationLoading></AuthenticationLoading>;

  return (
    <Button onClick={button.onClick} {...button.variant}>
      {button.text}
    </Button>
  );
};

const AuthenticationLoading = () => {
  const { resolvedTheme } = useTheme();
  const { theme } = resolveConfig(tailwindConfig);
  const colors = theme.colors as any;

  return (
    <LoadingSkeleton
      width="100%"
      height="34px"
      baseColor={`${
        resolvedTheme == "dark" ? colors["charcoal-grey"] : colors["light-grey"]
      }`}
      highlightColor={`${
        resolvedTheme == "dark"
          ? colors["charcoal-grey-highlight"]
          : colors["light-grey-highlight"]
      }`}
      borderRadius={6}
    ></LoadingSkeleton>
  );
};

const Logo = () => {
  return (
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
  );
};

const BlackOverlay = () => {
  const { hideSidebar, isVisible } = useSidebar();
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-20 transition-all duration-200 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }  lgmd:hidden`}
      onClick={hideSidebar}
    ></div>
  );
};

export default Sidebar;
