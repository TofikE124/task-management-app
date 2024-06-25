"use client";
import Switch from "./components/Switch";
import TaskColumns from "./components/TaskColumns";
import PageHeader from "./layouts/PageHeader";
import Sidebar from "./layouts/Sidebar";

export default function Home() {
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
