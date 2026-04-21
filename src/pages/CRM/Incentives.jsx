import React, { useState, useEffect } from "react";
import { 
  BadgeIndianRupee, Building2, Search, Award, 
  ChevronRight, ArrowLeft, Layers, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "@/services/project.service";

export default function ProjectIncentives() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        const data = res?.items || [];
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incentives = selectedProject?.incentivesLevel || [];
  const rows = Array.isArray(incentives) ? incentives : [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-400 hover:text-primary-600 font-bold text-xs uppercase tracking-widest mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BadgeIndianRupee className="text-primary-600" size={28} />
            Project Incentives
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse project-specific commission structures and incentive levels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Project Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
              Select Project
            </h2>
            
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text"
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredProjects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? "bg-primary-50 border-primary-200" 
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        <Building2 size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? "text-primary-700" : "text-slate-600"}`}>
                          {p.projectName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">Click to view levels</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredProjects.length === 0 && !isLoading && (
                <p className="text-center py-8 text-[10px] font-black uppercase text-slate-300">No projects found</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Incentive Details */}
        <div className="lg:col-span-3">
          {!selectedProject ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center">
              < Award className="mx-auto text-slate-100 mb-4" size={64} />
              <h3 className="text-lg font-bold text-slate-400">Welcome to Incentives</h3>
              <p className="text-sm text-slate-400">Select a project from the list to see its detailed incentive levels.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Project Overview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50 flex items-center justify-center">
                  {selectedProject.projectImage ? (
                    <img src={selectedProject.projectImage} alt={selectedProject.projectName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={32} className="text-slate-200" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                    Project Overview
                  </span>
                  <h2 className="text-xl font-black text-slate-800 mt-2">{selectedProject.projectName}</h2>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{selectedProject.projectAddress || "No address provided"}</p>
                </div>
                <div className="flex gap-3">
                   <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 min-w-[120px] text-center">
                      <p className="text-[10px] font-black uppercase text-emerald-600/60 mb-1">Available Plots</p>
                      <p className="text-2xl font-black text-emerald-600">{selectedProject.availablePlots || 0}</p>
                   </div>
                </div>
              </div>

              {/* Incentive Table Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                     <TrendingUp size={16} className="text-primary-600" /> Commission Structure
                   </h3>
                   <span className="text-[10px] font-black text-slate-400">{rows.length} Levels Defined</span>
                </div>

                {rows.length === 0 ? (
                  <div className="p-16 text-center">
                    <Award size={48} className="mx-auto text-slate-100 mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                      No incentive levels configured for this project
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Hierarchy</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Commission %</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Fixed Amount</th>
                          <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="w-8 h-8 rounded-xl bg-primary-600 text-white text-xs font-black flex items-center justify-center">
                                {idx + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Layers size={14} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-700">{row.role || row.roleName || row.title || "Consultant"}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">LEVEL {row.level || idx + 1}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-base font-black text-emerald-600">
                                {row.percentage != null ? `${row.percentage}%` : "—"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-base font-black text-primary-600">
                                {row.amount != null ? `₹${Number(row.amount).toLocaleString("en-IN")}` : "—"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <div className="flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Active</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="bg-slate-50 px-6 py-4 flex items-center gap-4">
                   <div className="flex -space-x-2 overflow-hidden">
                      {[1,2,3].map(i => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                          A{i}
                        </div>
                      ))}
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 italic">
                     These rates are based on the latest project performance standards.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
