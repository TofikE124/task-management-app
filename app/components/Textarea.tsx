import React, { ComponentProps, forwardRef, LegacyRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  errorMessage?: string;
}

const Textarea = forwardRef(
  (
    {
      errorMessage,
      placeholder,
      className,
      ...props
    }: Props & ComponentProps<"textarea">,
    ref
  ) => {
    return (
      <div className="space-y-1 w-full">
        <div
          className={`border rounded-[4px] py-2 px-4 ${
            errorMessage ? "border-red" : "border-medium-grey-25 "
          }`}
        >
          <textarea
            className={twMerge(
              `bg-white dark:bg-dark-grey outline-none w-full  ${
                errorMessage ? "text-red" : "text-black dark:text-white"
              }`,
              className
            )}
            placeholder={placeholder}
            ref={ref as LegacyRef<HTMLTextAreaElement>}
            {...props}
          />
        </div>
        <p className="body-l text-red">{errorMessage}</p>
      </div>
    );
  }
);

Textarea.displayName = "MyTextArea";

export default Textarea;
