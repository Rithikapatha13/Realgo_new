import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Search,
  Phone,
  Calendar,
} from "lucide-react";

export default function FormInput({
  label,
  type = "text",
  variant = "primary",
  maxLength,
  showCharCount = false,
  error,
  helperText,
  icon: CustomIcon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Determine input type
  const inputType = type === "password" && showPassword ? "text" : type;

  // Get icon based on type
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;

    switch (type) {
      case "email":
        return Mail;
      case "password":
        return Lock;
      case "search":
        return Search;
      case "tel":
        return Phone;
      case "date":
        return Calendar;
      case "text":
        return props.name === "username" || props.name === "name" ? User : null;
      default:
        return null;
    }
  };

  const Icon = getIcon();

  // Get variant classes
  const getVariantClasses = () => {
    if (error) return "border-red-400 focus:ring-red-500 focus:border-red-500";

    switch (variant) {
      case "primary":
        return "border-indigo-400 focus:ring-indigo-500 focus:border-indigo-500";
      case "secondary":
        return "border-slate-400 focus:ring-slate-500 focus:border-slate-500";
      case "success":
        return "border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500";
      case "danger":
        return "border-red-400 focus:ring-red-500 focus:border-red-500";
      case "warning":
        return "border-amber-400 focus:ring-amber-500 focus:border-amber-500";
      default:
        return "border-indigo-400 focus:ring-indigo-500 focus:border-indigo-500";
    }
  };

  const handleChange = (e) => {
    if (showCharCount || maxLength) {
      setCharCount(e.target.value.length);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="sm:my-1 my-2">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative ">
        {/* Left Icon */}
        {Icon && type !== "password" && (
          <div className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        {/* Input Field */}

        <input
          {...props}
          type={inputType}
          maxLength={maxLength}
          onChange={handleChange}
          className={`
    w-full px-3 py-2 rounded-lg
    border-2 transition-all duration-200  
    focus:outline-none focus:ring-2
    ${Icon && type !== "password" ? "pl-10" : ""}
    ${type === "password" ? "pr-10" : ""}
    ${getVariantClasses()}
    disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
  `}
        />
        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Helper Text, Error, or Character Count */}

      {(error || helperText || (showCharCount && maxLength)) && (
        <div className="flex justify-between items-center min-h-5">
          <div className="flex-1">
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && helperText && (
              <p className="text-xs text-slate-500">{helperText}</p>
            )}
          </div>

          {showCharCount && maxLength && (
            <p
              className={`text-xs ${
                charCount >= maxLength ? "text-red-500" : "text-slate-400"
              }`}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
