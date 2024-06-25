import React from "react";
import Button from "../components/Button";
import dotsIcon from "/public/images/icon-vertical-ellipsis.svg";
import Image from "next/image";

const PageHeader = () => {
  return (
    <div className="bg-white dark:bg-dark-grey border-b border-linkes-light dark:border-linkes-dark">
      <div className="flex items-center justify-between py-5 px-6 w-full">
        <h2 className="heading-xl text-black dark:text-white">
          Platfrom Launch
        </h2>
        <div className="flex items-center gap-5">
          <Button variant="primary" size="sm" disabled>
            + Add New Task
          </Button>
          <div className="cursor-pointer px-[6px] select-none">
            <Image src={dotsIcon} width={4} height={20} alt="Dots icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
