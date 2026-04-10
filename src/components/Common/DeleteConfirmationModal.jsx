import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { Trash2, ShieldCheck, AlertTriangle, X } from "lucide-react";

/**
 * A professional Two-Step Delete Confirmation Modal.
 * Step 1: Initial warning and "Are you sure?"
 * Step 2: Verification by typing the item name.
 */
export default function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  itemName = "", 
  warningText = "This action will permanently delete this record.",
  isLoading = false 
}) {
  const [step, setStep] = useState(1);
  const [confirmationName, setConfirmationName] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setConfirmationName("");
    }
  }, [open]);

  const isNameConfirmed = confirmationName.trim() === itemName?.trim();

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-md"
    >
      <div className="p-1">
        {/* STEP 1: INITIAL WARNING */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Are you sure?</h3>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-0.5">Critical Action Required</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm text-slate-600 leading-relaxed">
                You are about to delete <span className="font-bold text-slate-900">"{itemName}"</span>.
                {warningText}
              </p>
              <div className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900 text-[11px]">
                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-amber-500" />
                <p className="font-medium">Before proceeding, please ensure this is the intended action.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 rounded-xl"
                onClick={onClose}
              >
                No, Keep it
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                onClick={() => setStep(2)}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: SECURITY VERIFICATION */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-sm">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Verify Action</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Two-step verification requested.</p>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Type the name <span className="text-slate-900 italic">"{itemName}"</span> to confirm
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold ${isNameConfirmed
                    ? "border-emerald-500 bg-emerald-50/20 text-emerald-900"
                    : "border-slate-100 bg-slate-50 focus:border-red-400 text-slate-700"
                    }`}
                  placeholder={`Type "${itemName}" here...`}
                  value={confirmationName}
                  onChange={(e) => setConfirmationName(e.target.value)}
                />
                {!isNameConfirmed && confirmationName.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                    <X size={18} />
                  </div>
                )}
              </div>
              {!isNameConfirmed && confirmationName.length > 0 && (
                <p className="text-[10px] text-red-500 font-bold ml-1 animate-pulse tracking-tight">Name does not match. Please re-check.</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 rounded-xl"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                ← Back
              </Button>
              <Button
                variant="primary"
                className={`flex-1 rounded-xl shadow-xl transition-all duration-300 ${isNameConfirmed && !isLoading
                  ? "bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-red-200"
                  : "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                onClick={onConfirm}
                disabled={!isNameConfirmed || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
