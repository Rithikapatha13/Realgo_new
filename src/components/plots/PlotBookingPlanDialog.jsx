import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdatePlotBooking } from "../../hooks/usePlot";

export default function PlotBookingPlanDialog({ isOpen, onClose, plotId }) {
    const updateMutation = useUpdatePlotBooking();

    const [form, setForm] = useState({
        plotBookingPlan: "",
        paymentType: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({ id: plotId, ...form });
            toast.success("Booking plan updated!");
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update booking plan");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-semibold">Update Booking Plan</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">New Booking Plan (Days) *</label>
                        <select name="plotBookingPlan" value={form.plotBookingPlan} onChange={handleChange} required
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                            <option value="">Select Plan</option>
                            <option value="15">15 Days</option>
                            <option value="45">45 Days</option>
                            <option value="90">90 Days</option>
                            <option value="120">120 Days</option>
                            <option value="180">180 Days</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Payment Type</label>
                        <select name="paymentType" value={form.paymentType} onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                            <option value="">Select</option>
                            <option value="fully_paid">Fully Paid</option>
                            <option value="emi">EMI</option>
                            <option value="partial">Partial</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                        <button type="submit" disabled={updateMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">
                            Update Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
