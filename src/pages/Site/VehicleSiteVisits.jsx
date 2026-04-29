import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Calendar, 
  MapPin, 
  Navigation,
  Fuel,
  User,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Plus
} from "lucide-react";
import apiClient from "../../config/apiClient";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { getUser, getUserType } from "../../services/auth.service";
import { resolveImageUrl } from "../../utils/common";
import FileInput from "../../components/Common/FileUpload";
import Button from "../../components/Common/Button";

export default function VehicleSiteVisits() {
  const user = getUser();
  const userType = getUserType()?.toLowerCase();
  const isAdmin = userType === "admin" || userType === "superadmin" || userType === "super-admin";
  
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    associateId: user?.id || "",
    associateName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    userAuthId: user?.userAuthId || "",
    teamHeadId: user?.teamHeadId || "",
    teamHeadName: user?.teamHeadName || "",
    date: format(new Date(), "yyyy-MM-dd"),
    totalAmountSpent: 0,
    startKms: "",
    endKms: "",
    totalKms: "",
    projects: [],
    driverName: "",
    paymentReceipt: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, vehiclesRes] = await Promise.all([
        apiClient.get("/site-visits/vehicle-site-visits"),
        apiClient.get("/site-visits/vehicles")
      ]);
      setLogs(logsRes.data.items || []);
      setVehicles(vehiclesRes.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-calculate Total KM
  useEffect(() => {
    if (formData.startKms && formData.endKms) {
      const diff = parseFloat(formData.endKms) - parseFloat(formData.startKms);
      setFormData(prev => ({ ...prev, totalKms: diff > 0 ? diff.toString() : "0" }));
    }
  }, [formData.startKms, formData.endKms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict KM Validation
    if (parseFloat(formData.endKms) <= parseFloat(formData.startKms)) {
      toast.error("End KM must be greater than Start KM");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/site-visits/vehicle-site-visits", formData);
      toast.success("Trip log submitted for approval");
      setShowModal(false);
      fetchData();
      // Reset form
      setFormData({
        ...formData,
        totalAmountSpent: 0,
        startKms: "",
        endKms: "",
        totalKms: "",
        paymentReceipt: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving log");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiClient.patch(`/site-visits/vehicle-site-visits/${id}/status`, { status });
      toast.success(`Trip ${status.toLowerCase()} successfully`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Trips & Logistics</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
          variant="primary"
          size="sm"
        >
          <Plus size={16} /> Log New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Section */}
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-primary-600 p-6 rounded-xl text-black shadow-md shadow-primary-500/10 relative overflow-hidden group">
                <div className="relative z-10">
                    <History className="w-8 h-8 mb-4 opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Total Trips</p>
                    <h2 className="text-3xl font-black">{logs.length}</h2>
                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                        <div>
                            <p className="text-black/60 text-[9px] font-black uppercase">Active Now</p>
                            <p className="text-md font-black">{vehicles.filter(v => v.status === 'ON_TRIP').length}</p>
                        </div>
                        <Navigation className="w-5 h-5 opacity-40" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400">APPROVED</span>
                      <span className="text-sm font-black text-emerald-600">{logs.filter(l => l.status === 'APPROVED').length}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400">PENDING</span>
                      <span className="text-sm font-black text-amber-600">{logs.filter(l => l.status === 'PENDING').length}</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(logs.filter(l => l.status === 'APPROVED').length / (logs.length || 1)) * 100}%` }}
                      />
                   </div>
                </div>
            </div>
        </div>

        {/* Trips Timeline */}
        <div className="lg:col-span-3 space-y-3">
            {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-28 animate-pulse bg-slate-50 rounded-xl border border-slate-100"></div>)
            ) : logs.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                    <Truck className="mx-auto text-slate-200 w-12 h-12" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No trips logged yet</p>
                </div>
            ) : logs.map((log) => (
                <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-black transition-all">
                            <Truck size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                        {format(new Date(log.date), "EEE, MMM dd")}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300">|</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                      log.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                      log.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                      'bg-amber-50 text-amber-600'
                                    }`}>
                                      {log.status}
                                    </span>
                                </div>
                                
                                {isAdmin && log.status === 'PENDING' && (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleStatusUpdate(log.id, 'APPROVED')}
                                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                      title="Approve & Create Expense"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(log.id, 'REJECTED')}
                                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                                      title="Reject"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  </div>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-slate-800">
                                {log.vehicle?.vehicleName || "Vehicle"} 
                                <span className="text-xs font-medium text-slate-400 ml-2">({log.vehicle?.vehicleNumber || log.vehicleNumber})</span>
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <User size={12} className="text-slate-300" /> {log.associateName}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <Navigation size={12} className="text-slate-300" /> {log.startKms} - {log.endKms} ({log.totalKms} KM)
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    <Fuel size={12} /> ₹{log.totalAmountSpent}
                                </div>
                                {log.paymentReceipt && (
                                  <a 
                                    href={resolveImageUrl(log.paymentReceipt)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-primary-600 hover:underline"
                                  >
                                    <Eye size={12} /> View Receipt
                                  </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Log New Trip</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle</label>
                  <select 
                    required
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleName} ({v.vehicleNumber}) - {v.status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Associate</label>
                  <input 
                    readOnly
                    value={formData.associateName}
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel / Trip Amount (₹)</label>
                  <input 
                    type="number"
                    required
                    value={formData.totalAmountSpent}
                    onChange={(e) => setFormData({...formData, totalAmountSpent: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start KM</label>
                  <input 
                    type="number"
                    required
                    value={formData.startKms}
                    onChange={(e) => setFormData({...formData, startKms: e.target.value})}
                    placeholder="Start"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End KM</label>
                  <input 
                    type="number"
                    required
                    value={formData.endKms}
                    onChange={(e) => setFormData({...formData, endKms: e.target.value})}
                    placeholder="End"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total</label>
                  <div className="w-full px-4 py-2 bg-primary-600 border-primary-100 border rounded-lg text-sm font-black text-black text-center">
                    {formData.totalKms || "0"} KM
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Receipt / Bill</label>
                <FileInput 
                   name="paymentReceipt"
                   onChange={(e) => setFormData(prev => ({ ...prev, paymentReceipt: e.target.value }))}
                   accept="image/*"
                   maxSizeMB={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  loading={isSubmitting}
                  className="flex-[2]"
                >
                  Submit Trip Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

