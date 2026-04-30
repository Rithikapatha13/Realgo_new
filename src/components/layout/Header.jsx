import { Menu, Search, User, X, Bell, ArrowLeft } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuByRole } from "../../constants/sidebar";
import { getUser } from "../../services/auth.service";
import { resolveImageUrl } from "../../utils/common";

export default function Header({
  onMenuClick,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = getUser();
  const userRole = user?.role || "associate";

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

  const isAssociate = (user?.role || user?.roleName || "").toLowerCase().includes("associate") && !user?.userType?.includes("admin");
  const canAddAssociate = !isAssociate || user?.userType === "superadmin";

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
        {/* Add Associate Button */}
        {canAddAssociate && (
          <button
            onClick={() => navigate("/users/add")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-primary-100 active:scale-95 whitespace-nowrap"
          >
            <User size={16} />
            <span>Add Associate</span>
          </button>
        )}

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
            className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
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
            className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors group"
          >
            <Bell size={20} className="text-slate-600 group-hover:text-primary-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-3 border-b bg-slate-50/50">
                  <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="px-4 py-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={20} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
              {user?.image ? (
                <img
                  src={resolveImageUrl(user.image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-secondary-500" />
              )}
            </div>
            <div className="hidden md:block text-left leading-tight pr-2">
              <p className="text-sm font-bold text-slate-800 line-clamp-1">
                {(user?.firstName || user?.lastName) 
                  ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() 
                  : (user?.userName || "Guest")}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {user?.role === "COMPANY_ADMIN" ? "CLIENT_ADMIN" : (user?.role || "associate")}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-3 border-b bg-slate-50/50 md:hidden">
                   <p className="text-sm font-bold text-slate-800">
                    {user?.userName || "User"}
                  </p>
                </div>
                <button
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                >
                  <User size={14} className="text-slate-400" />
                  View Profile
                </button>

                <div className="h-px bg-slate-100 mx-2" />

                <button
                  className="w-full px-4 py-2.5 text-sm text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/auth/login");
                  }}
                >
                  <X size={14} />
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
