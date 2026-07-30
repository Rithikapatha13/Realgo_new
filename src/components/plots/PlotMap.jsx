import React, { useEffect, useState, useRef } from "react";

import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPlotsMapData, getPublicPlotsMapData } from "../../services/plot.service";
import {
    Loader2, X, Info, User, Maximize2, Minimize2, Map as MapIcon,
    Layers, Search, Plus, Minus, RotateCcw, CheckCircle2, BookOpen,
    FileCheck, PauseCircle, Compass, Check
} from "lucide-react";
import PlotBookingRequestDialog from "./PlotBookingRequestDialog";
import PlotBookingDialog from "./PlotBookingDialog";

// Normalize names for consistent matching
const normalizeName = (name) => (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Mapping of normalized project names to SVG folder names
const PROJECT_MAP_CONFIG = {
    "realgoheights": { name: "RealgoHeights", file: "map.svg" },
    "grupesrinivasapuram": { name: "grupesrinivasapuram", file: "srinivasapuram.svg" },
    "emeraldhomes": { name: "emeraldhomes", file: "map.svg" },
    "anvayuniversitycounty": { name: "anvayuniversitycounty", file: "map.svg" },
    "gbapurvahomes": { name: "gbapurvahomes", file: "test.svg" },
    "grupefoxconn": { name: "grupefoxconn", file: "map.svg" },
    "grupelrgreenshields": { name: "grupelrgreenshields", file: "layout.svg" },
    "foxconn": { name: "grupefoxconn", file: "map.svg" },
    "foxconnplots": { name: "grupefoxconn", file: "map.svg" },
};

const getColor = (status) => {
    switch (status?.toUpperCase()) {
        case "AVAILABLE": return "#22c55e"; // Emerald/Green
        case "REGISTERED": return "#ef4444"; // Red
        case "BOOKED": return "#f59e0b"; // Amber/Yellow
        case "HOLD": return "#94a3b8"; // Slate Gray
        default: return "#e2e8f0"; // Light Gray
    }
};

const MapControls = ({ onZoomIn, onZoomOut, onResetView, isFullscreen, onToggleFullscreen }) => {
    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200/80">
            <button
                onClick={onZoomIn}
                title="Zoom In"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
            >
                <Plus size={18} />
            </button>
            <button
                onClick={onZoomOut}
                title="Zoom Out"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
            >
                <Minus size={18} />
            </button>
            <div className="w-full h-px bg-slate-200 my-0.5" />
            <button
                onClick={onResetView}
                title="Reset View"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
            >
                <RotateCcw size={16} />
            </button>
            <button
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
            >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
        </div>
    );
};

const SVGOverlayComponent = ({
    projectName,
    plotDetails,
    onPlotClick,
    onPlotHover,
    onPlotLeave,
    activeStatusFilter,
    searchQuery,
    bounds,
    setMapInstance
}) => {
    const map = useMap();
    const overlayRef = useRef(null);

    useEffect(() => {
        if (setMapInstance) {
            setMapInstance(map);
        }
    }, [map, setMapInstance]);

    useEffect(() => {
        const normalized = normalizeName(projectName);
        const config = PROJECT_MAP_CONFIG[normalized];
        if (!config) return;

        const svgPath = `/assets/plotmap/${config.name}/${config.file}`;

        fetch(svgPath)
            .then((res) => res.text())
            .then((svgText) => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.documentElement;

                svgElement.querySelectorAll("a").forEach((a) => {
                    const href = (a.getAttribute("xlink:href") || a.getAttribute("href") || "").toLowerCase();
                    if (href && href.startsWith("plot-")) {
                        const rawNumber = href.split("-")[1];
                        const normalizedNumber = rawNumber ? rawNumber.replace(/^0+/, '') : '';

                        const detail = plotDetails[rawNumber] || plotDetails[normalizedNumber];

                        if (detail) {
                            const shapes = a.querySelectorAll("rect, path, polygon, polyline, circle, ellipse");
                            const isFilteredOut = activeStatusFilter && activeStatusFilter !== "ALL" && detail.status !== activeStatusFilter;
                            const isSearchMatched = searchQuery && (
                                detail.plotNumber.toLowerCase().includes(searchQuery.toLowerCase())
                            );

                            shapes.forEach(shape => {
                                shape.style.fill = getColor(detail.status);
                                shape.style.fillOpacity = isFilteredOut ? "0.2" : "0.85";
                                shape.style.stroke = isSearchMatched ? "#2563eb" : "#334155";
                                shape.style.strokeWidth = isSearchMatched ? "3px" : "0.8px";
                                shape.style.cursor = "pointer";
                                shape.style.transition = "all 0.2s ease-in-out";

                                if (isSearchMatched) {
                                    shape.style.fillOpacity = "1";
                                }
                            });

                            a.style.cursor = "pointer";
                            a.onclick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onPlotClick(detail);
                            };

                            a.onmouseenter = (e) => {
                                shapes.forEach(s => {
                                    s.style.strokeWidth = "2.5px";
                                    s.style.stroke = "#0f172a";
                                    s.style.fillOpacity = "1";
                                });
                                if (onPlotHover) onPlotHover(detail, e);
                            };

                            a.onmouseleave = () => {
                                shapes.forEach(s => {
                                    s.style.strokeWidth = isSearchMatched ? "3px" : "0.8px";
                                    s.style.stroke = isSearchMatched ? "#2563eb" : "#334155";
                                    s.style.fillOpacity = isFilteredOut ? "0.2" : "0.85";
                                });
                                if (onPlotLeave) onPlotLeave();
                            };
                        }
                    }
                });

                if (overlayRef.current) {
                    map.removeLayer(overlayRef.current);
                }

                const svgBounds = bounds || [[0, 0], [1000, 1000]];
                const svgOverlay = L.svgOverlay(svgElement, svgBounds, { interactive: true }).addTo(map);
                overlayRef.current = svgOverlay;
            })
            .catch((err) => console.error("Error loading SVG layout map:", err));

        return () => {
            if (overlayRef.current) {
                map.removeLayer(overlayRef.current);
            }
        };
    }, [projectName, plotDetails, map, activeStatusFilter, searchQuery, bounds]);

    return null;
};

const PlotMap = ({ projectId, onBack, bounds, center = [500, 500], zoom = 0, minZoom = -2, maxZoom = 5, isPublic = false }) => {
    const containerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plotDetails, setPlotDetails] = useState({});
    const [stats, setStats] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [hoveredPlot, setHoveredPlot] = useState(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
    const [bookingRequestOpen, setBookingRequestOpen] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isUserAdmin = ["admin", "accounts", "superadmin", "pro"].includes(
        loggedInUser.role?.roleName?.toLowerCase() ||
        loggedInUser.roleName?.toLowerCase() ||
        loggedInUser.role?.toLowerCase() ||
        loggedInUser.userType?.toLowerCase()
    );

    useEffect(() => {
        fetchData();
    }, [projectId, isPublic]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchFn = isPublic ? getPublicPlotsMapData : getPlotsMapData;
            const res = await fetchFn(projectId);
            if (res.success) {
                const details = {};
                res.data.items.forEach((item) => {
                    details[item.plotNumber] = item;
                });
                setPlotDetails(details);
                setStats(res.data);
                setProjectName(res.data.projectName || "");
            }
        } catch (error) {
            console.error("Error fetching map data:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleZoomIn = () => {
        if (mapInstance) mapInstance.zoomIn();
    };

    const handleZoomOut = () => {
        if (mapInstance) mapInstance.zoomOut();
    };

    const handleResetView = () => {
        if (mapInstance) {
            const defaultBounds = bounds || [[0, 0], [1000, 1000]];
            mapInstance.fitBounds(defaultBounds);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => console.error(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch((err) => console.error(err));
            setIsFullscreen(false);
        }
    };

    const handlePlotHover = (plot, e) => {
        setHoveredPlot(plot);
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoverPos({
                x: e.clientX - rect.left + 15,
                y: e.clientY - rect.top - 35
            });
        }
    };

    const handlePlotLeave = () => {
        setHoveredPlot(null);
    };

    if (loading) {
        return (
            <div className="h-[650px] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <Loader2 className="w-10 h-10 text-[#1e1e62] animate-spin mb-4" />
                <p className="text-slate-600 font-semibold text-sm">Loading Interactive Layout Map...</p>
            </div>
        );
    }

    const normalizedName = normalizeName(projectName);
    if (!PROJECT_MAP_CONFIG[normalizedName]) {
        return (
            <div className="h-[650px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-4 border border-slate-100">
                    <MapIcon className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Layout Map Not Assigned</h3>
                <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-6">
                    An interactive SVG layout map for <span className="font-semibold text-slate-700">"{projectName}"</span> has not been mapped yet.
                </p>
                {onBack && (
                    <button onClick={onBack} className="px-6 py-2.5 bg-[#1e1e62] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm hover:bg-[#2e2e8a] transition-all">
                        Back to Projects
                    </button>
                )}
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 ${isFullscreen ? "h-screen w-screen" : "h-[75vh]"}`}>

            {/* ════ TOP SEARCH & TOOLBAR ════ */}
            <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3">
                <div className="relative group w-64 md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search plot number (e.g. 101)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#1e1e62] outline-none shadow-lg transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* ════ MAP CONTROLS ════ */}
            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
            />

            {/* ════ STATS & LEGEND FILTER OVERLAY ════ */}
            {stats && (
                <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100/80 w-60">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</p>
                            {activeStatusFilter !== "ALL" && (
                                <button
                                    onClick={() => setActiveStatusFilter("ALL")}
                                    className="text-[9px] font-bold text-indigo-600 hover:underline"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={() => setActiveStatusFilter(activeStatusFilter === "AVAILABLE" ? "ALL" : "AVAILABLE")}
                                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${activeStatusFilter === "AVAILABLE" ? "bg-emerald-50 border-emerald-500 shadow-sm" : "border-slate-100 hover:bg-slate-50"}`}
                            >
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Avail
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.availableCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveStatusFilter(activeStatusFilter === "BOOKED" ? "ALL" : "BOOKED")}
                                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${activeStatusFilter === "BOOKED" ? "bg-amber-50 border-amber-500 shadow-sm" : "border-slate-100 hover:bg-slate-50"}`}
                            >
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Booked
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.bookedCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveStatusFilter(activeStatusFilter === "REGISTERED" ? "ALL" : "REGISTERED")}
                                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${activeStatusFilter === "REGISTERED" ? "bg-rose-50 border-rose-500 shadow-sm" : "border-slate-100 hover:bg-slate-50"}`}
                            >
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Reg
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.registeredCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveStatusFilter(activeStatusFilter === "HOLD" ? "ALL" : "HOLD")}
                                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${activeStatusFilter === "HOLD" ? "bg-slate-100 border-slate-400 shadow-sm" : "border-slate-100 hover:bg-slate-50"}`}
                            >
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Hold
                                </span>
                                <span className="text-xs font-black text-slate-900">{stats.holdCount || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ HOVER TOOLTIP ════ */}
            {hoveredPlot && (
                <div
                    className="absolute z-[1050] pointer-events-none bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-opacity duration-150"
                    style={{ left: hoverPos.x, top: hoverPos.y }}
                >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(hoveredPlot.status) }} />
                    Plot {hoveredPlot.plotNumber} • {hoveredPlot.status}
                </div>
            )}

            {/* ════ SELECTED PLOT DETAILS DRAWER CARD ════ */}
            {selectedPlot && (
                <div className="absolute top-16 right-4 z-[1000] w-72 md:w-80 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
                        <div className="h-2 w-full" style={{ backgroundColor: getColor(selectedPlot.status) }} />

                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Unit</p>
                                    <h3 className="text-xl font-extrabold text-slate-900">Plot {selectedPlot.plotNumber}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedPlot(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Status</span>
                                    <span className="text-slate-800 font-extrabold">{selectedPlot.status}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Facing</span>
                                    <span className="text-slate-800 font-extrabold">{selectedPlot.facing || '—'}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Area Size</span>
                                    <span className="text-slate-800 font-extrabold">{selectedPlot.sqrYards ? `${selectedPlot.sqrYards} SqYds` : '—'}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Category</span>
                                    <span className="text-slate-800 font-extrabold capitalize">{selectedPlot.plotCategory || 'Residential'}</span>
                                </div>
                            </div>

                            {selectedPlot.customerName && (
                                <div className="flex items-center gap-2.5 p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100">
                                    <User size={16} className="text-indigo-600 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight">Customer</p>
                                        <p className="text-xs font-bold text-indigo-900 truncate">{selectedPlot.customerName}</p>
                                    </div>
                                </div>
                            )}

                            {!isPublic && selectedPlot.status === "AVAILABLE" && (
                                isUserAdmin ? (
                                    <button
                                        onClick={() => setBookingId(selectedPlot.id)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <BookOpen size={14} /> Book Plot Now
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setBookingRequestOpen(true)}
                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={14} /> Request Booking
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ════ LEAFLET MAP CONTAINER ════ */}
            <MapContainer
                crs={L.CRS.Simple}
                center={center}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                style={{ height: "100%", width: "100%", background: "#0f172a" }}
                attributionControl={false}
                zoomControl={false}
            >
                <SVGOverlayComponent
                    projectName={projectName}
                    plotDetails={plotDetails}
                    onPlotClick={setSelectedPlot}
                    onPlotHover={handlePlotHover}
                    onPlotLeave={handlePlotLeave}
                    activeStatusFilter={activeStatusFilter}
                    searchQuery={searchQuery}
                    bounds={bounds}
                    setMapInstance={setMapInstance}
                />
            </MapContainer>

            {/* ════ DIALOGS ════ */}
            {bookingRequestOpen && selectedPlot && (
                <PlotBookingRequestDialog
                    isOpen={bookingRequestOpen}
                    onClose={() => {
                        setBookingRequestOpen(false);
                        setSelectedPlot(null);
                        fetchData();
                    }}
                    plot={{ ...selectedPlot, projectName }}
                />
            )}

            {bookingId && (
                <PlotBookingDialog
                    isOpen={!!bookingId}
                    onClose={() => {
                        setBookingId(null);
                        setSelectedPlot(null);
                        fetchData();
                    }}
                    plotId={bookingId}
                />
            )}
        </div>
    );
};

export default PlotMap;

