import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalWrapper({
  open,
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) {
  const isModalOpen = open ?? isOpen;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Centered Modal for all screens */}
      <div
        className={`flex absolute inset-0 items-center justify-center p-4 transition-all duration-300 ${isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        <div
          className={`relative bg-white rounded-2xl shadow-xl w-full ${width} max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 px-3 sm:px-5 overflow-auto flex-1 custom-scrollbar">
            {typeof children === "function" ? children(onClose) : children}
          </div>
        </div>
      </div>
    </div>
  );
}
