import Image from "next/image";
import { useContext } from "react";
import { dropdownContext } from "./DropdownContainer";
import arrowDown from "/public/images/icon-chevron-down.svg";

const DropdownTrigger = () => {
  const { selectedOption, toggleDropdown } = useContext(dropdownContext);

  return (
    <div
      onClick={() => toggleDropdown()}
      className="peer rounded-[4px] py-2 px-4 min-h-10 text-black dark:text-white border border-medium-grey-25 flex items-center justify-between select-none cursor-pointer b-lg fw-medium group-toggled:border group-toggled:border-main-purple"
    >
      {selectedOption || "Loading..."}

      {/* Arrow Icon */}
      <div className="peer w-[10px] h-[5px] transition-transform duration-[250ms] ease-in-out grid group-toggled:rotate-[180deg]">
        <Image src={arrowDown} alt="Arrow Down" width={10} height={5} />
      </div>
    </div>
  );
};

export default DropdownTrigger;
