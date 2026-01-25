import { Plus, Tag, Check } from "lucide-react";
import { useRef, useEffect } from "react";

// interface writing is tough, bro learn this
interface NoteFormProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  editingNoteId: string | null;
  newNote: { title: string; content: string; tag: string };
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function NoteForm({
  isExpanded,
  setIsExpanded,
  editingNoteId,
  newNote,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newNote.content]);

  return (
    <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
      <form
        onSubmit={onSubmit}
        className={`
          border rounded-2xl p-2 shadow-2xl transition-all duration-300
          ${
            editingNoteId
              ? "bg-sky-500/5 border-sky-500/30 ring-1 ring-sky-500/20"
              : "bg-neutral-900/80 border-white/10"
          }
        `}
      >
        {(isExpanded || editingNoteId) && (
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newNote.title}
            onChange={onInputChange}
            autoFocus={!!editingNoteId}
            className="
              w-full bg-transparent px-4 py-3 outline-none text-lg
              font-semibold text-white placeholder:text-neutral-600
            "
          />
        )}

        <textarea
          ref={textareaRef}
          name="content"
          placeholder="Take a note..."
          value={newNote.content}
          onChange={onInputChange}
          onFocus={() => setIsExpanded(true)}
          rows={isExpanded || editingNoteId ? 3 : 1}
          className="
            w-full bg-transparent px-4 py-2 outline-none resize-none
            text-neutral-300 placeholder:text-neutral-500 leading-relaxed
          "
          required
        />

        {(isExpanded || editingNoteId) && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 mt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/50 border border-white/5">
              <Tag size={14} className="text-neutral-500" />
              <input
                type="text"
                name="tag"
                placeholder="Tag"
                value={newNote.tag}
                onChange={onInputChange}
                className="bg-transparent text-xs text-neutral-400 outline-none w-20"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !newNote.content.trim()}
                className="
                  bg-sky-500 text-white px-5 py-2 rounded-xl text-sm
                  font-bold flex items-center gap-2 cursor-pointer transition-all
                  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {editingNoteId ? <Check size={16} /> : <Plus size={16} />}
                {loading ? "..." : editingNoteId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
