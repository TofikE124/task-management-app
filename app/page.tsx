"use client";
import { Suspense } from "react";
import QuickActionSidebar from "./components/QuickActionSidebar/QuickActionSidebar";
import TaskColumns from "./components/TaskColumns";
import MainContent from "./layouts/MainContent";
import PageHeader from "./layouts/PageHeader";
import Panels from "./layouts/Panels";
import Sidebar from "./layouts/Sidebar";

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
