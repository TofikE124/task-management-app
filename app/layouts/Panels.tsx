import React from "react";
import NewBoardPanel from "../components/panels/NewBoardPanel";
import NewTaskPanel from "../components/panels/NewTaskPanel";

const Panels = () => {
  return (
    <>
      <NewBoardPanel></NewBoardPanel>
      <NewTaskPanel></NewTaskPanel>
    </>
  );
};

export default Panels;
