import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { getMenuByRole } from "../../constants/sidebar";
import { useNavigate } from "react-router-dom";
import { delay, resolveImageUrl } from "../../utils/common";
import {
  getUser,
  getUserType,
} from "../../services/auth.service";

export default function Sidebar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState({});
  const [activeLink, setActiveLink] = useState("/dashboard");
  const navigate = useNavigate();
  const user = getUser();
  const userType = getUserType()?.toLowerCase();
  const isSuperAdmin = userType === "superadmin" || user?.role?.toLowerCase() === "superadmin" || userType === "super-admin";
  const rawSidebarMenu = getMenuByRole(isSuperAdmin ? "superadmin" : user?.role || "associate");

  // Filter menu based on company modules
  const companyModules = user?.company?.modules || [];
  const sidebarMenu = rawSidebarMenu.filter((item) => {
    // SuperAdmin or ALWAYS visible modules
    if (isSuperAdmin || item.module === "GENERAL" || item.module === "SYSTEM") return true;
    
    // Check if module is enabled for company
    return companyModules.includes(item.module);
  });

  const toggleSection = (label) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div
      className={`h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="h-fit px-4 flex items-center justify-between border-b border-slate-200">
        {!collapsed && (
          <div className="h-20 w-full sm:h-25 px-2 rounded-lg flex items-center justify-center">
            {isSuperAdmin ? (
              <img
                src="https://app.realgo.in/assets/images/brandwar.png"
                alt="Brandwar logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <img
                src={resolveImageUrl(user?.companyImg)}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-3">
        <div className="space-y-1">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.link;

            if (!item.children) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.link);
                    setActiveLink(item.link);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${isActive
                    ? "bg-primary-500/10 text-primary-500 border-l-4 border-secondary-500"
                    : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  title={collapsed ? item.label : ""}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary-500" : "text-slate-500"}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSection(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors group"
                  title={collapsed ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-slate-500" />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && (
                    <div className="transition-transform duration-200">
                      {open[item.label] ? (
                        <ChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {open[item.label] && !collapsed && (
                  <div className=" mt-1 space-y-1 pl-6 border-l border-slate-200">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = activeLink === child.link;
                      return (
                        <button
                          key={child.label}
                          onClick={() => {
                            navigate(child.link);
                            setActiveLink(child.link);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-md transition-colors ${isChildActive
                            ? "bg-primary-500/10 text-primary-500 font-medium"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                          <ChildIcon
                            size={16}
                            className={
                              isChildActive
                                ? "text-primary-500"
                                : "text-slate-400"
                            }
                          />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
