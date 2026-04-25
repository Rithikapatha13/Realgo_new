import { useState, useEffect } from "react";
import { X, Layers, FileUp, Download, CheckCircle2, AlertCircle, Save, Building2, Layout } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useCreateBulkPlots, useGetPhases } from "../../hooks/usePlot";

export default function PlotBulkDialog({ isOpen, onClose, projects }) {
    const createBulkMutation = useCreateBulkPlots();
    
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedPhase, setSelectedPhase] = useState("");
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: phasesData } = useGetPhases(selectedProject);
    const phases = phasesData?.phase || [];

    useEffect(() => {
        if (!isOpen) {
            setSelectedProject("");
            setSelectedPhase("");
            setFile(null);
            setParsedData([]);
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcel(selectedFile);
        }
    };

    const parseExcel = (file) => {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Remove header row
            const rows = json.slice(1);
            
            const plots = rows.map((row) => {
                if (!row[1]) return null; // Skip empty plot numbers

                let facing = row[3] ? row[3].toString().toLowerCase().replace(/[\s-_/]/g, '') : "east";
                let category = row[4] ? row[4].toString().toLowerCase().replace(/[\s-_/]/g, '') : "residential";

                return {
                    plotNumber: row[1]?.toString(),
                    sqrYards: parseFloat(row[2]) || 0,
                    facing: facing,
                    plotCategory: category,
                };
            }).filter(Boolean);

            setParsedData(plots);
            setIsProcessing(false);
            if (plots.length > 0) {
                toast.success(`Parsed ${plots.length} plots from file`);
            } else {
                toast.error("No valid plot data found in file");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSubmit = async () => {
        if (!selectedProject) return toast.error("Please select a project");
        if (parsedData.length === 0) return toast.error("No data to import");

        const projectObj = projects.find(p => p.id === selectedProject);
        
        const payload = parsedData.map(p => ({
            ...p,
            projectId: selectedProject,
            projectName: projectObj?.projectName || "",
            phaseId: selectedPhase || null,
        }));

        try {
            await createBulkMutation.mutateAsync(payload);
            toast.success("Bulk plots created successfully!");
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Bulk import failed");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[1.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Bulk Plot Import</h2>
                        <p className="text-sm text-slate-500">Upload Excel file to register multiple plots</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    
                    {/* DESTINATION */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">1. Destination</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 ml-1">Project *</label>
                                <select 
                                    value={selectedProject} 
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 ml-1">Phase (Optional)</label>
                                <select 
                                    value={selectedPhase} 
                                    onChange={(e) => setSelectedPhase(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                                >
                                    <option value="">Select Phase</option>
                                    {phases.map(ph => <option key={ph.id} value={ph.id}>{ph.phaseName}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* UPLOAD FILE */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2">2. Upload File</h3>
                        
                        {!file ? (
                            <label className="border-2 border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 rounded-xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3">
                                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
                                <FileUp className="text-slate-400" size={32} />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
                                    <p className="text-xs text-slate-400 mt-1">Excel (.xlsx) or CSV files supported</p>
                                </div>
                            </label>
                        ) : (
                            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white border border-slate-300 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="text-emerald-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{file.name}</p>
                                        <p className="text-xs text-slate-500">{parsedData.length} plots detected</p>
                                    </div>
                                </div>
                                <button onClick={() => setFile(null)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* FORMAT INFO */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex gap-3 text-xs">
                        <AlertCircle className="text-slate-400 shrink-0" size={16} />
                        <p className="text-slate-600 leading-relaxed">
                            <span className="font-bold">Excel Columns:</span> [Index, Plot Number, Sq Yards, Facing, Category]. 
                            Headers in the first row are automatically skipped.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={createBulkMutation.isPending || !file || !selectedProject}
                        className="px-8 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        {createBulkMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : null}
                        Import Plots
                    </button>
                </div>
            </div>
        </div>
    );
}
