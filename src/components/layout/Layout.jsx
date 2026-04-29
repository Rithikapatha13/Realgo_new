import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

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
            <Sidebar collapsed={false} setCollapsed={() => { }} />
          </div>
        </>
      )}

      {/* Main Content (shifted right when desktop sidebar exists) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden min-w-0
        ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"}`}
      >
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 px-1 sm:px-2 py-4 min-w-0 relative">
          {/* Global Back Button on Main Container */}
          {!isDashboard && (
            <button
              onClick={() => navigate(-1)}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-[#160a70] text-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(22,10,112,0.4)] hover:bg-[#2516a3] transition-all group font-bold text-[10px] uppercase tracking-[0.15em]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
