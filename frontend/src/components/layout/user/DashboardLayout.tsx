import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar contains its own 'spacer' div internally. 
        By using 'flex' on the parent container, the spacer in Sidebar.tsx 
        will push the following div (Navbar + Main) to the right correctly.
      */}
      <Sidebar />

      {/* 1. flex-1: Takes up all remaining width after the sidebar spacer.
        2. flex-col: Stacks TopNavbar and Main content vertically.
        3. min-w-0: Prevents flex-box overflow issues on smaller screens.
      */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        <TopNavbar />
        
        <main className="flex-1 p-6 transition-all duration-300">
          <div className="animate-fade-in">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}