import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs(startDate || new Date()));
    const [selection, setSelection] = useState({ start: startDate, end: endDate });
    const containerRef = useRef(null);

    // Sync external changes
    useEffect(() => {
        setSelection({ start: startDate, end: endDate });
    }, [startDate, endDate]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateClick = (date) => {
        const dateStr = date.format("YYYY-MM-DD");
        
        if (!selection.start || (selection.start && selection.end)) {
            // Start new selection
            const newSelection = { start: dateStr, end: null };
            setSelection(newSelection);
        } else {
            // Complete selection
            let start = selection.start;
            let end = dateStr;
            
            // Swap if end is before start
            if (dayjs(end).isBefore(dayjs(start))) {
                [start, end] = [end, start];
            }
            
            const newSelection = { start, end };
            setSelection(newSelection);
            onChange(start, end);
            setIsOpen(false);
        }
    };

    const renderCalendar = (month) => {
        const startOfMonth = month.startOf('month');
        const endOfMonth = month.endOf('month');
        const startDay = startOfMonth.day();
        const daysInMonth = month.daysInMonth();

        const days = [];
        // Empty slots for start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const date = month.date(d);
            const dateStr = date.format("YYYY-MM-DD");
            
            const isStart = selection.start === dateStr;
            const isEnd = selection.end === dateStr;
            const isInRange = selection.start && selection.end && 
                             dayjs(dateStr).isAfter(dayjs(selection.start)) && 
                             dayjs(dateStr).isBefore(dayjs(selection.end));
            const isToday = dayjs().format("YYYY-MM-DD") === dateStr;

            days.push(
                <button
                    key={dateStr}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm transition-all relative
                        ${isStart || isEnd ? 'bg-indigo-600 text-white font-bold z-10' : ''}
                        ${isInRange ? 'bg-indigo-50 text-indigo-600 rounded-none' : ''}
                        ${!isStart && !isEnd && !isInRange ? 'hover:bg-slate-100 text-slate-700' : ''}
                        ${isToday && !isStart && !isEnd ? 'text-indigo-600 font-bold border border-indigo-200' : ''}
                    `}
                >
                    {d}
                    {isStart && selection.end && <div className="absolute right-0 w-1/2 h-full bg-indigo-50 -z-10" />}
                    {isEnd && selection.start && <div className="absolute left-0 w-1/2 h-full bg-indigo-50 -z-10" />}
                </button>
            );
        }

        return (
            <div className="p-4 w-[280px]">
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft size={18} className="text-slate-500" />
                    </button>
                    <span className="text-sm font-bold text-slate-800">{month.format("MMMM YYYY")}</span>
                    <button type="button" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronRight size={18} className="text-slate-500" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center font-medium text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {days}
                </div>
            </div>
        );
    };

    const displayDate = (date) => date ? dayjs(date).format("MMM DD, YYYY") : "...";

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:border-indigo-300 transition-all text-sm font-medium shadow-sm w-full sm:w-auto"
            >
                <CalendarIcon size={18} className="text-slate-400" />
                <span className="text-slate-700">
                    {selection.start ? `${displayDate(selection.start)} - ${displayDate(selection.end || selection.start)}` : "Select Date Range"}
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] flex flex-col sm:flex-row overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="flex flex-col sm:flex-row">
                        {renderCalendar(currentMonth)}
                        <div className="hidden sm:block border-l border-slate-100" />
                        <div className="hidden sm:block">
                            {renderCalendar(currentMonth.add(1, 'month'))}
                        </div>
                    </div>
                    
                    {/* Presets/Action Bar */}
                    <div className="bg-slate-50 p-4 border-t sm:border-t-0 sm:border-l border-slate-200 min-w-[160px] flex flex-col gap-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Presets</p>
                        {[
                            { label: 'Today', days: 0 },
                            { label: 'Last 7 Days', days: 7 },
                            { label: 'Last 30 Days', days: 30 },
                            { label: 'This Month', type: 'month' },
                            { label: 'Year to Date', type: 'year' }
                        ].map(preset => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                    let start, end;
                                    if (preset.type === 'month') {
                                        start = dayjs().startOf('month').format("YYYY-MM-DD");
                                        end = dayjs().format("YYYY-MM-DD");
                                    } else if (preset.type === 'year') {
                                        start = dayjs().startOf('year').format("YYYY-MM-DD");
                                        end = dayjs().format("YYYY-MM-DD");
                                    } else {
                                        start = dayjs().subtract(preset.days, 'day').format("YYYY-MM-DD");
                                        end = dayjs().format("YYYY-MM-DD");
                                    }
                                    onChange(start, end);
                                    setIsOpen(false);
                                }}
                                className="text-left py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-white hover:text-indigo-600 rounded-lg transition-all"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
