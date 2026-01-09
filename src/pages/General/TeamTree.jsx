
import { useState } from "react";

export default function TeamTree() {
  const [associate, setAssociate] = useState("");
  const [designation, setDesignation] = useState("");

  // const treeData = {
  //   id: "1",
  //   name: "D ASHOK",
  //   role: "Director",
  //   code: "G564",
  //   image: "https://randomuser.me/api/portraits/men/75.jpg",
  //   children: [
  //     {
  //       id: "2",
  //       name: "DASARI BHARATH KUMAR",
  //       role: "Deputy Director",
  //       code: "G1486",
  //       children: [
  //         { id: "5", name: "AJAY", role: "Deputy GM", code: "G2248" },
  //         { id: "6", name: "KOMMINENI", role: "Manager", code: "G1517" },
  //       ],
  //     },
  //   ],
  // };

  const treeData = {
    id: "1",
    name: "D ASHOK",
    role: "Director",
    code: "G564",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    children: [
      {
        id: "2",
        name: "DASARI BHARATH KUMAR",
        role: "Deputy Director",
        code: "G1486",
        children: [
          {
            id: "5",
            name: "AJAY",
            role: "Deputy General Manager",
            code: "G2248",
          },
          {
            id: "6",
            name: "KOMMINENI",
            role: "Manager Sales",
            code: "G1517",
          },
        ],
      },
      {
        id: "3",
        name: "OMAR AHMED",
        role: "Deputy Director",
        code: "G829",
        children: [
          {
            id: "7",
            name: "DAHIPALE AKSHADA",
            role: "Manager Sales",
            code: "G2964",
          },
        ],
      },
      {
        id: "4",
        name: "RAMESH NENAVATH",
        role: "Deputy Director",
        code: "G2490",
        children: [
          {
            id: "8",
            name: "MARLAPATI VENKATA",
            role: "General Manager",
            code: "G2517",
          },
          {
            id: "9",
            name: "UDAYKUMAR YADAV",
            role: "General Manager",
            code: "G2525",
          },
        ],
      },
    ],
  };
  
  return (
    <div className="p-4 sm:p-6 h-full overflow-auto">
      <h1 className="text-lg sm:text-xl font-semibold mb-4">Team Tree</h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={associate}
          onChange={(e) => setAssociate(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">Associate</option>
          <option>D ASHOK</option>
        </select>

        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">Designation</option>
          <option>Director</option>
        </select>

        <button
          onClick={() => {
            setAssociate("");
            setDesignation("");
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm w-full sm:w-auto"
        >
          ✕
        </button>
      </div>

      {/* TREE */}
      <div className="w-full overflow-x-auto border-t pt-10">
        <div className="flex justify-center min-w-max px-4 sm:px-8">
          <TreeNode node={treeData} />
        </div>
      </div>
    </div>
  );
}

function TreeNode({ node }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border rounded-lg p-3 text-center shadow-sm min-w-[130px] sm:min-w-[160px]">
        <img
          src={node.image}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2"
        />
        <p className="text-sm font-semibold">{node.name}</p>
        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
          {node.role}
        </span>
        <p className="text-[11px] text-gray-500 mt-1">{node.code}</p>
      </div>

      {node.children && (
        <>
          <div className="h-6 w-px bg-gray-400" />
          <div className="flex gap-6 mt-4">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
