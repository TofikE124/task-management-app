"use client";
import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";
import useMountStatus from "../hooks/useMountStatus";

const ThemeWrapper = ({ children }: PropsWithChildren) => {
  const { resolvedTheme } = useTheme();
  const mounted = useMountStatus();

  return (
    <div className={`${resolvedTheme == "dark" && mounted ? "dark" : ""}`}>
      {children}
    </div>
  );
};

export default ThemeWrapper;
