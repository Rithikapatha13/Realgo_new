import React, { useState, useEffect } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";
import Button from "@/components/Common/Button";
import { Trash2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function DeleteCompanyModal({ open, onClose, onConfirm, companyName, isLoading }) {
  const [step, setStep] = useState(1); // 1 = confirmation, 2 = name input
  const [confirmationName, setConfirmationName] = useState("");

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setStep(1);
      setConfirmationName("");
    }
  }, [open]);

  const isNameConfirmed = confirmationName.trim() === companyName?.trim();

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Delete Company"
      width="max-w-md"
    >
      <div className="p-1">
        {/* STEP 1: Are you sure? */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Are you sure?</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">This action will archive the company.</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm text-slate-600 leading-relaxed">
                You are about to delete <span className="font-bold text-slate-900">"{companyName}"</span>.
                The company will be hidden from the platform, but all data records will remain safe.
              </p>
              <div className="flex items-start gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900 text-xs">
                <ShieldCheck size={14} className="shrink-0 mt-0.5 text-indigo-500" />
                <p className="font-medium">Data Integrity Safe: Leads, Projects, and User history will be preserved.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 rounded-xl"
                onClick={onClose}
              >
                No, Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setStep(2)}
              >
                Yes, Delete
              </Button>
            </div>
          </>
        )}

        {/* STEP 2: Type name to confirm */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Final Confirmation</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Type the company name to proceed.</p>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Type company name to confirm
              </label>
              <input
                type="text"
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium ${
                  isNameConfirmed
                    ? "border-emerald-500 bg-emerald-50/30 text-emerald-900"
                    : "border-slate-200 bg-slate-50 focus:border-red-400 text-slate-700"
                }`}
                placeholder={`Type "${companyName}"`}
                value={confirmationName}
                onChange={(e) => setConfirmationName(e.target.value)}
              />
              {!isNameConfirmed && confirmationName.length > 0 && (
                <p className="text-[10px] text-red-500 font-bold ml-1 animate-pulse">Name mismatch. Please check spelling.</p>
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
                className={`flex-1 rounded-xl shadow-lg transition-all duration-300 ${
                  isNameConfirmed && !isLoading
                    ? "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                    : "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={onConfirm}
                disabled={!isNameConfirmed || isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Delete"}
              </Button>
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
}
