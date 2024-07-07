"use client";
import { useTheme } from "next-themes";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Option } from "./DropdownOption";

interface Props {
  children: React.ReactNode;
  onChange?: (option: Option) => void;
}

interface DropdownContext {
  toggleDropdown: () => void;
  selectedOption: Option | null;
  updateSelectedOption: (option: Option) => void;
  setSelectedOption: Dispatch<SetStateAction<Option | null>>;
}
export const dropdownContext = createContext<DropdownContext>(
  {} as DropdownContext
);

const DropdownContainer = ({ children, onChange = () => {} }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  function toggleDropdown() {
    setIsVisible((v) => !v);
  }

  function updateSelectedOption(option: Option) {
    onChange(option);
    setSelectedOption(option);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement))
        setIsVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <dropdownContext.Provider
      value={{
        toggleDropdown,
        selectedOption,
        updateSelectedOption,
        setSelectedOption,
      }}
    >
      <div
        ref={ref}
        className={`group relative w-full ${
          isVisible ? "toggled" : ""
        } ${resolvedTheme}`}
        suppressHydrationWarning
      >
        {children}
      </div>
    </dropdownContext.Provider>
  );
};

export default DropdownContainer;
