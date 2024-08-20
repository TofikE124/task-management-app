import { PropsWithChildren } from "react";
import AddColumnProvider from "../contexts/AddColumnProvider";
import AuthProvider from "../contexts/AuthProvider";
import { CurrentBoardProvider } from "../contexts/CurrentBoardProvider";
import DeleteProvider from "../contexts/deleteProvider";
import DragProvider from "../contexts/DragProvider";
import { LoadingProvider } from "../contexts/LoadingProvider";
import { PanelProvider } from "../contexts/PanelProvider";
import QuickActionSidebarProvider from "../contexts/QuickActionSidebarProvider";
import SidebarProvider from "../contexts/SidebarProvider";
import { TaskDataProvider } from "../contexts/TaskDataProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <LoadingProvider>
      <CurrentBoardProvider>
        <PanelProvider>
          <SidebarProvider>
            <QuickActionSidebarProvider>
              <TaskDataProvider>
                <AddColumnProvider>
                  <DragProvider>
                    <AuthProvider>
                      <DeleteProvider>{children}</DeleteProvider>
                    </AuthProvider>
                  </DragProvider>
                </AddColumnProvider>
              </TaskDataProvider>
            </QuickActionSidebarProvider>
          </SidebarProvider>
        </PanelProvider>
      </CurrentBoardProvider>
    </LoadingProvider>
  );
};

export default Providers;
