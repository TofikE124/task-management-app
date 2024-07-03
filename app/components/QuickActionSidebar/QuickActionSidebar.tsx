import { useDrag } from "@/app/hooks/useDrag";
import BurnBarrelQuickAction from "./quickActionItems/BurnBarrelQuickAction";
import ColumnAddQuickAction from "./quickActionItems/ColumnAddQuickAction";

const QuickActionSidebar = () => {
  const { isDragging } = useDrag();

  return (
    <div
      className={`fixed right-0 top-[50%] translate-y-[-50%] ${
        isDragging ? "w-[200px] py-[60px]" : "w-fit"
      }`}
      data-no-scroll
    >
      <div className="flex flex-col w-fit ml-auto" data-no-scroll>
        <BurnBarrelQuickAction></BurnBarrelQuickAction>
        <ColumnAddQuickAction></ColumnAddQuickAction>
      </div>
    </div>
  );
};

export default QuickActionSidebar;
