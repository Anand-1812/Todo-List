import { Trash2, Loader2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        className="
        relative w-full max-w-sm bg-neutral-900
        border border-white/10 rounded-3xl p-8 shadow-2xl
        animate-in zoom-in-95 duration-200
      "
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="
            w-16 h-16 bg-red-500/10 rounded-full
            flex items-center justify-center mb-6
          "
          >
            <Trash2 className="text-red-500" size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Note?</h3>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            This action cannot be undone. This note will be permanently removed
            from your workspace.
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="
                w-full py-4 bg-red-500 hover:bg-red-600
                text-white font-bold rounded-2xl cursor-pointer
                disabled:opacity-50 flex items-center justify-center gap-2
              "
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Deleting..." : "Delete Permanently"}
            </button>
            <button
              onClick={onClose}
              className="
                w-full py-4 bg-neutral-800 text-neutral-300
                font-bold rounded-2xl cursor-pointer
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
