import React, { PropsWithChildren } from "react";
import DropdownTitle from "./DropdownTitle";
import DropdownContainer from "./DropdownContainer";
import DropdownElements from "./DropdownElements";
import DropdownOption, { Option } from "./DropdownOption";
import DropdownTrigger from "./DropdownTrigger";

interface Props {
  options: Option[];
  defaultOption?: Option;
  title: string;
  onChange?: (value: Option) => void;
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
      <Dropdown.Trigger></Dropdown.Trigger>
      <Dropdown.Elements>
        {options.map((option, index) => (
          <Dropdown.Option
            key={index}
            defaultOption={defaultOption ? option == defaultOption : index == 0}
            option={option}
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
