import React from "react";
import NewBoardPanel from "../components/panels/NewBoardPanel";
import TaskFormPanel from "../components/panels/TaskFormPanel";
import TaskDetailsPanel from "../components/panels/TaskDetailsPanel";
import DeleteTaskPanel from "../components/panels/DeleteTaskPanel";

const Panels = () => {
  return (
    <>
      <NewBoardPanel></NewBoardPanel>
      <TaskDetailsPanel></TaskDetailsPanel>
      <TaskFormPanel></TaskFormPanel>
      <DeleteTaskPanel></DeleteTaskPanel>
    </>
  );
};

export default Panels;
