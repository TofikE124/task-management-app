import { PropsWithChildren } from "react";
import { useSidebar } from "../hooks/useSidebarProvider";

const MainContent = ({ children }: PropsWithChildren) => {
  const { isVisible } = useSidebar();

  return (
    <div
      className={`flex flex-col w-full col-end-3 transition-[width] duration-500 overflow-hidden  ${
        isVisible ? "w-[calc(100vw-300px)]" : "w-screen"
      }`}
    >
      {children}
    </div>
  );
};

export default MainContent;
