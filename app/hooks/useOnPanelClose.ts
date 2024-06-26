import { useEffect } from "react";
import { PANELS } from "../constatnts/panels";
import { usePanel } from "../contexts/PanelProvider";

export const useOnPanelClose = (panelName: PANELS, callback: () => void) => {
  const { isPanelOpen } = usePanel();

  useEffect(() => {
    if (!isPanelOpen(PANELS.NEW_BOARD_PANEL)) callback();
  }, [isPanelOpen(PANELS.NEW_BOARD_PANEL)]);
};
