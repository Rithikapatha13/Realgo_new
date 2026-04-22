import { useState, useEffect } from "react";
import { X, LandPlot, MapPin, Ruler, Box, Compass, Save, Eye, Plus, Pencil, SlidersHorizontal, User, CreditCard, Calendar } from "lucide-react";
import toast from "react-hot-toast";
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{action} Plot</h2>
                        <p className="text-sm text-slate-500">Enter plot details below</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* LEFT COLUMN: Physical Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Property Details</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Plot Number *</label>
                                        <input name="plotNumber" value={form.plotNumber} onChange={handleChange} disabled={isView} required
                                            placeholder="Plot No"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Area (Sq Yds) *</label>
                                        <input name="sqrYards" type="number" step="0.01" value={form.sqrYards} onChange={handleChange} disabled={isView} required
                                            placeholder="0.00"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Select Project *</label>
                                    <select name="projectId" value={form.projectId} onChange={handleChange} disabled={isView} required
                                        className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                        <option value="">Choose a Project</option>
                                        {projects.map((p) => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Phase</label>
                                        <select name="phaseId" value={form.phaseId} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">Select Phase</option>
                                            {phases.map((ph) => <option key={ph.id} value={ph.id}>{ph.phaseName}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Facing</label>
                                        <select name="facing" value={form.facing} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                            <option value="">Select Facing</option>
                                            <option value="east">East</option><option value="west">West</option>
                                            <option value="north">North</option><option value="south">South</option>
                                            <option value="corner">Corner</option><option value="northeast">NE</option>
                                            <option value="northwest">NW</option><option value="southeast">SE</option>
                                            <option value="southwest">SW</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Plot Category *</label>
                                    <select name="plotCategory" value={form.plotCategory} onChange={handleChange} disabled={isView} required
                                        className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                        <option value="residential">Residential</option>
                                        <option value="premium">Premium</option>
                                        <option value="executive">Executive</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="semicommercial">Semi Commercial</option>
                                        <option value="supercommercial">Super Commercial</option>
                                        <option value="vip">VIP</option>
                                        <option value="villaplots">Villa Plots</option>
                                        <option value="mortgage">Mortgage</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Geographic Coordinates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Latitude</label>
                                        <input name="latitude" value={form.latitude} onChange={handleChange} disabled={isView} placeholder="0.000000"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Longitude</label>
                                        <input name="longitude" value={form.longitude} onChange={handleChange} disabled={isView} placeholder="0.000000"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Financial & Customer Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Financial Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Total Cost (₹)</label>
                                        <input name="totalCost" type="number" value={form.totalCost} onChange={handleChange} disabled={isView}
                                            placeholder="0"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Paid Amount (₹)</label>
                                        <input name="paidAmount" type="number" value={form.paidAmount} onChange={handleChange} disabled={isView}
                                            placeholder="0"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Passbook Number (PB No)</label>
                                    <input name="pbNumber" value={form.pbNumber} onChange={handleChange} disabled={isView}
                                        placeholder="e.g. PB-123"
                                        className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Customer Details</h3>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Customer Full Name</label>
                                    <input name="customerName" value={form.customerName} onChange={handleChange} disabled={isView}
                                        placeholder="Full Name"
                                        className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Contact No</label>
                                        <input name="customerContact" value={form.customerContact} onChange={handleChange} disabled={isView}
                                            placeholder="Phone Number"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Aadhar Number</label>
                                        <input name="aadhar" value={form.aadhar} onChange={handleChange} disabled={isView}
                                            placeholder="0000 0000 0000"
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1">Current Address</label>
                                    <textarea name="customerAddress" value={form.customerAddress} onChange={handleChange} disabled={isView} rows={2}
                                        placeholder="Full address details..."
                                        className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all resize-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Dates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Booking Date</label>
                                        <input name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1">Registration Date</label>
                                        <input name="registeredDate" type="date" value={form.registeredDate} onChange={handleChange} disabled={isView}
                                            className="w-full border border-slate-300 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* FOOTER */}
                {!isView && (
                    <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all">
                            Cancel
                        </button>
                        <button type="submit" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                            className="px-8 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2">
                            {createMutation.isPending || updateMutation.isPending ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {action === "Create" ? "Create Plot" : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
