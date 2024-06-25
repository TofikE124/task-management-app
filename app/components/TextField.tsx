import { title } from "process";
import React from "react";

interface TextFieldProps {
  title: string;
  placeholder: string;
  defaultValue?: string;
  errorMessage?: string;
}

const TextField = ({
  title,
  placeholder,
  defaultValue,
  errorMessage,
}: TextFieldProps) => {
  return (
    <div className="flex flex-col gap-2 max-w-[350px]">
      <p className="text-medium-grey dark:text-white">{title}</p>
      <div
        className={`flex items-center border rounded-[4px] py-2 px-4 ${
          errorMessage ? "border-red" : "border-medium-grey-25"
        }`}
      >
        <input
          className={` bg-transparent outline-none grow ${
            errorMessage ? "text-red" : "text-black dark:text-white"
          }`}
          placeholder={placeholder}
        />
        <p className="body-l text-red">{errorMessage}</p>
      </div>
    </div>
  );
};

export default TextField;
