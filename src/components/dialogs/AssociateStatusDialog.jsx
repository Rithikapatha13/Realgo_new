import { useState, useEffect } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { useUpdateUserStatus } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { Shield, Loader2 } from "lucide-react";

const STATUS_OPTIONS = ["VERIFIED", "PENDING", "REJECT", "HOLD", "INACTIVE"];

export default function AssociateStatusDialog({ isOpen, onClose, user }) {
    const [selectedStatus, setSelectedStatus] = useState("");
    const { mutateAsync: updateStatus, isPending } = useUpdateUserStatus();

    useEffect(() => {
        if (user) {
            setSelectedStatus(user.status || "PENDING");
        }
    }, [user, isOpen]);

    const handleConfirm = async () => {
        if (!user || !selectedStatus) return;
        try {
            await updateStatus({ id: user.id, status: selectedStatus });
            toast.success("User status updated successfully");
            onClose();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={`Update Status: ${user?.username || ''}`}
            width="max-w-md"
        >
            <div className="space-y-6 py-4 px-2">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Current Status</p>
                        <p className="text-sm font-black text-indigo-900">{user?.status || "Unknown"}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Account Status</label>
                    <select
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer bg-white"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending || selectedStatus === user?.status}
                        className="px-8 py-2.5 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        {isPending ? "Updating..." : "Update Status"}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
