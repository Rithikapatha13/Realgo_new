import { useState, useEffect } from "react";
import { X, LandPlot, MapPin, Ruler, Box, Compass, Save, Eye, Plus, Pencil, SlidersHorizontal, User, CreditCard, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import CustomSelect from "../Common/CustomSelect";
import { useCreatePlot, useUpdatePlot, useGetPhases } from "../../hooks/usePlot";

export default function PlotFormDialog({ isOpen, onClose, action, plotData, projects }) {
    const createMutation = useCreatePlot();
    const updateMutation = useUpdatePlot();

    const [form, setForm] = useState({
        plotNumber: "",
        projectId: "",
        projectName: "",
        phaseId: "",
        plotCategory: "residential",
        facing: "",
        sqrYards: "",
        latitude: "",
        longitude: "",
        // Financial/Customer fields
        totalCost: "",
        paidAmount: "",
        customerName: "",
        customerContact: "",
        customerAddress: "",
        aadhar: "",
        pbNumber: "",
        bookingDate: "",
        registeredDate: "",
    });

    const { data: phasesData } = useGetPhases(form.projectId);
    const phases = phasesData?.phase || [];

    useEffect(() => {
        if (plotData && (action === "Update" || action === "View")) {
            setForm({
                plotNumber: plotData.plotNumber || "",
                projectId: plotData.projectId || "",
                projectName: plotData.projectName || "",
                phaseId: plotData.phaseId || "",
                plotCategory: plotData.plotCategory || "residential",
                facing: plotData.facing || "",
                sqrYards: plotData.sqrYards?.toString() || "",
                latitude: plotData.latitude || "",
                longitude: plotData.longitude || "",
                totalCost: plotData.totalCost || "",
                paidAmount: plotData.paidAmount || "",
                customerName: plotData.customerName || "",
                customerContact: plotData.customerContact || "",
                customerAddress: plotData.customerAddress || "",
                aadhar: plotData.aadhar || "",
                pbNumber: plotData.pbNumber || "",
                bookingDate: plotData.bookingDate ? new Date(plotData.bookingDate).toISOString().split('T')[0] : "",
                registeredDate: plotData.registeredDate ? new Date(plotData.registeredDate).toISOString().split('T')[0] : "",
            });
        } else {
            // Reset for Create
            setForm({
                plotNumber: "", projectId: "", projectName: "", phaseId: "",
                plotCategory: "residential", facing: "", sqrYards: "",
                latitude: "", longitude: "", totalCost: "", paidAmount: "",
                customerName: "", customerContact: "", customerAddress: "",
                aadhar: "", pbNumber: "", bookingDate: "", registeredDate: "",
            });
        }
    }, [plotData, action, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "projectId") {
            const proj = projects.find((p) => p.id === value);
            setForm((prev) => ({ ...prev, projectId: value, projectName: proj?.projectName || "", phaseId: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (action === "View") return;

        try {
            if (action === "Create") {
                await createMutation.mutateAsync(form);
                toast.success("Plot created successfully!");
            } else {
                await updateMutation.mutateAsync({ id: plotData.id, ...form });
                toast.success("Plot updated successfully!");
            }
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    const isView = action === "View";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className="flex items-center justify-between p-5 sm:p-7 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${action === "Create" ? "bg-blue-600 text-white shadow-blue-200" :
                                action === "Update" ? "bg-amber-500 text-white shadow-amber-100" : "bg-indigo-600 text-white shadow-indigo-100"
                            }`}>
                            {action === "Create" ? <Plus size={28} /> : action === "Update" ? <Pencil size={26} /> : <Eye size={28} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{action} Plot</h2>
                            <p className="text-sm font-medium text-slate-500">
                                {action === "Create" ? "Register a new asset item" : `Modifying all details for Plot ${form.plotNumber}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all active:scale-90">
                        <X size={24} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                        {/* LEFT COLUMN: Physical Details */}
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <LandPlot size={14} /> Property Location & Size
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Plot Number *</label>
                                        <input name="plotNumber" value={form.plotNumber} onChange={handleChange} disabled={isView} required
                                            placeholder="Plot No"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Area (Sq Yds) *</label>
                                        <input name="sqrYards" type="number" step="0.01" value={form.sqrYards} onChange={handleChange} disabled={isView} required
                                            placeholder="0.00"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <CustomSelect
                                        label="Select Project"
                                        required
                                        value={form.projectId}
                                        onChange={(val) => {
                                            const proj = projects.find((p) => p.id === val);
                                            setForm(prev => ({ ...prev, projectId: val, projectName: proj?.projectName || "", phaseId: "" }));
                                        }}
                                        disabled={isView}
                                        options={projects.map(p => ({ label: p.projectName, value: p.id }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <CustomSelect
                                            label="Phase"
                                            value={form.phaseId}
                                            onChange={(val) => setForm(prev => ({ ...prev, phaseId: val }))}
                                            disabled={isView}
                                            options={phases.map(ph => ({ label: ph.phaseName, value: ph.id }))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <CustomSelect
                                            label="Facing"
                                            value={form.facing}
                                            onChange={(val) => setForm(prev => ({ ...prev, facing: val }))}
                                            disabled={isView}
                                            options={[
                                                { label: "East", value: "east" },
                                                { label: "West", value: "west" },
                                                { label: "North", value: "north" },
                                                { label: "South", value: "south" },
                                                { label: "Corner", value: "corner" },
                                                { label: "NE", value: "northeast" },
                                                { label: "NW", value: "northwest" },
                                                { label: "SE", value: "southeast" },
                                                { label: "SW", value: "southwest" }
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <CustomSelect
                                        label="Plot Category"
                                        required
                                        value={form.plotCategory}
                                        onChange={(val) => setForm(prev => ({ ...prev, plotCategory: val }))}
                                        disabled={isView}
                                        options={[
                                            { label: "Residential", value: "residential" },
                                            { label: "Premium", value: "premium" },
                                            { label: "Executive", value: "executive" },
                                            { label: "Commercial", value: "commercial" },
                                            { label: "Semi Commercial", value: "semicommercial" },
                                            { label: "Super Commercial", value: "supercommercial" },
                                            { label: "VIP", value: "vip" },
                                            { label: "Villa Plots", value: "villaplots" },
                                            { label: "Mortgage", value: "mortgage" }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <MapPin size={14} /> Geographic Coordinates
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Latitude</label>
                                        <input name="latitude" value={form.latitude} onChange={handleChange} disabled={isView} placeholder="0.000000"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Longitude</label>
                                        <input name="longitude" value={form.longitude} onChange={handleChange} disabled={isView} placeholder="0.000000"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Financial & Customer Details */}
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <CreditCard size={14} /> Financial Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Total Cost (₹)</label>
                                        <input name="totalCost" type="number" value={form.totalCost} onChange={handleChange} disabled={isView}
                                            placeholder="0"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Paid Amount (₹)</label>
                                        <input name="paidAmount" type="number" value={form.paidAmount} onChange={handleChange} disabled={isView}
                                            placeholder="0"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Passbook Number (PB No)</label>
                                    <input name="pbNumber" value={form.pbNumber} onChange={handleChange} disabled={isView}
                                        placeholder="e.g. PB-123"
                                        className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <User size={14} /> Customer Ownership
                                </h3>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Customer Full Name</label>
                                    <input name="customerName" value={form.customerName} onChange={handleChange} disabled={isView}
                                        placeholder="Full Name"
                                        className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Contact No</label>
                                        <input name="customerContact" value={form.customerContact} onChange={handleChange} disabled={isView}
                                            placeholder="Phone Number"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Aadhar Number</label>
                                        <input name="aadhar" value={form.aadhar} onChange={handleChange} disabled={isView}
                                            placeholder="0000 0000 0000"
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Current Address</label>
                                    <textarea name="customerAddress" value={form.customerAddress} onChange={handleChange} disabled={isView} rows={2}
                                        placeholder="Full address details..."
                                        className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none" />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <Calendar size={14} /> Important Dates
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Booking Date</label>
                                        <input name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Registration Date</label>
                                        <input name="registeredDate" type="date" value={form.registeredDate} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* FOOTER */}
                {!isView && (
                    <div className="p-5 sm:p-7 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3 sm:gap-4">
                        <button type="button" onClick={onClose}
                            className="px-8 py-3 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-200 transition-all active:scale-95">
                            Discard Changes
                        </button>
                        <button type="submit" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                            className={`px-10 py-3 rounded-2xl text-sm font-black text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 ${action === "Create" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                                }`}>
                            {createMutation.isPending || updateMutation.isPending ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : <Save size={18} />}
                            {action === "Create" ? "Create New Plot" : "Save All Details"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
