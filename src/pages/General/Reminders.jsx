import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, X, Edit, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useGetRemindersData, useGetTodaysReminders, useDeleteReminder } from "../../hooks/useReminder";
import ReminderFormDialog from "../../components/General/ReminderFormDialog";
import { format, parseISO } from "date-fns";

const Reminders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reminderAction, setReminderAction] = useState("Create");
  const [editItemId, setEditItemId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const pageSize = 20;

  const {
    data: reminderResponse,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetRemindersData(pageSize, searchQuery, typeFilter);

  const { data: todayReminders, isLoading: isLoadingToday, refetch: refetchToday } = useGetTodaysReminders();
  const deleteReminderMutation = useDeleteReminder();

  useEffect(() => {
    refetch();
    refetchToday();
  }, [searchQuery, typeFilter, refetch, refetchToday]);

  const reminderData = reminderResponse?.pages.flatMap((page) => page.items) || [];
  const todaysData = todayReminders?.reminders || [];

  const handleEdit = (id) => {
    setEditItemId(id);
    setReminderAction("Update");
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditItemId(null);
    setReminderAction("Create");
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await deleteReminderMutation.mutateAsync(id);
        toast.success("Reminder deleted successfully");
        refetch();
        refetchToday();
      } catch (error) {
        toast.error("Failed to delete reminder");
        console.error(error);
      }
    }
  };

  const timeInAMPM = (timeString) => {
    if (!timeString) return "";
    try {
      const time = parseISO(`2000-01-01T${timeString}`);
      return format(time, "h:mm a");
    } catch (e) {
      return timeString;
    }
  };

  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const reminderTypes = ["Call", "Meet", "Follow-up", "Site visit", "Balance Payment", "Team Meeting", "Others"];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reminders</h1>
          <p className="text-sm font-medium text-slate-500">
            Never miss an important follow-up
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* ═══════════ FILTERS ═══════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-slate-700"
        >
          <option value="all">All Types</option>
          {reminderTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
        {(searchQuery || typeFilter !== "all") && (
          <button
            onClick={() => { setSearchQuery(""); setTypeFilter("all"); }}
            className="text-sm text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
          >
            <X size={16} /> Clear
          </button>
        )}
      </div>

      {/* ═══════════ CONTENT ═══════════ */}
      {(isLoading || isLoadingToday) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10 font-medium">Error loading reminders.</div>
      ) : (
        <div className="space-y-10">
          
          {/* Today's Reminders Section */}
          {todaysData.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock className="text-orange-500" size={20} />
                Today's Reminders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todaysData.map((reminder) => (
                  <div key={`today-${reminder.id}`} className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {(reminder.type || []).join(", ")}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-700">{reminder.date ? format(new Date(reminder.date), "dd MMM yyyy") : ""}</p>
                          <p className="text-xs font-medium text-slate-500">{timeInAMPM(reminder.time)}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mt-3 line-clamp-3">{reminder.description}</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-orange-200/50">
                      <button onClick={() => handleEdit(reminder.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(reminder.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Reminders Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">All Reminders</h2>
            {reminderData.length === 0 ? (
              <div className="text-center text-slate-500 py-10 font-medium">No reminders found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminderData.map((reminder, index) => (
                  <div
                    key={reminder.id}
                    ref={index === reminderData.length - 1 ? observerRef : null}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {(reminder.type || []).join(", ")}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-700">{reminder.date ? format(new Date(reminder.date), "dd MMM yyyy") : ""}</p>
                          <p className="text-xs font-medium text-slate-500">{timeInAMPM(reminder.time)}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm mt-3 line-clamp-3">{reminder.description}</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                      <button onClick={() => handleEdit(reminder.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(reminder.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {isFetchingNextPage && (
                  <div className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showDialog && (
        <ReminderFormDialog
          action={reminderAction}
          editId={editItemId}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default Reminders;
