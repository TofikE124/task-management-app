import axios from "axios";
import QuickActionSidebar from "./components/QuickActionSidebar/QuickActionSidebar";
import TaskColumns from "./components/TaskColumns";
import MainContent from "./layouts/MainContent";
import PageHeader from "./layouts/PageHeader";
import Panels from "./layouts/Panels";
import Sidebar from "./layouts/Sidebar";
import { Metadata } from "next";
import { BoardType } from "./types/taskTypes";
import { Board } from "@prisma/client";
import appDataService from "./services/appDataService";
import { prisma } from "@/prisma/client";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-x-scroll flex bg-light-grey dark:bg-very-dark-grey">
      <Sidebar></Sidebar>
      <MainContent>
        <PageHeader></PageHeader>
        <TaskColumns></TaskColumns>
        <Panels></Panels>
        <QuickActionSidebar></QuickActionSidebar>
      </MainContent>
    </div>
  );
}

interface Props {
  searchParams: { currentBoardId: string };
}

export async function generateMetadata({
  searchParams: { currentBoardId },
}: Props): Promise<Metadata> {
  try {
    const board = await prisma.board.findUnique({
      where: { id: currentBoardId },
    });
    return {
      title: board?.title || "Kanban Task Management",
    };
  } catch (error) {
    return {
      title: "Kanban Task Management",
    };
  }
}
