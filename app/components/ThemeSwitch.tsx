"use client";
import Image from "next/image";
import React from "react";

import darkTheme from "/public/images/icon-dark-theme.svg";
import lightTheme from "/public/images/icon-light-theme.svg";
import Switch from "./Switch";
import { useTheme } from "next-themes";
import useMountStatus from "../hooks/useMountStatus";

const ThemeSwitch = () => {
  const mounted = useMountStatus();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return <p>Loading...</p>;

  return (
    <div className="py-4 w-[250px] rounded-md flex justify-center gap-6 bg-light-grey dark:bg-very-dark-grey">
      <Image width={18} height={18} alt="Light Theme icon" src={lightTheme} />
      <Switch
        defaultChecked={resolvedTheme == "dark"}
        onChange={(value) => setTheme(value ? "dark" : "light")}
      ></Switch>
      <Image width={18} height={18} alt="Dark Theme icon" src={darkTheme} />
    </div>
  );
};

export default ThemeSwitch;
