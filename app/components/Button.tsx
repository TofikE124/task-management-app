import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  ["transition-colors", "duration-200", "text-nowrap", "cursor-pointer"],
  {
    variants: {
      variant: {
        primary: [
          "text-white",
          "bg-main-purple",
          "hover:enabled:bg-main-purple-hover",
        ],
        secondary: [
          "text-main-purple",
          "bg-main-purple",
          "hover:enabled:bg-main-purple-25",
          "dark:bg-white",
          "dark:hover:enabled:bg-white-hover",
        ],
        destructive: ["text-white", "bg-red", "hover:enabled:bg-red-hover"],
      },
      size: {
        lg: ["py-4", "px-6", "rounded-3xl"],
        sm: ["py-2", "px-4", "rounded-[20px]"],
      },
    },
    defaultVariants: { size: "lg", variant: "primary" },
  }
);

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

const Button = ({
  variant,
  size,
  className,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      {...props}
      className={twMerge(
        buttonStyles({ variant, size }),
        className,
        `${disabled ? "opacity-50 cursor-not-allowed" : ""}`
      )}
    ></button>
  );
};

export default Button;
