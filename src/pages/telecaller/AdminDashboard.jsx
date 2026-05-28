// src/pages/telecaller/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTelecaller } from "@/hooks/useTelecaller";
import ModalWrapper from "@/components/Common/ModalWrapper";
import FormInput from "@/components/Common/FormInput";
import { Users2, Upload } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { mutate: addTelecaller } = useAddTelecaller();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTelecaller(form);
    setShowModal(false);
    setForm({ username: "", firstName: "", lastName: "", phone: "", email: "" });
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Users2 size={24} className="text-indigo-600" />
          Add Telecaller
        </h1>
        <p className="text-sm text-slate-500 mt-1">Add a single telecaller or bulk upload via CSV</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Users2 size={18} />
          Add Single Telecaller
        </button>
        <button
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
          onClick={() => navigate("/telecaller/bulk")}
        >
          <Upload size={18} />
          Bulk Upload Telecallers
        </button>
      </div>

      {/* Single-add modal */}
      <ModalWrapper open={showModal} onClose={() => setShowModal(false)} title="Add New Telecaller">
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <FormInput
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <FormInput
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
          <FormInput
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Save Telecaller
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
}
