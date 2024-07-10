"use client";
import { QuickActionItems } from "@/app/constatnts/QuickActionItems";
import { RiInsertColumnLeft } from "react-icons/ri";
import QuickActionItem from "../QuickActionItem";
import { useAddColumnContext } from "@/app/hooks/useAddColumnContext";

const ColumnAddQuickAction = () => {
  const { show } = useAddColumnContext();

  return (
    <QuickActionItem
      name={QuickActionItems.COLUMN_ADD}
      activeClass="border-main-purple bg-main-purple-hover dark:text-red-hover"
      idleClass="bg-white dark:bg-dark-grey"
      activeItem={
        <RiInsertColumnLeft className="animate-bounce text-[50px] text-white pointer-events-none"></RiInsertColumnLeft>
      }
      idleItem={
        <RiInsertColumnLeft className="text-[30px] text-main-purple dark:text-white"></RiInsertColumnLeft>
      }
      noDrag
      onClick={show}
    ></QuickActionItem>
  );
};

export default ColumnAddQuickAction;
