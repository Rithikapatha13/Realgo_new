// import { useState } from "react";
// import { X } from "lucide-react";

// export default function Modal({
//   trigger,        // what you click
//   title,
//   children,       // modal content
//   width = "max-w-lg",
//   height = "auto",
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Trigger */}
//       <div onClick={() => setOpen(true)} className="cursor-pointer">
//         {trigger}
//       </div>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setOpen(false)}
//           />

//           {/* Modal box */}
//           <div
//             className={`relative bg-white rounded-xl shadow-lg w-full ${width}`}
//             style={{ height }}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4 border-b">
//               <h2 className="text-base font-semibold text-slate-800">
//                 {title}
//               </h2>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="p-1 rounded hover:bg-slate-100"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-5 overflow-auto">
//               {children}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState } from "react";
import { X } from "lucide-react";

export default function ModalWrapper({
  trigger,
  title,
  children,
  width = "max-w-lg",
  height = "auto",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal box */}
          <div
            className={`relative bg-white rounded-xl shadow-lg w-full ${width}`}
            style={{ height }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-base font-semibold text-slate-800">
                {title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
