import React, { useState } from "react";
import { FileUp, Download, AlertCircle, CheckCircle2, Loader2, FileSpreadsheet } from "lucide-react";
import apiClient from "../../config/apiClient";
import { toast } from "react-hot-toast";
import Button from "@/components/Common/Button";

export default function Migration() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
            setFile(selectedFile);
        } else {
            toast.error("Please select a valid Excel file (.xlsx or .xls)");
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setResults(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await apiClient.post("/migrate/import-accounts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setResults(res.data);
                setFile(null);
            } else {
                toast.error(res.data.message || "Upload failed");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error uploading file");
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        // Simple CSV template for now
        const headers = ["Account Group", "Account Name", "Sub-Account Name", "Balance", "Balance Type (DEBIT/CREDIT)"];
        const rows = [
            ["CURRENT ASSETS", "CASH IN HAND", "", "5000", "DEBIT"],
            ["SUNDRY DEBTORS", "CLIENT A", "", "10000", "DEBIT"],
            ["SUNDRY CREDITORS", "VENDOR X", "", "2000", "CREDIT"]
        ];
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "account_migration_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-800">Account Migration</h1>
                <p className="text-sm text-slate-500">Bulk import your chart of accounts and opening balances from an Excel file.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Upload Box */}
                    <div className={`border-2 border-dashed rounded-2xl p-12 transition-all text-center space-y-4 ${
                        file ? 'border-primary-500 bg-primary-50/30' : 'border-slate-200 hover:border-primary-300 bg-slate-50/50'
                    }`}>
                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                            file ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                            <FileSpreadsheet size={32} />
                        </div>
                        
                        <div className="space-y-1">
                            {file ? (
                                <>
                                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">{(file.size / 1024).toFixed(2)} KB</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-slate-600">Drop your Excel file here or click to browse</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">Supported: .xlsx, .xls</p>
                                </>
                            )}
                        </div>

                        <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="hidden" 
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="block cursor-pointer">
                            <span className="inline-flex px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                Browse Files
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <Button 
                            variant="ghost" 
                            icon={<Download size={16} />}
                            onClick={downloadTemplate}
                            className="text-slate-500"
                        >
                            Download Template
                        </Button>
                        <Button 
                            disabled={!file || loading}
                            onClick={handleUpload}
                            icon={loading ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
                            className="px-12"
                        >
                            {loading ? "Processing..." : "Start Import"}
                        </Button>
                    </div>

                    {/* Results Table */}
                    {results && (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">Import Results</span>
                                </div>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black">
                                    {results.message}
                                </span>
                            </div>
                            
                            {results.errors && results.errors.length > 0 && (
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-rose-500">
                                        <AlertCircle size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Warnings & Errors</span>
                                    </div>
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                        {results.errors.map((err, idx) => (
                                            <div key={idx} className="p-2 bg-rose-50 text-rose-700 text-[11px] font-medium rounded-lg border border-rose-100">
                                                {err}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-primary-600 rounded-2xl p-6 text-white space-y-4 shadow-xl shadow-primary-200">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Instructions</h3>
                        <ul className="space-y-3 text-xs text-primary-50 font-medium list-disc ml-4">
                            <li>Use the provided template for best results.</li>
                            <li><strong>Account Groups</strong> must exist or they will be auto-created as Assets.</li>
                            <li><strong>Balances</strong> should be positive numbers.</li>
                            <li>Specify <strong>DEBIT</strong> or <strong>CREDIT</strong> for the balance type.</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Mapping</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Groups</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-black text-slate-500 uppercase">Auto-Create</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Ledgers</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-black text-slate-500 uppercase">Mandatory</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Subledgers</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-black text-slate-500 uppercase">Optional</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
