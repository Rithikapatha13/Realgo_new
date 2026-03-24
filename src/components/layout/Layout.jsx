import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar (fixed) */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-30">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-screen z-50">
            <Sidebar collapsed={false} setCollapsed={() => {}} />
          </div>
        </>
      )}

      {/* Main Content (shifted right when desktop sidebar exists) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden
        ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-2">{children}</main>
      </div>
    </div>
  );
}
