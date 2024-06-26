"use client";
import TaskColumns from "./components/TaskColumns";
import PageHeader from "./layouts/PageHeader";
import Sidebar from "./layouts/sidebar/Sidebar";
import { initializeApp } from "./services/taskService";

export default function Home() {
  initializeApp();

  return (
    <div className="w-screen h-screen flex  bg-light-grey dark:bg-very-dark-grey">
      <Sidebar></Sidebar>
      <div className="flex flex-col grow">
        <PageHeader></PageHeader>
        <TaskColumns></TaskColumns>
      </div>
    </div>
  );
}
