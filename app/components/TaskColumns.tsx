import React from "react";
import Button from "./Button";

const TaskColumns = () => {
  return (
    <div className="w-full h-full grid place-items-center text-center">
      <div>
        <h3 className="heading-l text-medium-grey">
          This board is empty. Create a new column to get started.
        </h3>
        <Button variant="primary" size="lg" className="mt-8">
          + Add New Column
        </Button>
      </div>
    </div>
  );

  return <div className="flex"></div>;
};

export default TaskColumns;
