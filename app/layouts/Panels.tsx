import React from "react";
import BoardFormPanel from "../components/panels/BoardFormPanel";
import TaskFormPanel from "../components/panels/TaskFormPanel";
import TaskDetailsPanel from "../components/panels/TaskDetailsPanel";
import DeleteTaskPanel from "../components/panels/DeleteTaskPanel";
import DeleteBoardPanel from "../components/panels/DeleteBoardPanel";
import ConfirmPanel from "../components/panels/ConfirmPanel";

const Panels = () => {
  return (
    <>
      <BoardFormPanel></BoardFormPanel>
      <TaskDetailsPanel></TaskDetailsPanel>
      <TaskFormPanel></TaskFormPanel>
      <DeleteTaskPanel></DeleteTaskPanel>
      <DeleteBoardPanel></DeleteBoardPanel>
      <ConfirmPanel></ConfirmPanel>
    </>
  );
};

export default Panels;
