import React, { useEffect, useState, useRef } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPlotsMapData } from "../../services/plot.service";
import { Loader2, X, Info, User, Maximize2, Minimize2, Map as MapIcon, Layers } from "lucide-react";

// Mapping of project IDs to SVG folder names
const PROJECT_MAP_CONFIG = {
    "6a6dc9ca-ddf8-455f-9be8-b04560a5d5d1": { name: "RealgoHeights", file: "map.svg" },
    "6de8812b-0304-46b5-8579-7f6d778d62e0": { name: "grupesrinivasapuram", file: "srinivasapuram.svg" },
    "d0449150-e892-48ed-b36b-929b72c10bf6": { name: "emeraldhomes", file: "map.svg" },
    // Add more mappings as needed
};

const getColor = (status) => {
    switch (status?.toUpperCase()) {
        case "AVAILABLE": return "#CCEDBF"; // Green
        case "REGISTERED": return "#fb8f90"; // Red
        case "BOOKED": return "#FDBB49"; // Yellow
        case "HOLD": return "#D9DBE2"; // Gray
        default: return "#f3f4f6"; // Light Gray
    }
};

const SVGOverlayComponent = ({ projectId, plotDetails, onPlotClick, bounds }) => {
    const map = useMap();
    const overlayRef = useRef(null);

    useEffect(() => {
        const config = PROJECT_MAP_CONFIG[projectId];
        if (!config) return;

        const svgPath = `/assets/plotmap/${config.name}/${config.file}`;

        fetch(svgPath)
            .then((res) => res.text())
            .then((svgText) => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.documentElement;

                // Update colors and add listeners
                svgElement.querySelectorAll("a").forEach((a) => {
                    const href = (a.getAttribute("xlink:href") || a.getAttribute("href") || "").toLowerCase();
                    if (href && href.startsWith("plot-")) {
                        // Extract plot number and normalize (remove leading zeros if needed)
                        const rawNumber = href.split("-")[1];
                        const normalizedNumber = rawNumber.replace(/^0+/, '');

                        // Try to find detail by raw or normalized number
                        const detail = plotDetails[rawNumber] || plotDetails[normalizedNumber];

                        if (detail) {
                            // Target paths, polygons, polylines, rects inside the anchor
                            const shapes = a.querySelectorAll("rect, path, polygon, polyline, circle, ellipse");
                            shapes.forEach(shape => {
                                // IMPORTANT: Use .style.fill to override CSS classes like .st0
                                shape.style.fill = getColor(detail.status);
                                shape.style.stroke = "#333";
                                shape.style.strokeWidth = "0.5";
                                shape.style.cursor = "pointer";
                                shape.style.transition = "all 0.2s";
                            });

                            a.style.cursor = "pointer";
                            a.addEventListener("click", (e) => {
                                e.preventDefault();
                                onPlotClick(detail);
                            });

                            // Hover effect
                            a.addEventListener("mouseenter", () => {
                                shapes.forEach(s => s.style.strokeWidth = "2");
                            });
                            a.addEventListener("mouseleave", () => {
                                shapes.forEach(s => s.style.strokeWidth = "0.5");
                            });
                        }
                    }
                });

                if (overlayRef.current) {
                    map.removeLayer(overlayRef.current);
                }

                const svgOverlay = L.svgOverlay(svgElement, bounds || [[0, 0], [1000, 1000]]).addTo(map);
                overlayRef.current = svgOverlay;
            })
            .catch((err) => console.error("Error loading SVG:", err));

        return () => {
            if (overlayRef.current) {
                map.removeLayer(overlayRef.current);
            }
        };
    }, [projectId, plotDetails, map]);

    return null;
};

const PlotMap = ({ projectId, onBack, bounds, center = [500, 500], zoom = 0, minZoom = 0, maxZoom = 5 }) => {
    const [loading, setLoading] = useState(true);
    const [plotDetails, setPlotDetails] = useState({});
    const [stats, setStats] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getPlotsMapData(projectId);
            if (res.success) {
                const details = {};
                res.data.items.forEach((item) => {
                    details[item.plotNumber] = item;
                });
                setPlotDetails(details);
                setStats(res.data);
            }
        } catch (error) {
            console.error("Error fetching map data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading Interactive Layout Map...</p>
            </div>
        );
    }

    if (!PROJECT_MAP_CONFIG[projectId]) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                    <MapIcon className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Map Not Available</h3>
                <p className="text-slate-500 max-w-sm">An interactive SVG layout has not been assigned to this project yet.</p>
                <button onClick={onBack} className="mt-8 text-primary-600 font-bold hover:underline">Go back to projects</button>
            </div>
        );
    }

    return (
        <div className="relative bg-white rounded-3xl overflow-hidden h-[75vh]">

            {/* Stats Overlay */}
            {stats && (
                <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 w-48">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Live Inventory</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#CCEDBF]" /> Available
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.availableCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#FDBB49]" /> Booked
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.bookedCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#fb8f90]" /> Registered
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.registeredCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Plot Detail Card */}
            {selectedPlot && (
                <div className="absolute top-20 right-6 z-[1000] w-[13vw] animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden group relative">
                        <div className="relative">
                            {/* Color bar */}
                            <div
                              className="h-2 w-full"
                              style={{ backgroundColor: getColor(selectedPlot.status) }}
                            />

  {/* X button overlay */}
  <button
    onClick={() => setSelectedPlot(null)}
    className="absolute top-0 right-0 z-10 p-1 rounded-lg text-white 
               opacity-0 group-hover:opacity-100 
               transition-opacity duration-200 
               group-hover:bg-black/20"
  >
    <X size={14} />
  </button>
</div>
                        <div className="px-4 pb-2">
                            
                            <div className="">
                                <div className="p-1 flex items-center justify-between">
                                    <p className="text-xs font-black text-slate-400 tracking-widest">Plot Number</p>
                                    <h4 className="text-xs font-black text-slate-900">{selectedPlot.plotNumber}</h4>
                                </div>
                                
                            </div>

                            <div className="">
                                <div className="">
                                    {/* <div className="rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                        <Info size={16} />
                                    </div> */}
                                    <div className="p-1 flex flex-row items-center justify-between">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Status</p>
                                        <p className="text-xs font-black text-slate-700">{selectedPlot.status}</p>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="p-1 bg-slate-50 flex justify-between">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight text-center">Facing</p>
                                        <p className="text-xs font-black text-slate-700 text-center">{selectedPlot.facing || '—'}</p>
                                    </div>
                                    <div className="p-1 bg-slate-50 flex justify-between">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight text-center">Sq. Yards</p>
                                        <p className="text-xs font-black text-slate-700 text-center">{selectedPlot.sqrYards || '—'}</p>
                                    </div>
                                </div>

                                {selectedPlot.customerName && (
                                    <div className="flex items-center gap-3 p-2.5 bg-primary-50 rounded-xl border border-primary-100">
                                        <div className="rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm border border-primary-50">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-tight">Owned By</p>
                                            <p className="text-xs font-black text-primary-700 truncate max-w-[160px]">{selectedPlot.customerName}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* <button
                                className="w-full mt-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                               
                            >
                                View Full Record
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

            <MapContainer
                crs={L.CRS.Simple}
                center={center}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                style={{ height: "100%", width: "100%", background: "#f8fafc" }}
                attributionControl={false}
            >
                <SVGOverlayComponent
                    projectId={projectId}
                    plotDetails={plotDetails}
                    onPlotClick={setSelectedPlot}
                    bounds={bounds}
                />
            </MapContainer>
        </div>
    );
};

export default PlotMap;
