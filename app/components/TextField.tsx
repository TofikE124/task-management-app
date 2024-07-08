import React, { ComponentProps, forwardRef } from "react";
import Input from "./Input";
import Textarea from "./Textarea";

interface TextFieldProps {
  title: string;
  textarea?: boolean;
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
      textarea,
      ...props
    }: TextFieldProps & ComponentProps<"input"> & ComponentProps<"textarea">,
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <p className="text-medium-grey dark:text-white">{title}</p>
        {textarea ? (
          <Textarea
            ref={ref}
            errorMessage={errorMessage}
            placeholder={placeholder}
            {...props}
          ></Textarea>
        ) : (
          <Input
            ref={ref}
            errorMessage={errorMessage}
            placeholder={placeholder}
            {...props}
          ></Input>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
