import { useState } from "react";
import { MoreVertical, Search } from "lucide-react";

export default function User() {
  const [openMenuId, setOpenMenuId] = useState(null);

  // ===============================
  // DUMMY USERS DATA
  // ===============================
  const users = [
    {
      id: "G501",
      name: "KANDURU SATYA",
      phone: "9618778829",
      role: "Director",
      company: "Company",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "G502",
      name: "MD SATTAR",
      phone: "9866517860",
      role: "Director",
      company: "Company",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: "G504",
      name: "MANTHRI",
      phone: "8297653159",
      role: "Director",
      company: "Company",
      image: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      id: "G505",
      name: "KAMBIKA",
      phone: "9395582789",
      role: "Director",
      company: "Company",
      image: "https://randomuser.me/api/portraits/women/48.jpg",
    },
    {
      id: "G508",
      name: "BAMRU",
      phone: "9494817381",
      role: "Deputy Director",
      company: "KAMBIKA",
      image: "",
    },
    {
      id: "G509",
      name: "VRAVINDER",
      phone: "8317556306",
      role: "Director",
      company: "Company",
      image: "",
    },
    {
      id: "G512",
      name: "PODSETTY",
      phone: "9848847729",
      role: "Deputy Director",
      company: "KANDURU SATYA",
      image: "",
    },
    {
      id: "G513",
      name: "JVAMSHI",
      phone: "8978470361",
      role: "General Manager",
      company: "KANDURU SATYA",
      image: "",
    },
    {
      id: "G514",
      name: "R SAIKUMAR",
      phone: "9700881187",
      role: "Deputy Director",
      company: "KANDURU SATYA",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center mb-5">
        <h1 className="text-xl font-semibold">All Users</h1>

        <div className="ml-auto flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
            Add Associate
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
            Add Bulk Associates
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select className="border rounded-md px-3 py-2 text-sm">
          <option>Select Associate By Name</option>
        </select>

        <div className="relative">
          <input
            placeholder="Search by ID"
            className="border rounded-md px-3 py-2 pr-10 text-sm"
          />
          <Search
            className="absolute right-2 top-2.5 text-gray-500"
            size={16}
          />
        </div>

        <div className="relative">
          <input
            placeholder="Search by Phone No"
            className="border rounded-md px-3 py-2 pr-10 text-sm"
          />
          <Search
            className="absolute right-2 top-2.5 text-gray-500"
            size={16}
          />
        </div>

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>Select Designation</option>
        </select>

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>Select Status</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          ↑↓ Sort by Date
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          ↑↓ Sort by Team Head
        </button>

        <button className="ml-auto text-red-500 text-sm">✕ Clear All</button>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative"
          >
            {/* MENU */}
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === user.id ? null : user.id)
              }
              className="absolute top-4 right-4 text-gray-600"
            >
              <MoreVertical size={18} />
            </button>

            {openMenuId === user.id && (
              <div className="absolute top-10 right-4 bg-white border rounded-md shadow-md w-48 z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  View Associate
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
                  Send Delete Request
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-orange-600">
                  Send Inactive Request
                </button>
              </div>
            )}

            {/* CONTENT */}
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>

                <p className="text-xs text-gray-500 mt-1">{user.phone}</p>

                <p className="text-xs text-gray-500 flex items-center gap-1">
                  🏢 {user.company}
                </p>

                <p className="text-xs text-gray-500">ID: {user.id}</p>

                <p className="text-xs text-gray-500">Role: {user.role}</p>

                <p className="text-xs text-green-600 font-medium mt-1">
                  ✔ VERIFIED
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
