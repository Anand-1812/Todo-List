import { useState, useRef, useEffect } from "react";
import type { Route } from "./+types/Dashboard";
import { requireAuth, getUserNotes } from "~/utils/auth.router";
import {
  Plus,
  Search,
  MoreVertical,
  Pin,
  Tag,
  Trash2,
  Pencil,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface Note {
  _id: string;
  title?: string;
  content: string;
  tag?: string;
  color?: string;
  isPinned?: boolean;
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const notes = await getUserNotes(request);
  return { user, notes };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, notes } = loaderData;
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newNote, setNewNote] = useState({ title: "", content: "", tag: "" });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.content.trim()) return;

    setLoading(true);
    try {
      const url = editingNoteId
        ? `http://localhost:3001/api/notes/${editingNoteId}`
        : "http://localhost:3001/api/notes";

      const method = editingNoteId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(editingNoteId ? "Note updated" : "Note saved");
        resetForm();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/notes/${id}/pin`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to pin note");
    }
  };

  const resetForm = () => {
    setNewNote({ title: "", content: "", tag: "" });
    setEditingNoteId(null);
    setIsExpanded(false);
  };

  const handleEditInitiate = (note: Note) => {
    setNewNote({
      title: note.title || "",
      content: note.content,
      tag: note.tag || "",
    });
    setEditingNoteId(note._id);
    setIsExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/notes/${noteToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        toast.success("Note removed");
        setNoteToDelete(null);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredNotes = notes.filter((note: Note) =>
    [note.title, note.content, note.tag].some((f) =>
      f?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div
      className="
      min-h-screen bg-neutral-950 text-neutral-100
      pl-0 sm:pl-20 transition-all duration-300
    "
    >
      <header
        className="
        sticky top-0 z-30 px-4 sm:px-8 py-[15px]
        bg-neutral-950/60 backdrop-blur-xl border-b border-white/5
      "
      >
        <div className="max-w-3xl mx-auto relative group">
          <Search
            className="
            absolute left-4 top-1/2 -translate-y-1/2
            text-neutral-500 w-5 h-5 group-focus-within:text-sky-400
          "
          />
          <input
            type="text"
            placeholder="Search notes..."
            className="
              w-full py-3 pl-12 pr-4 outline-none
              bg-neutral-900/50 border border-white/10 rounded-2xl
              focus:ring-2 focus:ring-sky-500/40
            "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-neutral-400">
            Welcome,{" "}
            <span className="text-white font-semibold">{user.name}</span>
          </h1>
        </div>

        <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
          <form
            onSubmit={handleSubmit}
            className={`
              border rounded-2xl p-2 shadow-2xl transition-all
              ${editingNoteId ? "bg-sky-500/5 border-sky-500/30" : "bg-neutral-900/80 border-white/10"}
            `}
          >
            {(isExpanded || editingNoteId) && (
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newNote.title}
                onChange={handleInputChange}
                className="
                  w-full bg-transparent px-4 py-3 outline-none
                  text-lg font-semibold text-white
                "
              />
            )}
            <textarea
              name="content"
              placeholder="Take a note..."
              value={newNote.content}
              onChange={handleInputChange}
              onFocus={() => setIsExpanded(true)}
              rows={isExpanded || editingNoteId ? 3 : 1}
              className="
                w-full bg-transparent px-4 py-2 outline-none
                resize-none text-neutral-300
              "
              required
            />
            {(isExpanded || editingNoteId) && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                <div
                  className="
                  flex items-center gap-2 px-3 py-1 rounded-full
                  bg-neutral-950/50 border border-white/5
                "
                >
                  <Tag size={14} className="text-neutral-500" />
                  <input
                    type="text"
                    name="tag"
                    placeholder="Tag"
                    value={newNote.tag}
                    onChange={handleInputChange}
                    className="bg-transparent text-xs text-neutral-400 outline-none w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-neutral-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      bg-sky-500 text-white px-5 py-2 rounded-xl
                      text-sm font-bold flex items-center gap-2
                      cursor-pointer transition-all active:scale-95
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

        <div
          className="
          columns-1 sm:columns-2 lg:columns-3 xl:columns-4
          gap-4 sm:gap-6 space-y-4 sm:space-y-6
        "
        >
          {filteredNotes.map((note: Note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={() => setNoteToDelete(note._id)}
              onEdit={() => handleEditInitiate(note)}
              onPin={() => handleTogglePin(note._id)}
            />
          ))}
        </div>
      </main>

      {noteToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            onClick={() => setNoteToDelete(null)}
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
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Note?
              </h3>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                This action cannot be undone. This note will be permanently
                removed from your workspace.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="
                    w-full py-4 bg-red-500 hover:bg-red-600
                    text-white font-bold rounded-2xl cursor-pointer
                    disabled:opacity-50
                  "
                >
                  {deleteLoading ? "Deleting..." : "Delete Permanently"}
                </button>
                <button
                  onClick={() => setNoteToDelete(null)}
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
      )}
    </div>
  );
}

function NoteCard({
  note,
  onDelete,
  onEdit,
  onPin,
}: {
  note: Note;
  onDelete: () => void;
  onEdit: () => void;
  onPin: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { title, content, tag, color = "border-white/10", isPinned } = note;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className={`
      break-inside-avoid rounded-2xl p-4 sm:p-6 transition-all
      group shadow-lg relative bg-neutral-900/40 border-t-4
      ${color} border-x border-b border-white/5 hover:bg-neutral-900/60
    `}
    >
      <div className="flex justify-between items-start mb-4">
        {title && (
          <h3 className="text-base sm:text-lg font-semibold text-neutral-100 leading-tight">
            {title}
          </h3>
        )}
        <Pin
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className={`
            cursor-pointer transition-all duration-200
            ${isPinned
              ? "text-sky-400 fill-sky-400 opacity-100"
              : "text-neutral-500 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-white"
            }
          `}
          size={18}
        />
      </div>
      <p
        className="
        text-neutral-400 text-xs sm:text-sm leading-relaxed
        mb-6 font-medium whitespace-pre-wrap
      "
      >
        {content}
      </p>
      <div className="flex items-center justify-between">
        {tag ? (
          <div
            className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-[10px] font-bold uppercase tracking-wider
            text-neutral-500 bg-neutral-950/50 border border-white/5
          "
          >
            <Tag size={12} /> {tag}
          </div>
        ) : (
          <div />
        )}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="
              p-1 text-neutral-500 hover:text-white cursor-pointer
              opacity-100 sm:opacity-0 group-hover:opacity-100
            "
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div
              className="
              absolute right-0 bottom-full mb-2 w-32 z-40
              bg-neutral-900 border border-white/10 rounded-xl
              shadow-2xl backdrop-blur-xl overflow-hidden
            "
            >
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="
                  w-full flex items-center gap-3 px-4 py-3 text-xs
                  text-neutral-300 hover:bg-white/5 cursor-pointer
                "
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="
                  w-full flex items-center gap-3 px-4 py-3 text-xs
                  text-red-400 hover:bg-red-500/10 cursor-pointer
                "
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
