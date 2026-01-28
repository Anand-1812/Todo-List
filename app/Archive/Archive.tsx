import { useState, useEffect } from "react";
import { useRevalidator, useNavigate } from "react-router";
import { ArchiveRestore, Trash2, ArrowLeft, Inbox } from "lucide-react";
import { toast } from "sonner";
import { requireAuth, getArchivedNotes } from "~/utils/auth.router";
import type { Route } from "./+types/Archive";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const notes = await getArchivedNotes(request);
  return { user, notes };
}

export default function Archives({ loaderData }: Route.ComponentProps) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!loaderData) return null;
  const { user, notes } = loaderData;

  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync density preference
  const [density, setDensity] = useState("comfortable");

  useEffect(() => {
    const saved = localStorage.getItem("note-density") || "comfortable";
    setDensity(saved);
  }, []);

  const handleRestore = async (id: string) => {
    setLoadingId(id);
    const toastId = toast.loading("Restoring note...");

    try {
      // Removed artificial timeout to eliminate interaction lag
      const res = await fetch(`${apiUrl}/api/notes/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Note restored to dashboard", { id: toastId });
        revalidator.revalidate();
      } else {
        toast.error("Failed to restore", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteForever = async (id: string) => {
    if (!window.confirm("Delete this note forever? This cannot be undone."))
      return;

    setLoadingId(id);
    const toastId = toast.loading("Purging from vault...");

    try {
      const res = await fetch(`${apiUrl}/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Note deleted permanently", { id: toastId });
        revalidator.revalidate();
      } else {
        toast.error("Deletion failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const isCompact = density === "compact";

  return (
    <div
      className="
      min-h-screen bg-neutral-950 text-neutral-100
      pl-0 sm:pl-20 transition-all duration-300
    "
    >
      <header
        className="
        sticky top-0 z-30 px-4 sm:px-8 py-6
        bg-neutral-950/60 backdrop-blur-xl border-b border-white/5
      "
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="
                p-2 hover:bg-white/5 rounded-xl text-neutral-500
                hover:text-white transition-all cursor-pointer
              "
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Archive Vault</h1>
          </div>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            {notes?.length || 0} Items Cached
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 sm:p-12 pb-24 sm:pb-12">
        {notes && notes.length > 0 ? (
          <div
            className="
            columns-1 sm:columns-2 lg:columns-3 xl:columns-4
            gap-6 space-y-6
          "
          >
            {notes.map((note: any) => (
              <div
                key={note._id}
                className={`
                break-inside-avoid bg-neutral-900/40 border border-white/5
                rounded-2xl hover:bg-neutral-900/60 transition-all group
                relative overflow-hidden
                ${isCompact ? "p-3 mb-3" : "p-6 mb-6"}
              `}
              >
                <h3
                  className={`
                  font-semibold text-neutral-200 mb-2 truncate
                  ${isCompact ? "text-sm" : "text-lg"}
                `}
                >
                  {note.title}
                </h3>
                <p
                  className={`
                  text-neutral-500 leading-relaxed line-clamp-4
                  ${isCompact ? "text-[11px] mb-3" : "text-sm mb-6"}
                `}
                >
                  {note.content}
                </p>

                <div
                  className="
                  flex items-center justify-end gap-2
                  border-t border-white/5 pt-4
                "
                >
                  <button
                    onClick={() => handleRestore(note._id)}
                    disabled={!!loadingId}
                    className="
                      p-2 text-neutral-400 hover:text-sky-400 hover:bg-sky-500/10
                      rounded-lg transition-all cursor-pointer
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                    "
                    title="Restore"
                  >
                    <ArchiveRestore
                      size={isCompact ? 16 : 18}
                      className={loadingId === note._id ? "animate-spin" : ""}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteForever(note._id)}
                    disabled={!!loadingId}
                    className="
                      p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10
                      rounded-lg transition-all cursor-pointer
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                    "
                    title="Delete Forever"
                  >
                    <Trash2 size={isCompact ? 16 : 18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="
              w-16 h-16 bg-neutral-900 rounded-3xl flex
              items-center justify-center mb-6 border border-white/5
            "
            >
              <Inbox size={28} className="text-neutral-700" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">
              Vault is Empty
            </h2>
            <p className="text-neutral-500 max-w-xs text-sm">
              Archived notes will appear here. Keep your workspace clean.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
