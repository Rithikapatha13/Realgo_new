import { useState } from "react";
import { User, Camera, Lock, LogOut } from "lucide-react";
import FormInput from "../../components/Common/FormInput";
import ModalWrapper from "../../components/Common/ModalWrapper";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "Admin",
    email: "keerthichandhana.brandwar@gmail.com",
    phone: "1111111111",
    role: "Admin",
    company: "Grupe",
  });

  const [form, setForm] = useState(profile);

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-64px)]">
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8 lg:p-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-slate-100 flex items-center justify-center">
              <User size={48} className="text-slate-500" />
            </div>

            <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
              <Camera size={16} />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              {profile.username}
            </h1>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
          <ReadOnly label="Username" value={profile.username} />
          <ReadOnly label="Email" value={profile.email} />
          <ReadOnly label="Phone" value={profile.phone} />
          <ReadOnly label="Role" value={profile.role} />
          <ReadOnly label="Company" value={profile.company} />
        </div>

        {/* ACTIONS */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 sm:justify-between">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-slate-100">
            <Lock size={16} />
            Change Password
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <ModalWrapper
              title="Edit Profile"
              width="max-w-2xl"
              trigger={
                <button className="px-5 py-2 border rounded-lg text-sm hover:bg-slate-100">
                  Edit Profile
                </button>
              }
            >
              {(closeModal) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Username *"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />

                  <FormInput label="Email *" value={form.email} disabled />

                  <FormInput
                    label="Phone *"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <FormInput label="Role *" value={form.role} disabled />
                  <FormInput
                    label="Company *"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />

                  <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setForm(profile);
                        closeModal();
                      }}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setProfile(form);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </ModalWrapper>

          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 mt-1">{value}</p>
    </div>
  );
}
