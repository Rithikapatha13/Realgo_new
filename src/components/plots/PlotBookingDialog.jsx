import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import CustomSelect from "../Common/CustomSelect";
import { useBookPlot } from "../../hooks/usePlot";

export default function PlotBookingDialog({ isOpen, onClose, plotId }) {
    const bookMutation = useBookPlot();

    const [form, setForm] = useState({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        totalCost: "",
        paidAmount: "",
        paymentMode: "",
        paymentType: "",
        aadhar: "",
        associateId: "",
        associateUserAuthId: "",
        referId: "",
        teamHeadId: "",
        pbNumber: "",
        plotBookingPlan: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bookMutation.mutateAsync({ id: plotId, ...form });
            toast.success("Plot booked successfully!");
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to book plot");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b">
                    <h2 className="text-lg font-semibold">Book Plot</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Customer Name *</label>
                        <input name="customerName" value={form.customerName} onChange={handleChange} required
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Contact</label>
                            <input name="customerContact" value={form.customerContact} onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Aadhar</label>
                            <input name="aadhar" value={form.aadhar} onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Address</label>
                        <textarea name="customerAddress" value={form.customerAddress} onChange={handleChange} rows={2}
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Total Cost *</label>
                            <input name="totalCost" type="number" value={form.totalCost} onChange={handleChange} required
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Paid Amount *</label>
                            <input name="paidAmount" type="number" value={form.paidAmount} onChange={handleChange} required
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <CustomSelect
                                label="Payment Mode"
                                value={form.paymentMode}
                                onChange={(val) => setForm(prev => ({ ...prev, paymentMode: val }))}
                                options={[
                                    { label: "Cash", value: "cash" },
                                    { label: "Online", value: "online" },
                                    { label: "Cheque", value: "cheque" }
                                ]}
                            />
                        </div>
                        <div>
                            <CustomSelect
                                label="Payment Type"
                                value={form.paymentType}
                                onChange={(val) => setForm(prev => ({ ...prev, paymentType: val }))}
                                options={[
                                    { label: "Fully Paid", value: "fully_paid" },
                                    { label: "EMI", value: "emi" },
                                    { label: "Partial", value: "partial" }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Associate ID</label>
                            <input name="associateId" value={form.associateId} onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">PB Number</label>
                            <input name="pbNumber" value={form.pbNumber} onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 text-sm mt-1" />
                        </div>
                    </div>
                    <div>
                        <CustomSelect
                            label="Booking Plan (Days)"
                            value={form.plotBookingPlan}
                            onChange={(val) => setForm(prev => ({ ...prev, plotBookingPlan: val }))}
                            options={[
                                { label: "Fully Paid", value: "0" },
                                { label: "15 Days", value: "15" },
                                { label: "45 Days", value: "45" },
                                { label: "90 Days", value: "90" },
                                { label: "120 Days", value: "120" }
                            ]}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 sm:pt-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                        <button type="submit" disabled={bookMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">
                            Book Plot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
