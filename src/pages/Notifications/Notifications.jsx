import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  ArrowLeft, 
  UserPlus, 
  ArrowLeftRight, 
  CheckCircle, 
  Search, 
  X, 
  Loader2, 
  Calendar, 
  Clock, 
  Sparkles,
  CheckCheck
} from "lucide-react";
import { getNotifications, markNotificationsRead } from "../../services/common.service";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters
  const [filterTab, setFilterTab] = useState("all"); // "all", "unread", "leads"
  const [filterQuery, setFilterQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(20);

  const fetchNotifications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 40 seconds
    const interval = setInterval(() => fetchNotifications(false), 40000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      setRefreshing(true);
      await markNotificationsRead();
      await fetchNotifications();
    } catch (err) {
      console.error("Error marking notifications as read", err);
    } finally {
      setRefreshing(false);
    }
  };

  // 1. Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Tab filter
      if (filterTab === "unread" && n.isRead) return false;
      if (filterTab === "leads" && !["LEAD_ASSIGNMENT", "LEAD_TRANSFER", "LEAD_OUTCOME_UPDATE", "PLOT_BOOKED"].includes(n.notificationType)) return false;

      // Search query filter
      if (filterQuery) {
        const query = filterQuery.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(query) || false;
        const matchesBody = n.body?.toLowerCase().includes(query) || false;
        return matchesTitle || matchesBody;
      }
      return true;
    });
  }, [notifications, filterTab, filterQuery]);

  // 2. Group by date
  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const older = [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const visibleItems = filteredNotifications.slice(0, displayLimit);

    visibleItems.forEach(n => {
      const date = new Date(n.createdAt);
      if (date >= startOfToday) {
        today.push(n);
      } else if (date >= startOfYesterday) {
        yesterday.push(n);
      } else {
        older.push(n);
      }
    });

    return { today, yesterday, older };
  }, [filteredNotifications, displayLimit]);

  // Icon mapping
  const getNotificationIcon = (type) => {
    switch (type) {
      case "LEAD_ASSIGNMENT":
        return {
          icon: <UserPlus size={18} className="text-blue-600" />,
          bgColor: "bg-blue-50 border border-blue-100",
        };
      case "LEAD_TRANSFER":
        return {
          icon: <ArrowLeftRight size={18} className="text-amber-600" />,
          bgColor: "bg-amber-50 border border-amber-100",
        };
      case "LEAD_OUTCOME_UPDATE":
        return {
          icon: <CheckCircle size={18} className="text-emerald-600" />,
          bgColor: "bg-emerald-50 border border-emerald-100",
        };
      case "PLOT_BOOKED":
        return {
          icon: <CheckCircle size={18} className="text-emerald-600" />,
          bgColor: "bg-emerald-50 border border-emerald-100",
        };
      default:
        return {
          icon: <Bell size={18} className="text-slate-600" />,
          bgColor: "bg-slate-50 border border-slate-100",
        };
    }
  };

  const NotificationRow = ({ n }) => {
    const { icon, bgColor } = getNotificationIcon(n.notificationType);
    const timeStr = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <div
        className={`group p-5 rounded-2xl border transition-all duration-300 flex gap-4 text-left relative ${
          !n.isRead
            ? "bg-white border-primary-100 shadow-sm shadow-primary-50/30 hover:border-primary-200 hover:shadow-md"
            : "bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200"
        }`}
      >
        {/* Left Icon */}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgColor} shadow-sm group-hover:scale-105 transition-transform`}>
          {icon}
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-800 leading-snug">{n.title}</p>
            {!n.isRead && (
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{n.body}</p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-3 font-semibold">
            <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {timeStr}</span>
          </div>
        </div>

        {/* Read Status Ribbon */}
        {!n.isRead && (
          <div className="absolute top-5 right-5 w-2 h-2 bg-primary-500 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-2xl transition-all active:scale-95 flex items-center justify-center"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[9px] font-bold uppercase tracking-widest rounded">Center</span>
                <span className="text-slate-300">/</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inbox</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                Notification Hub
                {unreadCount > 0 && (
                  <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-0.5 rounded-full">
                    {unreadCount} Unread
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={refreshing}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-primary-100 active:scale-95 flex items-center gap-2"
              >
                <CheckCheck size={14} />
                <span>Mark All as Read</span>
              </button>
            )}
            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              {refreshing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {[
              { id: "all", label: "All Logs" },
              { id: "unread", label: "Unread" },
              { id: "leads", label: "CRM / Leads" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterTab(tab.id);
                  setDisplayLimit(20);
                }}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === tab.id
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {tab.label}
                {tab.id === "unread" && unreadCount > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
                    filterTab === "unread" ? "bg-white text-slate-800" : "bg-rose-500 text-white"
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setDisplayLimit(20);
              }}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-xs font-medium transition-all"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Listing */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl p-20 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-wider">Syncing Notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-6">
              {/* Today Group */}
              {groupedNotifications.today.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Today
                  </h4>
                  <div className="space-y-3">
                    {groupedNotifications.today.map(n => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday Group */}
              {groupedNotifications.yesterday.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Yesterday
                  </h4>
                  <div className="space-y-3">
                    {groupedNotifications.yesterday.map(n => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </div>
                </div>
              )}

              {/* Older Group */}
              {groupedNotifications.older.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" /> Older Logs
                  </h4>
                  <div className="space-y-3">
                    {groupedNotifications.older.map(n => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Trigger */}
              {filteredNotifications.length > displayLimit && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                  >
                    Load More Notifications
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-24 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mb-5 shadow-sm text-slate-400">
                <Bell size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your inbox is empty</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed mx-auto">
                {filterQuery 
                  ? "No notification logs matched your current search parameters." 
                  : "We couldn't find any notification logs in this category for you."
                }
              </p>
              {(filterTab !== "all" || filterQuery) && (
                <button
                  onClick={() => { setFilterTab("all"); setFilterQuery(""); }}
                  className="mt-6 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
