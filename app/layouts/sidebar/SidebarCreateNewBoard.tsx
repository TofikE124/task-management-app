import Icon from "@/app/components/Icon";
import BoardFormPanel from "@/app/components/panels/BoardFormPanel";
import { PANELS } from "@/app/constatnts/panels";
import { usePanel } from "@/app/contexts/PanelProvider";

const SidebarCreateNewBoard = () => {
  const { openPanel } = usePanel();
  return (
    <>
      <div
        onClick={() => openPanel(PANELS.BOARD_FORM_PANEL)}
        className="relative cursor-pointer group select-none"
      >
        <div className="flex gap-4 py-4 relative z-20">
          <Icon
            width={16}
            height={16}
            src="/images/icon-board.svg"
            bgColorClass="bg-main-purple"
          ></Icon>
          <h3 className="heading-m text-main-purple">+ Create New Board</h3>
        </div>
      </div>
    </>
  );
};

export default SidebarCreateNewBoard;
