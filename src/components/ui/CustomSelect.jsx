import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, name, className, children, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const containerRef = useRef(null);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      updateCoords();
      setIsOpen(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // We also need to check if they clicked inside the portal
        if (!event.target.closest('.custom-select-portal')) {
          setIsOpen(false);
        }
      }
    }
    
    function handleScroll() {
      if (isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Use capture phase to catch all scrolls
      window.addEventListener("resize", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  // Parse children to extract options
  const options = [];
  React.Children.forEach(children, child => {
    if (!child) return;
    
    if (child.type === 'option') {
      options.push({
        value: child.props.value !== undefined ? child.props.value : child.props.children,
        label: child.props.children,
        disabled: child.props.disabled
      });
    } else if (Array.isArray(child)) {
      child.forEach(subChild => {
        if (subChild && subChild.type === 'option') {
          options.push({
            value: subChild.props.value !== undefined ? subChild.props.value : subChild.props.children,
            label: subChild.props.children,
            disabled: subChild.props.disabled
          });
        }
      });
    } else if (child.type === React.Fragment && child.props && child.props.children) {
      React.Children.forEach(child.props.children, subChild => {
        if (subChild && subChild.type === 'option') {
          options.push({
            value: subChild.props.value !== undefined ? subChild.props.value : subChild.props.children,
            label: subChild.props.children,
            disabled: subChild.props.disabled
          });
        }
      });
    }
  });

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  const handleSelect = (option) => {
    if (option.disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: option.value } });
    }
  };

  const renderDropdown = () => {
    if (!isOpen || !coords) return null;
    
    return createPortal(
      <div 
        className="absolute z-[9999] mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-top custom-select-portal"
        style={{ top: coords.top, left: coords.left, width: coords.width }}
      >
        <ul className="py-1 m-0 list-none">
          {options.map((option, idx) => (
            <li
              key={`${option.value}-${idx}`}
              onClick={() => handleSelect(option)}
              className={`relative py-2 pl-3 pr-9 cursor-pointer select-none truncate transition-colors
                ${option.disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'}
                ${String(value) === String(option.value) ? 'bg-primary-50/50 font-bold text-primary-700' : ''}
              `}
            >
              <span className="block truncate" title={option.label}>{option.label}</span>
              {String(value) === String(option.value) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
                  <Check size={16} />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative w-full text-sm" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`flex items-center justify-between w-full text-left truncate relative pr-8 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={selectedOption ? selectedOption.label : 'Select...'}
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : 'Select...'}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
          <ChevronDown size={16} />
        </span>
      </button>
      {renderDropdown()}
    </div>
  );
}
