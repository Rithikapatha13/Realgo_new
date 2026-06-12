import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Download, CheckCircle, X, Users2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { getUser } from '@/services/auth.service';

export default function BulkTelecallerUpload() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [prog, setProg] = useState(0);
  const [result, setResult] = useState(null);

  async function uploadFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Only CSV and Excel files are supported');
      return;
    }
    setUploading(true);
    setProg(20);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = import.meta.env.VITE_API_URL + '/telecallers/bulk';
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProg(percent > 90 ? 90 : percent);
        },
      });
      setProg(100);
      setResult({ count: response.data.count || 0, name: file.name });
      toast.success(`${response.data.count || 0} telecallers imported successfully`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Import failed');
      setProg(0);
    } finally {
      setUploading(false);
      setTimeout(() => setProg(0), 1000);
    }
  }

  function dlSample() {
    const csv = `username,firstName,lastName,phone,email\njohn_doe,John,Doe,9876543210,john@example.com\njane_smith,Jane,Smith,9876543211,jane@example.com`;
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'Telecallers_sample.csv';
    a.click();
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      <button
        onClick={() => navigate("/users?role=telecaller")}
        className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Telecaller Dashboard
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Users2 size={24} className="text-indigo-600" />
          Bulk Upload Telecallers
        </h1>
        <p className="text-sm text-slate-500 mt-1">Upload a CSV or Excel file to batch create telecaller records.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* CSV upload area */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" /> Batch Processor
            </h2>
            <button onClick={dlSample} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 focus:outline-none">
              <Download size={14} /> Sample.csv
            </button>
          </div>
          <div
            className={`h-40 flex items-center justify-center gap-4 border-2 border-dashed rounded-xl px-4 transition-all duration-300 relative cursor-pointer ${drag ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            onClick={() => document.getElementById('csv-input').click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); uploadFile(e.dataTransfer.files[0]); }}
          >
            {!uploading ? (
              <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">CSV or Excel format</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-xs absolute">
                <div className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing file...
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: prog + '%' }} />
                </div>
              </div>
            )}
          </div>
          <input id="csv-input" type="file" accept=".csv, .xlsx" className="hidden" onChange={(e) => uploadFile(e.target.files[0])} />
          {result && !uploading && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-emerald-800">Success: {result.count} Telecallers Imported</div>
                <div className="text-xs text-emerald-600 truncate mt-0.5">{result.name}</div>
              </div>
              <button onClick={() => setResult(null)} className="text-emerald-600 hover:text-emerald-800 transition-colors p-1">
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        {/* Guidelines */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-l-4 border-amber-500 pl-3">Upload Guidelines</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> Ensure <b>Phone</b> numbers are unique. Duplicates will be skipped.</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> <b>Username</b> will be generated from firstName if left empty.</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> <b>Password</b> defaults to <code>Realgo@123</code> if omitted.</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> First row must contain exactly these headers: <code>username,firstName,lastName,phone,email</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
