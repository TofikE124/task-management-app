"use client";
import { useContext, useEffect } from "react";
import { dropdownContext } from "./DropdownContainer";

interface Props {
  value: string;
  defaultOption?: boolean;
}

const DropdownOption = ({ value, defaultOption }: Props) => {
  const { updateSelectedOption, selectedOption, toggleDropdown } =
    useContext(dropdownContext);
  const handleClick = () => {
    updateSelectedOption(value);
    toggleDropdown();
  };
  useEffect(() => {
    if (defaultOption && !selectedOption) {
      updateSelectedOption(value);
    }
  }, []);

  return (
    <p
      onClick={handleClick}
      className={`text-medium-grey py-1 px-4 cursor-pointer select-none hover:bg-main-purple hover:text-white transition-colors duration-200 ${
        selectedOption == value ? "bg-main-purple text-white" : ""
      }`}
    >
      {value}
    </p>
  );
};

export default DropdownOption;
