import BurnBarrelQuickAction from "./quickActionItems/BurnBarrelQuickAction";
import ColumnAddQuickAction from "./quickActionItems/ColumnAddQuickAction";

const QuickActionSidebar = () => {
  return (
    <div className="flex flex-col fixed right-0 top-[50%] translate-y-[-50%]">
      <BurnBarrelQuickAction></BurnBarrelQuickAction>
      <ColumnAddQuickAction></ColumnAddQuickAction>
    </div>
  );
};

export default QuickActionSidebar;
