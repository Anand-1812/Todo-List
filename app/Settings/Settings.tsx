import { useState, useEffect } from "react";
import {
  User,
  Monitor,
  Download,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { requireAuth } from "~/utils/auth.router";
import type { Route } from "./+types/Settings";
import DeleteModal from "components/dashboard/DeleteModal";

// Use clientLoader to ensure cookies are accessible during authentication
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireAuth(request);
  return { user };
}

export default function Settings({
  loaderData,
}: {
  loaderData: { user: any };
}) {
  const { user } = loaderData;
  const apiUrl = import.meta.env.VITE_API_URL;

  const [density, setDensity] = useState("comfortable");
  useEffect(() => {
    const saved = localStorage.getItem("note-density") || "comfortable";
    setDensity(saved);
  }, []);

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateProfile = async (newName: string) => {
    if (!newName.trim()) return toast.error("Name cannot be empty");
    const currToast = toast.loading("Updating profile...");

    try {
      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Profile updated", { id: currToast });
      } else {
        const data = await res.json();
        toast.error(data.message || "Update failed", { id: currToast });
      }
    } catch (error) {
      toast.error("Network error", { id: currToast });
    }
  };

  const handleDensityToggle = (mode: string) => {
    setDensity(mode);
    localStorage.setItem("note-density", mode);
    window.dispatchEvent(new Event("densityChange"));
    toast.info(`View set to ${mode}`);
  };

  const handleExportData = async () => {
    const toastId = toast.loading("Preparing your data archive...");

    try {
      // 1. Fetch real data from the backend
      const res = await fetch(`${apiUrl}/api/notes/export`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const realNotes = await res.json();

      // 2. Construct the export object with REAL notes
      const exportData = {
        user: user.email,
        exportedAt: new Date().toISOString(),
        totalNotes: realNotes.length,
        notes: realNotes, // <--- Actual data from MongoDB
      };

      // 3. Create and trigger download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `rice-notes-${user.name.toLowerCase().replace(/\s+/g, "-")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully", { id: toastId });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export notes", { id: toastId });
    }
  };

  const handleArchiveAll = async () => {
    if (!window.confirm("Move all active notes to archive?")) return;
    const toastId = toast.loading("Archiving workspace...");

    try {
      // Removed artificial delay to eliminate lag
      const res = await fetch(`${apiUrl}/api/notes/archive-all`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Workspace archived successfully", { id: toastId });
      } else {
        toast.error("Failed to archive notes", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error. Try again.", { id: toastId });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Account deleted permanently.");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("Server error during deletion");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 px-4 py-6 sm:px-6 sm:py-12 lg:pl-32">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base">
            Manage your workspace environment and security.
          </p>
        </header>
        <div className="space-y-10 sm:space-y-12">
          <section>
            <SettingHeader icon={<User size={18} />} title="Account Profile" />
            <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InputGroup
                  label="Display Name"
                  value={displayName}
                  onChange={(e: any) => setDisplayName(e.target.value)}
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full bg-neutral-950/50 border border-white/5 rounded-2xl px-4 py-3 text-neutral-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => handleUpdateProfile(displayName)}
                className="w-full sm:w-auto px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </section>
          <section>
            <SettingHeader icon={<Monitor size={18} />} title="Workspace" />
            <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-white font-medium">Note Density</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Adjust the vertical spacing of your dashboard notes.
                  </p>
                </div>
                <div className="flex w-full sm:w-auto bg-neutral-950 p-1 rounded-xl border border-white/5">
                  {["comfortable", "compact"].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleDensityToggle(d)}
                      className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${density === d ? "bg-white/10 text-white" : "text-neutral-600 hover:text-neutral-400"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <SettingHeader
              icon={<Download size={18} />}
              title="Data Portability"
            />
            <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4">
              <DataCard
                title="Export JSON"
                desc="Download a raw backup of all your notes and tags."
                action={handleExportData}
              />
              <DataCard
                title="Archive All"
                desc="Move all active notes to your vault instantly."
                action={handleArchiveAll}
              />
            </div>
          </section>
          <section className="pt-8 border-t border-white/5">
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-red-500" size={20} />
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Danger Zone
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
                  Permanently delete your account and all associated data. This
                  action is irreversible.
                </p>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <DeleteModal
        toDelete="user"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </div>
  );
}

function SettingHeader({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="text-sky-400">{icon}</div>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
        {title}
      </h2>
    </div>
  );
}

function InputGroup({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-neutral-950 border border-white/5 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500/40 text-white transition-all"
      />
    </div>
  );
}

function DataCard({ title, desc, action }: any) {
  return (
    <div className="flex-1 bg-neutral-950 border border-white/5 p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group">
      <div>
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">{desc}</p>
      </div>
      <button
        onClick={action}
        className="text-sky-400 text-sm font-bold flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
      >
        Execute Action <ChevronRight size={16} />
      </button>
    </div>
  );
}
