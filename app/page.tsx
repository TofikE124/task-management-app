"use client";
import TaskColumns from "./components/TaskColumns";
import MainContent from "./layouts/MainContent";
import PageHeader from "./layouts/PageHeader";
import Sidebar from "./layouts/sidebar/Sidebar";
import { initializeApp } from "./services/taskService";

export default function Home() {
  initializeApp();

  return (
    <div className="h-screen w-screen overflow-x-scroll flex bg-light-grey dark:bg-very-dark-grey">
      <Sidebar></Sidebar>
      <MainContent>
        <PageHeader></PageHeader>
        <TaskColumns></TaskColumns>
      </MainContent>
    </div>
  );
}
