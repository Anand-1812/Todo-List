import { useState } from "react";
import type { Route } from "./+types/Dashboard";
import { requireAuth, getUserNotes } from "~/utils/auth.router";
import { Plus, Search, MoreVertical, Pin, Tag } from "lucide-react";

interface Note {
  _id: string;
  title?: string;
  content: string;
  tag?: string;
  color?: string;
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
      const res = await fetch("http://localhost:3001/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
        credentials: "include",
      });

      if (res.ok) {
        setNewNote({ title: "", content: "", tag: "" });
        setIsExpanded(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((note: Note) =>
    [note.title, note.content, note.tag].some((f) =>
      f?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pl-20 transition-all duration-300">
      <header className="sticky top-0 z-30 bg-neutral-950/60 backdrop-blur-xl border-b border-white/5 px-8 py-[15px]">
        <div className="max-w-3xl mx-auto relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5
            h-5 group-focus-within:text-sky-400 transition-colors"
          />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4
            outline-none focus:ring-2 focus:ring-sky-500/40 focus:bg-neutral-900 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-2">
            Workspace
          </p>
          <h1 className="text-4xl font-light text-neutral-400">
            Welcome back,{" "}
            <span className="text-white font-semibold">{user.name}</span>
          </h1>
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/80 border border-white/10 rounded-2xl p-2 shadow-2xl transition-all"
            onFocus={() => setIsExpanded(true)}
          >
            {isExpanded && (
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newNote.title}
                onChange={handleInputChange}
                className="w-full bg-transparent px-4 py-3 text-lg font-semibold text-white outline-none placeholder:text-neutral-600"
              />
            )}
            <textarea
              name="content"
              placeholder="Take a note..."
              value={newNote.content}
              onChange={handleInputChange}
              rows={isExpanded ? 3 : 1}
              className="w-full bg-transparent px-4 py-2 text-neutral-300 outline-none resize-none placeholder:text-neutral-500"
              required
            />
            {isExpanded && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                <div className="flex items-center gap-2 bg-neutral-950/50 px-3 py-1 rounded-full border border-white/5">
                  <Tag size={14} className="text-neutral-500" />
                  <input
                    type="text"
                    name="tag"
                    placeholder="Add tag..."
                    value={newNote.tag}
                    onChange={handleInputChange}
                    className="bg-transparent text-xs text-neutral-400 outline-none w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-2 text-sm
                    text-neutral-500 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-sky-500 text-white px-4 py-2
                    rounded-xl text-sm font-bold hover:bg-sky-400 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredNotes.map((note: Note) => (
            <NoteCard key={note._id} {...note} />
          ))}
        </div>
      </main>

      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center
        shadow-2xl shadow-sky-500/40 hover:scale-110 transition-all sm:hidden z-50"
      >
        <Plus className="text-white w-8 h-8" />
      </button>
    </div>
  );
}

function NoteCard({
  title,
  content,
  tag,
  color = "border-white/10",
}: Omit<Note, "_id">) {
  return (
    <div
      className={`break-inside-avoid bg-neutral-900/40 border-t-4 ${color} border-x border-b border-white/5
      rounded-2xl p-6 hover:bg-neutral-900/60 transition-all group shadow-lg`}
    >
      <div className="flex justify-between items-start mb-4">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-100 leading-tight">
            {title}
          </h3>
        )}
        <Pin
          size={18}
          className="opacity-0 group-hover:opacity-100 text-neutral-500 cursor-pointer"
        />
      </div>
      <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
        {content}
      </p>
      <div className="flex items-center justify-between">
        {tag ? (
          <div
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
            text-neutral-500 bg-neutral-950/50 px-3 py-1.5 rounded-full border border-white/5"
          >
            <Tag size={12} /> {tag}
          </div>
        ) : (
          <div />
        )}
        <MoreVertical
          size={18}
          className="opacity-0 group-hover:opacity-100 text-neutral-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
