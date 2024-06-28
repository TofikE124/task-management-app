"use client";
import { useContext, useEffect } from "react";
import { dropdownContext } from "./DropdownContainer";

export interface Option {
  label: string;
  value: string;
}

interface Props {
  option: Option;
  defaultOption?: boolean;
}

const DropdownOption = ({ option, defaultOption }: Props) => {
  const { updateSelectedOption, selectedOption, toggleDropdown } =
    useContext(dropdownContext);
  const handleClick = () => {
    updateSelectedOption(option);
    toggleDropdown();
  };

  useEffect(() => {
    if (defaultOption) {
      updateSelectedOption(option);
    }
  }, [defaultOption]);

  return (
    <p
      onClick={handleClick}
      className={`text-medium-grey py-1 px-4 cursor-pointer select-none hover:bg-main-purple hover:text-white transition-colors duration-200 ${
        selectedOption == option ? "bg-main-purple text-white" : ""
      }`}
    >
      {option.label}
    </p>
  );
};

export default DropdownOption;
