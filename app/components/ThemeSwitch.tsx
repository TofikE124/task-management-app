"use client";
import Image from "next/image";
import React from "react";

import darkTheme from "/public/images/icon-dark-theme.svg";
import lightTheme from "/public/images/icon-light-theme.svg";
import Switch from "./Switch";
import { useTheme } from "next-themes";
import useMountStatus from "../hooks/useMountStatus";
import { useLoading } from "../contexts/LoadingProvider";
import LoadingSkeleton from "./LoadingSkeleton";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

const ThemeSwitch = () => {
  const mounted = useMountStatus();
  const { resolvedTheme, setTheme } = useTheme();
  const { loading } = useLoading();

  if (loading && mounted) return <ThemeSwitchLoading></ThemeSwitchLoading>;

  return (
    <div
      key={mounted ? 1 : 0}
      className="py-4 w-[250px] rounded-md flex justify-center gap-6 bg-light-grey dark:bg-very-dark-grey"
    >
      <Image width={18} height={18} alt="Light Theme icon" src={lightTheme} />
      <Switch
        defaultChecked={resolvedTheme == "dark"}
        onChange={(value) => setTheme(value ? "dark" : "light")}
      ></Switch>
      <Image width={18} height={18} alt="Dark Theme icon" src={darkTheme} />
    </div>
  );
};

const ThemeSwitchLoading = () => {
  const { resolvedTheme } = useTheme();
  const { theme } = resolveConfig(tailwindConfig);
  const colors = theme.colors as any;

  return (
    <LoadingSkeleton
      width="100%"
      height="48px"
      baseColor={`${
        resolvedTheme == "dark" ? colors["charcoal-grey"] : colors["light-grey"]
      }`}
      highlightColor={`${
        resolvedTheme == "dark"
          ? colors["charcoal-grey-highlight"]
          : colors["light-grey-highlight"]
      }`}
      borderRadius={6}
    ></LoadingSkeleton>
  );
};

export default ThemeSwitch;
