import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Truck, 
  Plus, 
  Search, 
  Filter,
  Users,
  Car,
  ChevronLeft
} from "lucide-react";
import Sitevisits from "./Sitevisits";
import VehicleSiteVisits from "./VehicleSiteVisits";
import Vehicles from "./Vehicles";
import Button from "@/components/Common/Button";

export default function SiteVisitDashboard() {
  const [activeTab, setActiveTab] = useState("visits");

  const tabs = [
    { id: "visits", label: "Customer Visits", icon: Users },
    { id: "logistics", label: "Logistics & Trips", icon: Truck },
    { id: "vehicles", label: "Manage Fleet", icon: Car },
  ];

  const pageTitle = tabs.find(t => t.id === activeTab)?.label || "Site Visits";
  const pageSubtitle = activeTab === 'visits' 
    ? "Track and manage customer tours to various project sites." 
    : activeTab === 'logistics' 
    ? "Monitor vehicle movement, fuel logs, and trip costs." 
    : "Manage your company's vehicle fleet and drivers.";

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* STANDARD HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="text-primary-600" /> {pageTitle}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Actions are now contextual within tabs */}
        </div>
      </div>

      {/* STANDARD CHIP NAVIGATION (Matching Leads.jsx style) */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">View Mode:</span>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary-600 text-black shadow-md shadow-primary-500/10"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-primary-500"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA (Clean White Card) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[60vh] p-1">
        <div className="animate-in fade-in duration-300">
            {activeTab === "visits" && <Sitevisits />}
            {activeTab === "logistics" && <VehicleSiteVisits />}
            {activeTab === "vehicles" && <Vehicles />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
