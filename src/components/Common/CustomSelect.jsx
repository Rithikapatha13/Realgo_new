import { useState, useRef, useEffect } from "react";
import { ChevronDown, XCircle } from "lucide-react";

/**
 * CustomSelect - A premium, mobile-optimized dropdown to replace native <select>
 * 
 * @param {Array} options - [{label: "Text", value: "val"}] or ["val1", "val2"]
 * @param {string} value - Selected value
 * @param {Function} onChange - Callback for value changes
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Input label
 * @param {boolean} disabled - Is disabled
 * @param {string} error - Error message
 */
export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select Option",
  label,
  disabled = false,
  error,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on Outside Click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:my-1 my-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-slate-700 block mb-1.5 ml-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* TOGGLE */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between
          ${disabled ? "bg-slate-50 border-slate-100 cursor-not-allowed text-slate-400" : "bg-white"}
          ${error ? "border-red-400" : isOpen ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm" : "border-slate-200 hover:border-slate-300"}
        `}
      >
        <span className={`text-sm ${!selectedOption && "text-slate-400 font-medium" || "text-slate-900 font-bold"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-[150] p-2 animate-in fade-in slide-in-from-top-2 duration-200 py-2 max-h-60 overflow-y-auto custom-scrollbar">
          {normalizedOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 italic">No options available</div>
          ) : (
            normalizedOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer mb-1 last:mb-0
                  ${opt.value === value ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"}
                `}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}
