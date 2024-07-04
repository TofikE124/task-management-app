import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import AddColumnProvider from "../contexts/AddColumnProvider";
import DeleteProvider from "../contexts/deleteProvider";
import DragProvider from "../contexts/DragProvider";
import { PanelProvider } from "../contexts/PanelProvider";
import QuickActionSidebarProvider from "../contexts/QuickActionSidebarProvider";
import SidebarProvider from "../contexts/SidebarProvider";
import { TaskDataProvider } from "../contexts/TskDataProvider";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "../contexts/AuthProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default Providers;
