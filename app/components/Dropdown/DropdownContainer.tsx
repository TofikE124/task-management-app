"use client";
import { useTheme } from "next-themes";
import { createContext, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

interface DropdownContext {
  toggleDropdown: () => void;
  selectedOption: string;
  updateSelectedOption: (value: string) => void;
}
export const dropdownContext = createContext<DropdownContext>(
  {} as DropdownContext
);

const DropdownContainer = ({ children, onChange = () => {} }: Props) => {
  const [selectedOption, setSelectedOption] = useState("");
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  function toggleDropdown() {
    ref.current?.classList.toggle("toggled");
  }

  function updateSelectedOption(value: string) {
    onChange(value);
    setSelectedOption(value);
  }

  return (
    <dropdownContext.Provider
      value={{ toggleDropdown, selectedOption, updateSelectedOption }}
    >
      <div
        ref={ref}
        className={`group relative w-full max-w-[350px] ${resolvedTheme}`}
      >
        {children}
      </div>
    </dropdownContext.Provider>
  );
};

export default DropdownContainer;
