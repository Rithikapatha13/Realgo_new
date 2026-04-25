import React from "react";
import { useNavigate } from "react-router-dom";
import PlotMap from "../../../components/plots/PlotMap";
import { ChevronLeft } from "lucide-react";

const GbApurvaHomes = () => {
    const navigate = useNavigate();
    const projectId = "012c1d07-e0c2-471d-b827-191780d5613c";
    const bounds = [[0, 0], [1000, 1000]];

    return (
        <div className="p-6 space-y-6 bg-[#fdfdfd] min-h-screen">
            <div className="flex items-center gap-4 mb-2">
                <button 
                    onClick={() => navigate("/plots")}
                    className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:shadow-md transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">GB Apurva Homes</h1>
                </div>
            </div>

            <PlotMap 
                projectId={projectId} 
                bounds={bounds}
                center={[500, 500]}
                zoom={1}
                minZoom={0.2}
                maxZoom={5}
                onBack={() => navigate("/plots")} 
            />
        </div>
    );
};

export default GbApurvaHomes;
