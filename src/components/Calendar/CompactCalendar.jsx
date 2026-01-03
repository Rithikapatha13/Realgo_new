import { useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default function CompactCalendar({
  title = "Plot bookings",
  footerText = "↑ Increased to 9.6%",
  percent = "62%",
}) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDate = startOfMonth.weekday(0);
  const endDate = endOfMonth.weekday(6);

  const days = [];
  let day = startDate;

  while (day.isBefore(endDate)) {
    days.push(day);
    day = day.add(1, "day");
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          ‹
        </button>

        <p className="text-sm font-semibold text-slate-800">
          {currentMonth.format("MMMM YYYY")}
        </p>

        <button
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          ›
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-[11px] text-slate-500 mb-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          const isToday = day.isSame(dayjs(), "day");
          const isCurrentMonth = day.isSame(currentMonth, "month");

          return (
            <div
              key={idx}
              className={`h-8 flex items-center justify-center rounded-md text-xs cursor-pointer
                ${
                  isToday
                    ? "bg-indigo-500 text-white"
                    : isCurrentMonth
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-slate-400"
                }`}
            >
              {day.format("D")}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>
          <p className="text-xs text-emerald-600">
            {footerText}
          </p>
        </div>

        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xs font-semibold text-indigo-600">
            {percent}
          </span>
        </div>
      </div>
    </div>
  );
}
