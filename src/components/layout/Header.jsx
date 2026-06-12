import { Menu, Search, User, X, Bell } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuByRole } from "../../constants/sidebar";
import { getUser } from "../../services/auth.service";
import { resolveImageUrl } from "../../utils/common";
import { getNotifications } from "../../services/common.service";
import { cleanupPushNotifications } from "../../services/push.service";

export default function Header({
  onMenuClick,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = getUser();
  const userRole = user?.role || "associate";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 40000); // poll every 40s
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      setShowNotificationPopup(true);
      const timer = setTimeout(() => {
        setShowNotificationPopup(false);
      }, 8000);
      setPrevUnreadCount(unreadCount);
      return () => clearTimeout(timer);
    } else {
      setPrevUnreadCount(unreadCount);
    }
  }, [unreadCount]);

  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
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
            onClick={() => {
              navigate("/notifications");
              setShowNotificationPopup(false);
            }}
            className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors group"
          >
            <Bell size={20} className="text-slate-600 group-hover:text-primary-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* New Notification Popup/Tooltip */}
          {showNotificationPopup && unreadCount > 0 && (
            <div 
              onClick={() => {
                navigate("/notifications");
                setShowNotificationPopup(false);
              }}
              className="absolute right-0 top-12 w-64 bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer hover:bg-slate-950 transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black tracking-wider text-rose-400 uppercase">Alert</p>
                  <p className="text-[11px] text-slate-100 mt-1 leading-normal font-bold">
                    You have {unreadCount} new notification{unreadCount > 1 ? 's' : ''}. Go and check them!
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotificationPopup(false);
                  }}
                  className="text-slate-400 hover:text-slate-200 p-0.5 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-slate-800" />
            </div>
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
                  onClick={async () => {
                    await cleanupPushNotifications().catch(err => console.error(err));
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
