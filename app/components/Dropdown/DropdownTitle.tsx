"use client";

import DropdownTrigger from "./DropdownTrigger";

interface Props {
  children: React.ReactNode;
}
const DropdownTitle = ({ children }: Props) => {
  return (
    <>
      <p className="text-medium-grey dark:text-white mb-2 h-sm fw-bold">
        {children}
      </p>
      <DropdownTrigger></DropdownTrigger>
    </>
  );
};

export default DropdownTitle;
