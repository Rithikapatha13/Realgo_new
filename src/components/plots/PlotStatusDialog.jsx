import { useState } from "react";
import { X } from "lucide-react";

export default function PlotStatusDialog({ isOpen, onClose, onStatusChange }) {
    const [status, setStatus] = useState("AVAILABLE");
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-semibold">Change Plot Status</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-5 space-y-4">
                    <p className="text-sm text-slate-500">Select a new status for the plot and provide a reason for the change.</p>

                    <div>
                        <label className="text-sm font-medium text-slate-700">New Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                            <option value="AVAILABLE">Available</option>
                            <option value="BOOKED">Booked</option>
                            <option value="REGISTERED">Registered</option>
                            <option value="HOLD">Hold</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Reason</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1" placeholder="Reason for status change..." />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                        <button onClick={() => onStatusChange(status, reason)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
