import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateReminder, useUpdateReminder, useGetReminderById } from "../../hooks/useReminder";

const ReminderFormDialog = ({ action, editId, onClose }) => {
  const [type, setType] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const { data: reminderResponse, isLoading } = useGetReminderById(editId);
  const createMutation = useCreateReminder();
  const updateMutation = useUpdateReminder();

  useEffect(() => {
    if (action === "Update" && reminderResponse?.reminder) {
      const r = reminderResponse.reminder;
      setType(r.type || []);
      setDescription(r.description || "");
      if (r.date) {
        // Date comes as a string like "2023-10-25 00:00:00+05:30", extract just YYYY-MM-DD
        try {
          const formattedDate = r.date.split(" ")[0] || r.date.split("T")[0];
          setDate(formattedDate);
        } catch (e) {
          setDate(r.date);
        }
      }
      setTime(r.time || "");
      setRepeat(r.repeat || "");
      setSelectedDays(r.selectedDays || []);
    }
  }, [action, reminderResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || type.length === 0 || !date || !time) {
      toast.error("Please fill all required fields");
      return;
    }

    if (repeat === "Weekly" && selectedDays.length === 0) {
      toast.error("Please select at least one day for weekly repeat");
      return;
    }

    try {
      const formattedDate = `${date} 00:00:00+05:30`;
      
      const payload = {
        type,
        description,
        date: formattedDate,
        time,
        repeat,
        selectedDays: repeat === "Weekly" ? selectedDays : []
      };

      if (action === "Create") {
        await createMutation.mutateAsync(payload);
        toast.success("Reminder created successfully");
      } else {
        await updateMutation.mutateAsync({ id: editId, ...payload });
        toast.success("Reminder updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} reminder`);
      console.error(error);
    }
  };

  const handleTypeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setType(value);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const reminderTypes = ["Call", "Meet", "Follow-up", "Site visit", "Balance Payment", "Team Meeting", "Others"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {action} Reminder
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Fill in the details below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading && action === "Update" ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : (
            <form id="reminder-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Type <span className="text-red-500">*</span></label>
                <select
                  multiple
                  value={type}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium h-32"
                  required
                >
                  {reminderTypes.map((rt) => (
                    <option key={rt} value={rt} className="py-1">{rt}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter reminder details"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Repeat</label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                >
                  <option value="">No Repeat</option>
                  <option value="Everyday">Everyday</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              {repeat === "Weekly" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Select Days <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedDays.includes(day)
                            ? "bg-slate-900 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="reminder-form"
            disabled={createMutation.isPending || updateMutation.isPending || (isLoading && action === "Update")}
            className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {action === "Create" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderFormDialog;
