import Icon from "@/app/components/Icon";

const SidebarCreateNewBoard = () => {
  return (
    <div className="relative cursor-pointer group select-none">
      <div className="flex gap-4 relative z-20">
        <Icon
          width={16}
          height={16}
          src="/images/icon-board.svg"
          bgColorClass="bg-main-purple"
        ></Icon>
        <h3 className="heading-m text-main-purple">+ Create New Board</h3>
      </div>
    </div>
  );
};

export default SidebarCreateNewBoard;
