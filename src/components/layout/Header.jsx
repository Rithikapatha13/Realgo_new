import { Menu, Search, User, X, Bell } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuByRole } from "../../constants/sidebar";

export default function Header({
  onMenuClick,
  userRole = "admin",
  userName = "Admin User",
}) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Get page title/subtitle from sidebar config
  const getPageInfo = useMemo(() => {
    const currentPath = location.pathname;
    const menu = getMenuByRole(userRole);

    const findInMenu = (items) => {
      for (const item of items) {
        if (item.link === currentPath) {
          return {
            title: item.pageTitle || item.label,
            subtitle: item.subtitle || "",
          };
        }

        if (item.children) {
          const found = findInMenu(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return (
      findInMenu(menu) || {
        title: "Dashboard",
        subtitle: "Welcome back",
      }
    );
  }, [location.pathname, userRole]);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-lg font-semibold text-slate-900">
            {getPageInfo.title}
          </p>
          <p className="text-xs text-slate-500">{getPageInfo.subtitle}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-100 rounded-lg"
          >
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-medium text-sm">Notifications</h3>
                </div>
                {[
                  { title: "New student enrolled", time: "2 minutes ago" },
                  { title: "Fee payment received", time: "1 hour ago" },
                  { title: "Attendance marked", time: "3 hours ago" },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-slate-50 border-b last:border-0 cursor-pointer"
                  >
                    <p className="text-sm">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1 border-l border-slate-200 hover:bg-slate-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-slate-500 capitalize">{userRole}</p>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />

              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 z-20 overflow-hidden">
                <button
                  className="w-full px-4 py-2 text-sm text-left hover:bg-slate-50"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                >
                  View Profile
                </button>

                <button
                  className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/auth/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
