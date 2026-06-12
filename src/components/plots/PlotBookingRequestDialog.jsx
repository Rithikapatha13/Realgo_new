import { useState } from "react";
import { X, Send, LandPlot, User, Phone, MapPin, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createRequest } from "../../services/request.service";

export default function PlotBookingRequestDialog({ isOpen, onClose, plot }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        note: "",
    });

    if (!isOpen || !plot) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.customerName.trim() || !form.customerContact.trim()) {
            toast.error("Customer Name and Contact are required");
            return;
        }

        setLoading(true);
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
            
            // Format detailed message for the Admin
            const message = `Plot Booking Request:
• Plot Number: ${plot.plotNumber}
• Project: ${plot.projectName}
• Phase: ${plot.phases || plot.phase?.phaseName || "—"}
• Size: ${plot.sqrYards} sq yds
• Category: ${plot.plotCategory || "—"}
• Facing: ${plot.facing || "—"}

Customer Info:
• Name: ${form.customerName}
• Contact: ${form.customerContact}
• Address: ${form.customerAddress || "—"}

Additional Note:
${form.note || "No additional notes."}`;

            const payload = {
                userId: loggedInUser.id,
                requestType: "PLOT_BOOKING",
                requestedName: form.customerName,
                message: message,
            };

            await createRequest(payload);
            toast.success("Booking request submitted successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 flex items-center justify-center">
                            <LandPlot size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Request Plot Booking</h2>
                            <p className="text-xs font-medium text-slate-400">
                                Send a booking request for Plot <span className="font-bold text-indigo-600">{plot.plotNumber}</span> ({plot.projectName})
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
                    {/* PLOT INFO SUMMARY */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-500">
                        <div>Project: <span className="text-slate-900 font-extrabold">{plot.projectName}</span></div>
                        <div>Plot No: <span className="text-slate-900 font-extrabold">{plot.plotNumber}</span></div>
                        <div>Size: <span className="text-slate-900 font-extrabold">{plot.sqrYards} sq yds</span></div>
                        <div>Facing: <span className="text-slate-900 font-extrabold uppercase">{plot.facing || "—"}</span></div>
                    </div>

                    <div className="space-y-4">
                        {/* Customer Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <User size={12} className="text-slate-400" /> Customer Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={form.customerName}
                                onChange={handleChange}
                                required
                                placeholder="Enter customer's full name"
                                className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Customer Contact */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Phone size={12} className="text-slate-400" /> Contact Number *
                            </label>
                            <input
                                type="tel"
                                name="customerContact"
                                value={form.customerContact}
                                onChange={handleChange}
                                required
                                placeholder="Enter customer's phone number"
                                className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Customer Address */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin size={12} className="text-slate-400" /> Current Address
                            </label>
                            <textarea
                                name="customerAddress"
                                value={form.customerAddress}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Enter customer's address (optional)"
                                className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                            />
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <MessageSquare size={12} className="text-slate-400" /> Message / Notes
                            </label>
                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Add payment mode, partial amount, or any notes for the admin..."
                                className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </form>

                {/* FOOTER */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
}
