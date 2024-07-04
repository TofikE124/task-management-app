import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { HTMLMotionProps, motion, MotionProps } from "framer-motion";

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
          "bg-main-purple-10",
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

export type ButtonVaraiants = VariantProps<typeof buttonStyles>;

type ButtonProps = ButtonVaraiants &
  ComponentProps<"button"> & { isMotion?: boolean };

export const Button = ({
  variant,
  size,
  className,
  disabled = false,
  isMotion = false,
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

type MotionButtonProps = VariantProps<typeof buttonStyles> &
  HTMLMotionProps<"button">;

export const MotionButton = ({
  variant,
  size,
  className,
  disabled = false,
  ...props
}: MotionButtonProps) => {
  return (
    <motion.button
      disabled={disabled}
      {...props}
      className={twMerge(
        buttonStyles({ variant, size }),
        className,
        `${disabled ? "opacity-50 cursor-not-allowed" : ""}`
      )}
    ></motion.button>
  );
};
