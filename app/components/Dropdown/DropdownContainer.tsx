"use client";
import { useTheme } from "next-themes";
import { createContext, useRef, useState } from "react";
import { Option } from "./DropdownOption";

interface Props {
  children: React.ReactNode;
  onChange?: (option: Option) => void;
}

interface DropdownContext {
  toggleDropdown: () => void;
  selectedOption: Option | null;
  updateSelectedOption: (option: Option) => void;
}
export const dropdownContext = createContext<DropdownContext>(
  {} as DropdownContext
);

const DropdownContainer = ({ children, onChange = () => {} }: Props) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  function toggleDropdown() {
    ref.current?.classList.toggle("toggled");
  }

  function updateSelectedOption(option: Option) {
    onChange(option);
    setSelectedOption(option);
  }

  return (
    <dropdownContext.Provider
      value={{ toggleDropdown, selectedOption, updateSelectedOption }}
    >
      <div
        ref={ref}
        className={`group relative w-full ${resolvedTheme}`}
        suppressHydrationWarning
      >
        {children}
      </div>
    </dropdownContext.Provider>
  );
};

export default DropdownContainer;
