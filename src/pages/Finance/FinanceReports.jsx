import React, { useState } from 'react';
import { 
    FileText, Calendar, Filter, Loader2, 
    Download, Printer, ChevronRight, 
    TrendingUp, TrendingDown, Landmark,
    PieChart, BarChart2, Briefcase
} from "lucide-react";
import { 
    useGetLedgers, useGetSubledgers,
    useGetLedgerStatement, useGetTrialBalance,
    useGetProfitLoss, useGetBalanceSheet
} from "@/hooks/useFinance";
import dayjs from "dayjs";
import DateRangePicker from "@/components/Common/DateRangePicker";

const FinanceReports = () => {
    const [activeTab, setActiveTab] = useState("ledger");
    const [filters, setFilters] = useState({
        ledgerId: "",
        subledgerId: "",
        startDate: dayjs().startOf('month').format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
    });

    const tabs = [
        { id: "ledger", name: "Ledger Statement", icon: FileText },
        { id: "trial", name: "Trial Balance", icon: BarChart2 },
        { id: "pl", name: "Profit & Loss", icon: PieChart },
        { id: "bs", name: "Balance Sheet", icon: Briefcase }
    ];

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
                    <p className="text-slate-500 text-sm mt-1">Analyze your company's financial health</p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium transition-all hover:bg-slate-50 text-sm">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md shadow-indigo-100 text-sm">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 mb-8 w-fit shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? "bg-primary-600 text-white shadow-sm shadow-indigo-100" 
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Filter Bar (Conditional) */}
            {(activeTab === 'ledger' || activeTab === 'pl') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm flex flex-wrap items-center gap-4">
                    {activeTab === 'ledger' && (
                        <>
                            <div className="flex-1 min-w-[200px]">
                                <LedgerSelect 
                                    value={filters.ledgerId} 
                                    onChange={(val) => setFilters({...filters, ledgerId: val, subledgerId: ""})} 
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <SubledgerSelect 
                                    ledgerId={filters.ledgerId} 
                                    value={filters.subledgerId} 
                                    onChange={(val) => setFilters({...filters, subledgerId: val})} 
                                />
                            </div>
                        </>
                    )}
                    <DateRangePicker 
                        startDate={filters.startDate} 
                        endDate={filters.endDate} 
                        onChange={(start, end) => setFilters({ ...filters, startDate: start, endDate: end })} 
                    />
                </div>
            )}

            {/* Report Content */}
            <div className="space-y-6">
                {activeTab === 'ledger' && <LedgerStatementReport filters={filters} />}
                {activeTab === 'trial' && <TrialBalanceReport />}
                {activeTab === 'pl' && <ProfitLossReport filters={filters} />}
                {activeTab === 'bs' && <BalanceSheetReport />}
            </div>
        </div>
    );
};

const LedgerSelect = ({ value, onChange }) => {
    const { data } = useGetLedgers();
    const ledgers = data?.items || [];
    return (
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none">
            <option value="">Select Ledger Head</option>
            {ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
    );
};

const SubledgerSelect = ({ ledgerId, value, onChange }) => {
    const { data } = useGetSubledgers(ledgerId);
    const subledgers = data?.items || [];
    const ledger = useGetLedgers().data?.items?.find(l => l.id === ledgerId);

    if (!ledger?.bifurcated) return null;

    return (
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none">
            <option value="">All Sub-ledgers</option>
            {subledgers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
    );
};

const LedgerStatementReport = ({ filters }) => {
    const { data, isLoading } = useGetLedgerStatement(filters);
    const entries = data?.items || [];

    if (!filters.ledgerId) return (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-20 text-center text-slate-400">
            Select a ledger head to view statement
        </div>
    );

    if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></div>;

    let runningBalance = 0;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase">Particulars</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase text-right">Debit</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase text-right">Credit</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase text-right">Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {entries.map((entry) => {
                        const amount = entry.amount;
                        if (entry.entryType === 'DEBIT') runningBalance += amount;
                        else runningBalance -= amount;

                        return (
                            <tr key={entry.id} className="text-sm hover:bg-slate-50/50">
                                <td className="px-6 py-2.5 whitespace-nowrap">{dayjs(entry.transaction.transactionDate).format("DD-MM-YYYY")}</td>
                                <td className="px-6 py-2.5">
                                    <div className="font-medium text-slate-900">{entry.transaction.narration || "No narration"}</div>
                                    <div className="text-[10px] text-slate-400">Ref: {entry.transaction.referenceNumber || "#NOREF"}</div>
                                </td>
                                <td className="px-6 py-2.5 text-right font-medium text-indigo-600">
                                    {entry.entryType === 'DEBIT' ? `₹${amount.toLocaleString()}` : '—'}
                                </td>
                                <td className="px-6 py-2.5 text-right font-medium text-amber-600">
                                    {entry.entryType === 'CREDIT' ? `₹${amount.toLocaleString()}` : '—'}
                                </td>
                                <td className="px-6 py-2.5 text-right font-bold text-slate-900">
                                    ₹{Math.abs(runningBalance).toLocaleString()} {runningBalance >= 0 ? '(Dr)' : '(Cr)'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const TrialBalanceReport = () => {
    const { data, isLoading } = useGetTrialBalance();
    const items = data?.items || [];

    if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></div>;

    const totalDr = items.reduce((sum, i) => sum + i.totalDebit, 0);
    const totalCr = items.reduce((sum, i) => sum + i.totalCredit, 0);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase">Ledger Account</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase">Account Type</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase text-right">Debit Balance</th>
                        <th className="px-6 py-2.5 text-xs font-bold text-slate-500 uppercase text-right">Credit Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <tr key={item.id} className="text-sm hover:bg-slate-50/50">
                            <td className="px-6 py-2.5 font-medium text-slate-900">{item.name}</td>
                            <td className="px-6 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">{item.accountType}</td>
                            <td className="px-6 py-2.5 text-right font-medium">{item.netBalance > 0 ? `₹${item.netBalance.toLocaleString()}` : '—'}</td>
                            <td className="px-6 py-2.5 text-right font-medium">{item.netBalance < 0 ? `₹${Math.abs(item.netBalance).toLocaleString()}` : '—'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-white/80 border border-slate-200 text-slate-800 font-bold">
                        <td colSpan="2" className="px-6 py-2.5">TOTAL</td>
                        <td className="px-6 py-2.5 text-right">₹{totalDr.toLocaleString()}</td>
                        <td className="px-6 py-2.5 text-right">₹{totalCr.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const ProfitLossReport = ({ filters }) => {
    const { data, isLoading } = useGetProfitLoss(filters);
    const report = data?.data;

    if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></div>;
    if (!report) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" /> Income
                </h3>
                <div className="space-y-3">
                    {report.income.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-600 font-medium">{i.name}</span>
                            <span className="font-bold text-slate-900">₹{i.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 font-bold text-slate-900 bg-slate-50 px-4 rounded-xl mt-4">
                        <span>Total Income</span>
                        <span>₹{report.totalIncome.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="text-rose-500" /> Expense
                </h3>
                <div className="space-y-3">
                    {report.expense.map((e, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-600 font-medium">{e.name}</span>
                            <span className="font-bold text-slate-900">₹{e.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 font-bold text-slate-900 bg-slate-50 px-4 rounded-xl mt-4">
                        <span>Total Expense</span>
                        <span>₹{report.totalExpense.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className={`md:col-span-2 p-6 rounded-xl shadow-sm flex items-center justify-between ${report.netProfit >= 0 ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Net {report.netProfit >= 0 ? 'Profit' : 'Loss'}</h4>
                    <div className="text-4xl font-semibold">₹{Math.abs(report.netProfit).toLocaleString()}</div>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                    {report.netProfit >= 0 ? <TrendingUp size={48} /> : <TrendingDown size={48} />}
                </div>
            </div>
        </div>
    );
};

const BalanceSheetReport = () => {
    const { data, isLoading } = useGetBalanceSheet();
    const report = data?.data;

    if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin inline text-indigo-600" /></div>;
    if (!report) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">Assets</h3>
                <div className="space-y-3">
                    {report.assets.map((a, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-600 font-medium">{a.name}</span>
                            <span className="font-bold text-slate-900">₹{a.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 font-bold text-slate-900 bg-indigo-50 px-4 rounded-xl mt-4">
                        <span>Total Assets</span>
                        <span>₹{report.totalAssets.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">Liabilities & Equity</h3>
                <div className="space-y-3">
                    {report.liabilities.map((l, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-600 font-medium">{l.name}</span>
                            <span className="font-bold text-slate-900">₹{l.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 font-bold text-slate-900 bg-indigo-50 px-4 rounded-xl mt-4">
                        <span>Total Liabilities</span>
                        <span>₹{report.totalLiabilities.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceReports;
