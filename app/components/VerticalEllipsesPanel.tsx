import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import verticalEllipsisIcon from "/public/images/icon-vertical-ellipsis.svg";
import { twMerge } from "tailwind-merge";

interface VerticalEllipsisPanelProps {
  onFirstOptionClick: () => void;
  onSecondOptionClick: () => void;
  firstOptionText: string;
  secondOptionText: string;
  firstOptionColor?: string;
  secondOptionColor?: string;
  className?: string;
  disabled?: boolean;
}

const VerticalEllipsisPanel: React.FC<VerticalEllipsisPanelProps> = ({
  onFirstOptionClick,
  onSecondOptionClick,
  firstOptionText,
  secondOptionText,
  className,
  firstOptionColor = "text-medium-grey",
  secondOptionColor = "text-red",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  const handleFirstClick = () => {
    setIsVisible(false);
    onFirstOptionClick();
  };

  const handleSecondClick = () => {
    setIsVisible(false);
    onSecondOptionClick();
  };

  return (
    <div className="relative" ref={optionsRef}>
      <button
        disabled={disabled}
        className="cursor-pointer pl-2 select-none"
        onClick={() => setIsVisible((v) => !v)}
      >
        <Image
          width={4.5}
          height={20}
          alt="Vertical Ellipsis"
          src={verticalEllipsisIcon}
        />
      </button>
      <div
        className={twMerge(
          `absolute  z-50 top-[100%] left-0 mt-6 bg-white dark:bg-very-dark-grey p-4 w-[200px] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] rounded-lg transition-all duration-300 origin-top-left ${
            isVisible
              ? "opacity-1 visible scale-100 translate-y-0"
              : "opacity-0 invisible scale-50 -translate-y-1"
          }`,
          className
        )}
      >
        <p
          onClick={handleFirstClick}
          className={`body-l ${firstOptionColor}  mb-4 text-nowrap hover:underline cursor-pointer`}
        >
          {firstOptionText}
        </p>
        <p
          onClick={handleSecondClick}
          className={`body-l ${secondOptionColor} text-nowrap hover:underline cursor-pointer`}
        >
          {secondOptionText}
        </p>
      </div>
    </div>
  );
};

export default VerticalEllipsisPanel;
