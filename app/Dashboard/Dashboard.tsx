import { useState, useEffect } from "react";
import { useRevalidator } from "react-router";
import type { Route } from "./+types/Dashboard";
import { requireAuth, getUserNotes } from "~/utils/auth.router";
import { Search } from "lucide-react";
import { toast } from "sonner";

import NoteForm from "components/dashboard/NoteForm";
import NoteCard from "components/dashboard/NoteCard";
import DeleteModal from "components/dashboard/DeleteModal";
import EmptyState from "components/dashboard/EmptyState";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const notes = await getUserNotes(request);
  return { user, notes };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  const { user, notes } = loaderData;
  const revalidator = useRevalidator();

  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [density, setDensity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("note-density") || "comfortable";
    }
    return "comfortable";
  });

  const [newNote, setNewNote] = useState({ title: "", content: "", tag: "" });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Listen for density changes from Settings tab
  useEffect(() => {
    const handleSync = () => {
      setDensity(localStorage.getItem("note-density") || "comfortable");
    };
    window.addEventListener("densityChange", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("densityChange", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleArchive = async (id: string) => {
    const toastId = toast.loading("Moving to vault...");
    try {
      const [res] = await Promise.all([
        fetch(`http://localhost:3001/api/notes/${id}/archive`, {
          method: "PATCH",
          credentials: "include",
        }),
        new Promise((r) => setTimeout(r, 600)),
      ]);

      if (res.ok) {
        toast.success("Note archived", { id: toastId });
        revalidator.revalidate();
      }
    } catch (error) {
      toast.error("Archive failed", { id: toastId });
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/notes/${id}/pin`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) revalidator.revalidate();
    } catch (error) {
      toast.error("Failed to pin note");
    }
  };

  const handleEditInitiate = (note: any) => {
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
        revalidator.revalidate();
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredNotes = notes.filter((note: any) =>
    [note.title, note.content, note.tag].some((f) =>
      f?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pl-0 sm:pl-20 transition-all duration-300">
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-[15px] bg-neutral-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-sky-400" />
          <input
            type="text"
            placeholder="Search active notes..."
            className="w-full py-3 pl-12 pr-4 outline-none bg-neutral-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-sky-500/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-neutral-400">
            Welcome back,{" "}
            <span className="text-white font-semibold">{user.name}</span>
          </h1>
        </div>

        <NoteForm
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          editingNoteId={editingNoteId}
          newNote={newNote}
          loading={loading}
          onInputChange={(e: any) =>
            setNewNote({ ...newNote, [e.target.name]: e.target.value })
          }
          onSubmit={async (e: any) => {
            e.preventDefault();
            setLoading(true);
            const method = editingNoteId ? "PATCH" : "POST";
            const url = editingNoteId
              ? `http://localhost:3001/api/notes/${editingNoteId}`
              : "http://localhost:3001/api/notes";
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newNote),
              credentials: "include",
            });
            if (res.ok) {
              setNewNote({ title: "", content: "", tag: "" });
              setEditingNoteId(null);
              setIsExpanded(false);
              revalidator.revalidate();
            }
            setLoading(false);
          }}
          onCancel={() => {
            setEditingNoteId(null);
            setIsExpanded(false);
            setNewNote({ title: "", content: "", tag: "" });
          }}
        />

        {filteredNotes.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {filteredNotes.map((note: any) => (
              <NoteCard
                key={note._id}
                note={note}
                density={density}
                onDelete={() => setNoteToDelete(note._id)}
                onEdit={() => handleEditInitiate(note)}
                onPin={() => handleTogglePin(note._id)}
                onArchive={() => handleArchive(note._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isSearching={searchQuery.length > 0}
            onClear={() => setSearchQuery("")}
          />
        )}
      </main>

      <DeleteModal
        toDelete="notes"
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
