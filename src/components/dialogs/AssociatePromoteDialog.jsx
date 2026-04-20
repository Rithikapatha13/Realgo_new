import { useState, useEffect } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { usePromoteUser, useGetUsersNames } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { TrendingUp, Loader2, UserPlus } from "lucide-react";

export default function AssociatePromoteDialog({ isOpen, onClose, user }) {
    const [selectedReferId, setSelectedReferId] = useState("");
    const { mutateAsync: promoteUser, isPending } = usePromoteUser();
    const { data: usersNamesResponse, isLoading: isLoadingNames } = useGetUsersNames();
    const usersList = usersNamesResponse?.data?.items || [];

    useEffect(() => {
        if (user && user.referId) {
            setSelectedReferId(user.referId);
        } else {
            setSelectedReferId("");
        }
    }, [user, isOpen]);

    const handleConfirm = async () => {
        if (!user || !selectedReferId) return;
        try {
            await promoteUser({ id: user.id, referId: selectedReferId });
            toast.success("User promoted successfully");
            onClose();
        } catch (error) {
            console.error("Failed to promote user", error);
            toast.error("Failed to promote user");
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={`Promote Associate: ${user?.username || ''}`}
            width="max-w-[280px]"
        >
            <div className="space-y-4 py-2 px-1">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Current Placement</p>
                        <p className="text-sm font-black text-indigo-900">{user?.referId ? "Has Upliner" : "Direct Branch"}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Select New Upliner / Manager</label>
                    <div className="relative">
                        <select
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer bg-white appearance-none"
                            value={selectedReferId}
                            onChange={(e) => setSelectedReferId(e.target.value)}
                            disabled={isLoadingNames}
                        >
                            <option value="" disabled>Select a user...</option>
                            {usersList.map((u) => (
                                <option key={u.id} value={u.id} disabled={u.id === user?.id}>
                                    {u.username} {u.id === user?.id && "(Self)"}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <UserPlus size={18} />
                        </div>
                    </div>
                    {isLoadingNames && <p className="text-[10px] text-slate-400 animate-pulse ml-1">Loading users list...</p>}
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
                        disabled={isPending || !selectedReferId || selectedReferId === user?.referId}
                        className="px-8 py-2.5 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        {isPending ? "Promoting..." : "Update Placement"}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
