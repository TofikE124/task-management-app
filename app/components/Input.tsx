import React, { ComponentProps, forwardRef, LegacyRef } from "react";

interface Props {
  errorMessage?: string;
}
const Input = forwardRef(
  (
    { errorMessage, placeholder, ...props }: Props & ComponentProps<"input">,
    ref
  ) => {
    return (
      <div
        className={`flex w-full items-center border rounded-[4px] py-2 px-4 ${
          errorMessage ? "border-red" : "border-medium-grey-25"
        }`}
      >
        <input
          className={` bg-white dark:bg-dark-grey outline-none grow ${
            errorMessage ? "text-red" : "text-black dark:text-white"
          }`}
          placeholder={placeholder}
          ref={ref as LegacyRef<HTMLInputElement>}
          {...props}
        />
        <p className="body-l text-red">{errorMessage}</p>
      </div>
    );
  }
);

export default Input;
