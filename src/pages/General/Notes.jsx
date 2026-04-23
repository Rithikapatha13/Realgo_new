import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, X, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetNotesData, useDeleteNote } from "../../hooks/useNotes";
import NotesFormDialog from "../../components/General/NotesFormDialog";
import { format } from "date-fns";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notesAction, setNotesAction] = useState("Create");
  const [editItemId, setEditItemId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const pageSize = 20;

  const {
    data: notesResponse,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetNotesData(pageSize, searchQuery);

  const deleteNoteMutation = useDeleteNote();

  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  const notesData = notesResponse?.pages.flatMap((page) => page.items) || [];

  const handleEdit = (id) => {
    setEditItemId(id);
    setNotesAction("Update");
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditItemId(null);
    setNotesAction("Create");
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNoteMutation.mutateAsync(id);
        toast.success("Note deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete note");
        console.error(error);
      }
    }
  };

  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Notes</h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your personal notes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Note
          </button>
        </div>
      </div>

      {/* ═══════════ FILTERS ═══════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search notes by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-sm text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
          >
            <X size={16} /> Clear
          </button>
        )}
      </div>

      {/* ═══════════ CONTENT ═══════════ */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10 font-medium">Error loading notes.</div>
      ) : notesData.length === 0 ? (
        <div className="text-center text-slate-500 py-10 font-medium">No notes found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notesData.map((note, index) => (
            <div
              key={note.id}
              ref={index === notesData.length - 1 ? observerRef : null}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{note.title}</h3>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-2 bg-slate-100 px-2 py-1 rounded-md">
                    {format(new Date(note.createdAt), "dd MMM yyyy")}
                  </span>
                </div>
                <div 
                    className="text-sm text-slate-600 line-clamp-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: note.description }}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(note.id)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Note"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
          )}
        </div>
      )}

      {showDialog && (
        <NotesFormDialog
          action={notesAction}
          editId={editItemId}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default Notes;
