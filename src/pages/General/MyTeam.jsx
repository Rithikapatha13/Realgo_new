import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";

export default function MyTeam() {
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");

  // ===============================
  // DUMMY TEAM DATA
  // ===============================
  const team = [
    {
      id: "G501",
      fullName: "KANDURU SATYA",
      phone: "9618778829",
      role: "Director",
      companyName: "Grupe",
      teamHead: "Self",
      verified: true,
    },
    {
      id: "G502",
      fullName: "MD SATTAR",
      phone: "9866517860",
      role: "Director",
      companyName: "Grupe",
      teamHead: "Self",
      verified: true,
    },
    {
      id: "G503",
      fullName: "MANTHRI SRINIVAS",
      phone: "8297653159",
      role: "Director",
      companyName: "Grupe",
      teamHead: "Self",
      verified: true,
    },
    {
      id: "G504",
      fullName: "KAMBIKA",
      phone: "9395582789",
      role: "Director",
      companyName: "Grupe",
      teamHead: "Self",
      verified: true,
    },
    {
      id: "G505",
      fullName: "BAMRU",
      phone: "9494817381",
      role: "Deputy Director",
      companyName: "Grupe",
      teamHead: "KAMBIKA",
      verified: true,
    },
    {
      id: "G506",
      fullName: "VRAVINDER",
      phone: "8317556306",
      role: "Director",
      companyName: "Grupe",
      teamHead: "Self",
      verified: true,
    },
    {
      id: "G507",
      fullName: "PODSETTY RAMESH",
      phone: "9848847729",
      role: "Deputy Director",
      companyName: "Grupe",
      teamHead: "KANDURU SATYA",
      verified: true,
    },
    {
      id: "G508",
      fullName: "JVAMSHI",
      phone: "8978470361",
      role: "General Manager",
      companyName: "Grupe",
      teamHead: "KANDURU SATYA",
      verified: true,
    },
    {
      id: "G509",
      fullName: "R SAIKUMAR",
      phone: "9700881187",
      role: "Deputy Director",
      companyName: "Grupe",
      teamHead: "KANDURU SATYA",
      verified: true,
    },
    {
      id: "G510",
      fullName: "AJAY KUMAR",
      phone: "9123456789",
      role: "Deputy General Manager",
      companyName: "Grupe",
      teamHead: "RAMESH",
      verified: true,
    },
    {
      id: "G511",
      fullName: "KOMMINENI RAJU",
      phone: "9988776655",
      role: "Manager Sales",
      companyName: "Grupe",
      teamHead: "AJAY KUMAR",
      verified: true,
    },
    {
      id: "G512",
      fullName: "UDAY KUMAR YADAV",
      phone: "9001122334",
      role: "General Manager",
      companyName: "Grupe",
      teamHead: "RAMESH",
      verified: true,
    },
    {
      id: "G513",
      fullName: "MARLAPATI VENKATA",
      phone: "9887766554",
      role: "General Manager",
      companyName: "Grupe",
      teamHead: "RAMESH",
      verified: true,
    },
    {
      id: "G514",
      fullName: "SANDAGALLA SHIVA",
      phone: "9700159942",
      role: "Deputy Director",
      companyName: "Grupe",
      teamHead: "KANDURU SATYA",
      verified: true,
    },
    {
      id: "G515",
      fullName: "BUCHALA NARESH",
      phone: "8143824551",
      role: "Deputy Director",
      companyName: "Grupe",
      teamHead: "KANDURU SATYA",
      verified: true,
    },
  ];
  

  // ===============================
  // 🔍 SEARCH FILTER (REUSABLE)
  // ===============================
  const filteredTeam = useSearchFilter(team, search, [
    "fullName",
    "phone",
    "role",
    "companyName",
  ]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-semibold">My Team</h1>

        <button
          onClick={() => navigate("/team-tree")}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Team Tree
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name / phone / role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-64"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />

        <button
          onClick={() => {
            setSearch("");
            setSelectedDate("");
          }}
          className="ml-auto text-red-500 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border p-4 relative"
          >
            {/* MENU */}
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === user.id ? null : user.id)
              }
              className="absolute top-4 right-4"
            >
              <MoreVertical size={18} />
            </button>

            {/* CARD */}
            <h3 className="font-semibold">{user.fullName}</h3>
            <p className="text-sm text-gray-500">{user.phone}</p>
            <p className="text-sm text-gray-500">{user.role}</p>

            {user.verified && (
              <p className="text-green-600 text-xs mt-2">✔ VERIFIED</p>
            )}
          </div>
        ))}

        {/* NO RESULTS */}
        {filteredTeam.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full text-center">
            No matching results
          </p>
        )}
      </div>
    </div>
  );
}
