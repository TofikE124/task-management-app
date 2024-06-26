import React, { forwardRef } from "react";
import Input from "./Input";

interface TextFieldProps {
  title: string;
  placeholder: string;
  defaultValue?: string;
  errorMessage?: string;
}

const TextField = forwardRef(
  (
    {
      title,
      placeholder,
      defaultValue,
      errorMessage,
      ...props
    }: TextFieldProps,
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-medium-grey dark:text-white">{title}</p>
        <Input
          {...props}
          ref={ref}
          errorMessage={errorMessage}
          placeholder={placeholder}
        ></Input>
      </div>
    );
  }
);

export default TextField;
