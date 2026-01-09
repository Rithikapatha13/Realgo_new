import { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function Admin() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");

  const admins = [
    {
      id: 1,
      name: "Brandwar",
      phone: "8885378378",
      role: "Admin",
      verified: true,
      image: "",
    },
    {
      id: 2,
      name: "Shashi",
      phone: "9000402310",
      role: "Admin",
      verified: true,
      image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
  ];

  const clearAll = () => {
    setSearch("");
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-semibold">Admin</h1>

        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          Add Admin
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search Admin by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-4 py-2 text-sm w-64"
        />

        <button
          onClick={clearAll}
          className="text-red-500 text-sm flex items-center gap-1"
        >
          ✕ Clear All
        </button>
      </div>

      {/* ADMIN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative"
          >
            {/* MENU */}
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === admin.id ? null : admin.id)
              }
              className="absolute top-4 right-4 text-slate-600"
            >
              <MoreVertical size={18} />
            </button>

            {/* DROPDOWN */}
            {openMenuId === admin.id && (
              <div className="absolute top-10 right-4 bg-white border rounded-md shadow-md w-44 z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  View Admin
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
                  Delete Admin
                </button>
              </div>
            )}

            {/* CONTENT */}
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {admin.image ? (
                  <img
                    src={admin.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {admin.name}
                </h3>

                <p className="text-xs text-gray-500 mt-1">{admin.phone}</p>

                <p className="text-xs text-gray-500">{admin.role}</p>

                {admin.verified && (
                  <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                    ✔ VERIFIED
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
