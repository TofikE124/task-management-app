"use client";
import { useTheme } from "next-themes";
import { PropsWithChildren, Suspense } from "react";
import useMountStatus from "../hooks/useMountStatus";

const ThemeWrapper = ({ children }: PropsWithChildren) => {
  const { resolvedTheme } = useTheme();
  const mounted = useMountStatus();

  return (
    <Suspense>
      <div className={`${resolvedTheme == "dark" && mounted ? "dark" : ""}`}>
        {children}
      </div>
    </Suspense>
  );
};

export default ThemeWrapper;
