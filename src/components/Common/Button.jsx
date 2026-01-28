import React, { useState, forwardRef, useImperativeHandle } from "react";

const Button = forwardRef(
  (
    {
      onClick,
      children,
      loading = false,
      onError = null,
      disabled = false,
      variant = "primary",
      size = "medium",
      className = "",
    },
    ref
  ) => {
    const [isError, setIsError] = useState(false);

    const baseStyles =
      className +
      " font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

    const sizeStyles = {
      small: "px-2 py-1 text-sm",
      medium: "px-3 py-1 text-base",
      large: "px-4 py-2 text-lg",
    };

    const variantStyles = {
      primary: isError
        ? "bg-red-600 hover:bg-red-700 border-2 border-transparent"
        : "bg-blue-600 hover:bg-blue-700 border-2 border-transparent",
      secondary: isError
        ? "bg-red-600 hover:bg-red-700 border-2 border-transparent"
        : "bg-gray-600 hover:bg-gray-700 border-2 border-transparent",
      outline: isError
        ? "border-2 border-red-600 text-red-600 bg-red-50"
        : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent",
    };

    const isDisabled = disabled || loading;
    const disabledStyles = isDisabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";
    const textColor = variant === "outline" && !isError ? "" : "text-white";
    const shakeAnimation = isError ? "animate-shake" : "";

    const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${textColor} ${shakeAnimation}`;

    const triggerError = () => {
      setIsError(true);
      if (onError) onError();
      setTimeout(() => setIsError(false), 600);
    };

    useImperativeHandle(ref, () => ({
      triggerError,
    }));

    const handleClick = (e) => {
      if (!isDisabled && onClick) {
        onClick(e);
      }
    };

    return (
      <>
        <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
        <button
          className={buttonClasses}
          onClick={handleClick}
          disabled={isDisabled}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {children}
        </button>
      </>
    );
  }
);

Button.displayName = "Button";

export default Button;
