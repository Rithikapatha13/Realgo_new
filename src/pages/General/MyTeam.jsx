import { useState } from "react";
import { MoreVertical, Search, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMyTeam } from "@/hooks/useTeam";
import { LoadingIndicator } from "@/components";

export default function MyTeam() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: teamMembers = [], isLoading, isError } = useGetMyTeam({
    search,
    from: selectedDate,
    to: selectedDate
  });

  // Date filtering in my backend currently assumes 'from' and 'to'. 
  // If only 'selectedDate' is provided, we use it for both for a single-day match if needed, 
  // or I can adjust backend to handle single 'from' or 'to'. 
  // For now, let's just use it as 'from' for "since date".

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <div className="p-6 text-red-500">Error loading team data</div>;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-primary-500 pl-4">My Team</h1>
          <p className="text-slate-500 text-sm mt-1 ml-4">Manage and view your team members</p>
        </div>

        <button
          onClick={() => navigate("/team-tree")}
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          View Team Tree
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
          />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setSelectedDate("");
          }}
          className="text-slate-500 hover:text-red-500 text-sm font-medium px-2 py-1 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 relative hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-50">
                {user.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-slate-300">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 group-hover:text-primary-500 transition-colors">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded-full">
                  {user.role?.roleName || "No Role"}
                </span>
                {user.status === "VERIFIED" && (
                  <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold tracking-wider uppercase">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <p className="font-medium text-slate-500">{user.phone}</p>
                <p className="mt-0.5">{user.company?.company || "Real Go"}</p>
              </div>

              <div className="flex gap-2">
                {/* Action placeholders */}
              </div>
            </div>
          </div>
        ))}

        {/* NO RESULTS */}
        {teamMembers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={30} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No team members found</h2>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
