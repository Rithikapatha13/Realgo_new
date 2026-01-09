import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function Roles() {
  const [roles, setRoles] = useState([
    { id: 100, name: "Admin" },
    { id: 101, name: "Company" },
    { id: 110, name: "Director" },
    { id: 111, name: "Senior Deputy Director" },
    { id: 112, name: "Deputy Director" },
    { id: 113, name: "General Manager" },
    { id: 114, name: "Deputy General Manager" },
    { id: 115, name: "Manager Sales" },
    { id: 116, name: "Deputy Manager" },
    { id: 117, name: "Executive Sales" },
    { id: 118, name: "Freelancer" },
    { id: 10001, name: "Accounts" },
    { id: 100001, name: "PRO" },
  ]);

  const handleEdit = (role) => {
    alert(`Edit role: ${role.name}`);
  };

  const handleDelete = (role) => {
    alert(`Delete role: ${role.name}`);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
          Roles
        </h1>

        <button className="sm:ml-auto w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          Add Role
        </button>
      </div>

      {/* ROLES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            {/* LEFT */}
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {role.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">{role.id}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleEdit(role)}
                className="p-2 hover:bg-slate-100 rounded-md"
              >
                <Pencil size={16} className="text-slate-600" />
              </button>

              <button
                onClick={() => handleDelete(role)}
                className="p-2 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
