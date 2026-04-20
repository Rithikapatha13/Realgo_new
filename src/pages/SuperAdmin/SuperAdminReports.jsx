import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, X, ArrowLeft } from "lucide-react";
import { getCompanyDashboard } from "@/services/company.service";
import Button from "@/components/Common/Button";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export default function SuperAdminReports() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await getCompanyDashboard();
      if (data.success) {
        setCompanies(data.data.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedCompanyId) return;

    const company = companies.find((c) => c.id === selectedCompanyId);
    if (!company) return;

    // Prepare data for preview (mirroring Image 3)
    const reportRow = {
      Company_Name: company.company,
      Total_Admins: company._count?.admins || 0,
      Total_Plots: company._count?.plots || 0,
      Total_Projects: company._count?.projects || 0,
      Total_Users: company._count?.users || 0,
      Modules: (company.modules || []).join(", "),
    };

    setPreviewData(reportRow);
  };

  const handleDownloadExcel = () => {
    if (!previewData) return;

    const company = companies.find((c) => c.id === selectedCompanyId);
    const fileName = `${company?.company || "Company"}_Report_${dayjs().format("YYYY-MM-DD")}.xlsx`;

    const worksheet = XLSX.utils.json_to_sheet([previewData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Company Reports</h1>
          <p className="text-sm text-slate-500">Generate and export company-wide activity reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* SELECTION CARD (Matching Image 1) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Company Report</h2>
            <p className="text-sm text-slate-400">Download report</p>
          </div>

          <div className="space-y-4">
            {/* Company Scrollable Inline List */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Company</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-slate-50 border border-indigo-100 rounded-2xl py-3 px-3 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-slate-700 font-medium text-sm"
              >
                <option value="">-- Select a Company --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range (Basic for now) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-slate-700 text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-slate-700 text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full py-4 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white flex items-center justify-center gap-2 text-lg font-bold transition-transform active:scale-[0.98]"
            onClick={handleGenerateReport}
            disabled={!selectedCompanyId}
          >
            <FileDown size={22} />
            Report
          </Button>
        </div>

        {/* INFO CARD */}
        {/* <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <TableIcon size={24} />
          </div>
          <h3 className="text-lg font-bold text-indigo-900">Report Preview</h3>
          <p className="text-sm text-indigo-700 leading-relaxed">
            Selecting a company and clicking "Report" will generate a live preview of the data. 
            Review the metrics below before exporting to Excel.
          </p>
          {!previewData && (
            <div className="mt-8 pt-8 border-t border-indigo-100 flex flex-col items-center text-indigo-300">
              <Landmark size={48} strokeWidth={1} />
              <p className="text-xs font-bold uppercase tracking-widest mt-4">No Preview Available</p>
            </div>
          )}
        </div> */}
      </div>

      {/* PREVIEW TABLE (Matching Image 3 headers) */}
      {previewData && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live Preview</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewData(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Clear Preview"
              >
                <X size={18} />
              </button>
              <Button
                variant="primary"
                className="py-1.5 px-4 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Company_Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total_Admr</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total_Plot</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total_Proj</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Total_Use</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Modules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{previewData.Company_Name}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{previewData.Total_Admr}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{previewData.Total_Plot}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{previewData.Total_Proj}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{previewData.Total_Use}</td>
                  <td className="px-6 py-5 text-[11px] text-slate-500 max-w-xs break-words whitespace-normal leading-relaxed">{previewData.Modules}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
