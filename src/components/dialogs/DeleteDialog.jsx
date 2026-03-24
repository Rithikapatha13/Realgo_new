import { useState } from "react";
import ModalWrapper from "@/components/Common/ModalWrapper";

export default function DeleteDialog({ isOpen, onClose, onConfirm, title, message, itemName }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Confirm Deletion"}
            width="max-w-md"
        >
            <div className="space-y-4 py-2">
                <p className="text-sm text-gray-600">
                    {message || "Are you sure you want to delete this item? This action cannot be undone."}
                    {itemName && <span className="font-semibold block mt-2 text-gray-800">{itemName}</span>}
                </p>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
