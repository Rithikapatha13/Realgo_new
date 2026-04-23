import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateNote, useUpdateNote, useGetNoteById } from "../../hooks/useNotes";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NotesFormDialog = ({ action, editId, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: noteResponse, isLoading } = useGetNoteById(editId);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  useEffect(() => {
    if (action === "Update" && noteResponse?.notes) {
      setTitle(noteResponse.notes.title || "");
      setDescription(noteResponse.notes.description || "");
    }
  }, [action, noteResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (action === "Create") {
        await createMutation.mutateAsync({ title, description });
        toast.success("Note created successfully");
      } else {
        await updateMutation.mutateAsync({ id: editId, title, description });
        toast.success("Note updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} note`);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {action} Note
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Fill in the details below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading && action === "Update" ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : (
            <form id="note-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <div className="bg-white">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    className="h-64 mb-12"
                    placeholder="Write your note here..."
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="note-form"
            disabled={createMutation.isPending || updateMutation.isPending || (isLoading && action === "Update")}
            className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {action === "Create" ? "Save Note" : "Update Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesFormDialog;
