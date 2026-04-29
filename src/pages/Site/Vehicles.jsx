import React, { useState, useEffect } from "react";
import { 
  Car, 
  Trash2, 
  Edit3, 
  Truck,
  User,
  Phone,
  Plus,
  Settings,
  Activity,
  AlertCircle
} from "lucide-react";
import apiClient from "../../config/apiClient";
import { toast } from "react-hot-toast";
import Button from "@/components/Common/Button";
import ModalWrapper from "@/components/Common/ModalWrapper";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleName: "",
    vehicleNumber: "",
    vehicleType: "CAR",
    driverName: "",
    driverPhone: "",
    status: "AVAILABLE"
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/site-visits/vehicles");
      setVehicles(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await apiClient.put(`/site-visits/vehicles/${editingVehicle.id}`, formData);
        toast.success("Vehicle updated successfully");
      } else {
        await apiClient.post("/site-visits/vehicles", formData);
        toast.success("Vehicle added successfully");
      }
      setShowModal(false);
      setEditingVehicle(null);
      setFormData({
        vehicleName: "",
        vehicleNumber: "",
        vehicleType: "CAR",
        driverName: "",
        driverPhone: "",
        status: "AVAILABLE"
      });
      fetchVehicles();
    } catch (err) {
      toast.error("Error saving vehicle");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await apiClient.delete(`/site-visits/vehicles/${id}`);
        toast.success("Vehicle deleted");
        fetchVehicles();
      } catch (err) {
        toast.error("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Fleet</h2>
          <Button 
            onClick={() => {
              setEditingVehicle(null);
              setFormData({
                vehicleName: "",
                vehicleNumber: "",
                vehicleType: "CAR",
                driverName: "",
                driverPhone: "",
                status: "AVAILABLE"
              });
              setShowModal(true);
            }}
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
          >
            Add Vehicle
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-48 animate-pulse bg-slate-50 rounded-xl border border-slate-100"></div>)
        ) : vehicles.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
              <Car className="mx-auto text-slate-200 w-16 h-16" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No vehicles in fleet</p>
          </div>
        ) : vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className={`h-1.5 w-full ${
              v.status === 'AVAILABLE' ? 'bg-emerald-500' : 
              v.status === 'ON_TRIP' ? 'bg-blue-500' : 
              'bg-amber-500'
            }`} />
            
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      v.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 
                      v.status === 'ON_TRIP' ? 'bg-blue-50 text-blue-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                        {v.vehicleType === 'BUS' ? <Truck size={20} /> : <Car size={20} />}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                        onClick={() => {
                            setEditingVehicle(v);
                            setFormData(v);
                            setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-primary-600 rounded-md transition-colors"
                        >
                        <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{v.vehicleName}</h3>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-0.5">{v.vehicleNumber}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-50">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                <User className="w-3 h-3" /> DRIVER
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 truncate">{v.driverName || "N/A"}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                <Phone className="w-3 h-3" /> PHONE
                            </div>
                            <p className="text-[11px] font-bold text-slate-700">{v.driverPhone || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Activity className={`w-3 h-3 ${v.status === 'AVAILABLE' ? 'text-emerald-500' : 'text-blue-500'}`} />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {v.status.replace("_", " ")}
                            </span>
                        </div>
                        {v.status === 'ON_TRIP' && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">
                                IN MOTION
                            </span>
                        )}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <ModalWrapper
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVehicle ? "Update Vehicle" : "Register Vehicle"}
      >
        <form onSubmit={handleSubmit} className="p-1 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Name</label>
                  <input 
                    required
                    value={formData.vehicleName}
                    onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                    placeholder="e.g. Maruti Swift"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reg. Number</label>
                  <input 
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="e.g. KA 01 AB 1234"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                  <select 
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  >
                    <option value="CAR">Car / SUV</option>
                    <option value="BUS">Bus / Traveller</option>
                    <option value="BIKE">Two Wheeler</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_TRIP">On Trip</option>
                    <option value="MAINTENANCE">Under Maintenance</option>
                  </select>
                </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Assignment</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        value={formData.driverName}
                        onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                        placeholder="Driver Full Name"
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none"
                    />
                    <input 
                        value={formData.driverPhone}
                        onChange={(e) => setFormData({...formData, driverPhone: e.target.value})}
                        placeholder="Driver Phone No."
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
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
                  className="flex-[2]"
                  icon={<Settings size={16} />}
                >
                  {editingVehicle ? "Update Vehicle" : "Register Vehicle"}
                </Button>
            </div>
        </form>
      </ModalWrapper>
    </div>
  );
}

