import React from "react";
import { useParams } from "react-router-dom";
import PlotMap from "../../components/plots/PlotMap";
import { Building2 } from "lucide-react";

const PublicPlotMapView = () => {
    const { projectId } = useParams();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black shadow-lg">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white">Venture Master Layout</h1>
                        <p className="text-xs text-slate-400 font-medium">Public Inventory Map • Real-time Availability</p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Registered</span>
                    </div>
                </div>
            </header>

            {/* Interactive Map */}
            <main className="flex-1 p-4 md:p-6">
                <PlotMap 
                    projectId={projectId} 
                    isPublic={true} 
                />
            </main>
        </div>
    );
};

export default PublicPlotMapView;
