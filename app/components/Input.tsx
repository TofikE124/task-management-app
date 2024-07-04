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
      <div className="space-y-1">
        <div
          className={`py-2 px-4 border rounded-[4px]  ${
            errorMessage ? "border-red" : "border-medium-grey-25"
          }`}
        >
          <input
            className={` bg-white dark:bg-dark-grey outline-none w-full ${
              errorMessage ? "text-red" : "text-black dark:text-white"
            }`}
            placeholder={placeholder}
            ref={ref as LegacyRef<HTMLInputElement>}
            {...props}
          />
        </div>
        <p className="body-l text-red">{errorMessage}</p>
      </div>
    );
  }
);

export default Input;
