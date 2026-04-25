import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlotMap from "../../components/plots/PlotMap";
import { ChevronLeft } from "lucide-react";

const PlotMapView = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

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
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Venture Layout</h1>
                    {/* <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Technical Map</p> */}
                </div>
            </div>

            <PlotMap 
                projectId={projectId} 
                onBack={() => navigate("/plots")} 
            />
        </div>
    );
};

export default PlotMapView;
