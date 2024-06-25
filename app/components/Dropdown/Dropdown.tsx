import React, { PropsWithChildren } from "react";
import DropdownTitle from "./DropdownTitle";
import DropdownContainer from "./DropdownContainer";
import DropdownElements from "./DropdownElements";
import DropdownOption from "./DropdownOption";
import DropdownTrigger from "./DropdownTrigger";

interface Props {
  options: string[];
  defaultOption?: string;
  title: string;
  onChange?: (value: string) => void;
}

const Dropdown = ({
  options,
  defaultOption,
  title,
  onChange = () => {},
}: Props) => {
  return (
    <Dropdown.Container onChange={onChange}>
      <Dropdown.Title>{title}</Dropdown.Title>
      <Dropdown.Elements>
        {options.map((option, index) => (
          <Dropdown.Option
            defaultOption={defaultOption ? option == defaultOption : index == 0}
            value={option}
          ></Dropdown.Option>
        ))}
      </Dropdown.Elements>
    </Dropdown.Container>
  );
};

Dropdown.Title = DropdownTitle;
Dropdown.Container = DropdownContainer;
Dropdown.Elements = DropdownElements;
Dropdown.Option = DropdownOption;
Dropdown.Trigger = DropdownTrigger;

export default Dropdown;
