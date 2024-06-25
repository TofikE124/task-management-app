import React from "react";
import logoDark from "/public/images/logo-dark.svg";
import logoLight from "/public/images/logo-light.svg";
import hideSidebar from "/public/images/icon-hide-sidebar.svg";
import Image from "next/image";
import ThemeSwitch from "../components/ThemeSwitch";

const Sidebar = () => {
  return (
    <div className="bg-white dark:bg-dark-grey h-full border-r border-linkes-light dark:border-linkes-dark">
      <div className="flex flex-col py-8 pr-6 h-full">
        <div className="pl-8">
          <Image
            width={152}
            height={25}
            alt="Logo Dark"
            src={logoDark}
            className="hidden dark:block"
          />
          <Image
            width={152}
            height={25}
            alt="Logo Light"
            src={logoLight}
            className="dark:hidden"
          />
        </div>
        <div className="pl-8 mt-14">
          <p className="heading-s uppercase mb-5 text-medium-grey dark:text-white">
            All Boards (8){" "}
          </p>
          <div className="flex flex-col gap-3"></div>
        </div>
        <div className="pl-6 flex flex-col  gap-5 mt-auto">
          <ThemeSwitch></ThemeSwitch>
          <div className="flex items-center gap-4 cursor-pointer">
            <Image width={18} height={16} alt="Hide Icon" src={hideSidebar} />
            <p className="heading-m text-medium-grey">Hide Sidebar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
