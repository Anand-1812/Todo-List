import { useState } from "react";
import {
  User,
  Monitor,
  Download,
  Trash2,
  ChevronRight,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { requireAuth } from "~/utils/auth.router";
import type { Route } from "./+types/Settings";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  return { user };
}

export default function Settings({
  loaderData,
}: {
  loaderData: { user: any };
}) {
  const { user } = loaderData;
  const [density, setDensity] = useState("comfortable");

  // FIX 1: Track the new name in state
  const [displayName, setDisplayName] = useState(user?.name || "");

  const handleUpdateProfile = async (newName: string) => {
    if (!newName.trim()) return toast.error("Name cannot be empty");

    const currToast = toast.loading("Updating profile...");

    try {
      const res = await fetch("http://localhost:3001/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated", { id: currToast });
        // Optional: window.location.reload() to sync all components
      } else {
        toast.error(data.message || "Update failed", { id: currToast });
      }
    } catch (error: any) {
      toast.error("Network error", { id: currToast });
    }
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-300 p-6
      sm:p-12 lg:pl-32"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1
            className="text-4xl font-bold text-white tracking-tight
            "
          >
            Settings
          </h1>
          <p
            className="text-neutral-500 mt-2
            "
          >
            Manage your workspace environment and security.
          </p>
        </header>

        <div className="space-y-12">
          {/* Section: Account Profile */}
          <section>
            <SettingHeader icon={<User size={18} />} title="Account Profile" />
            <div
              className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6
              space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FIX 2: Pass state and setter to InputGroup */}
                <InputGroup
                  label="Display Name"
                  value={displayName}
                  onChange={(e: any) => setDisplayName(e.target.value)}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label
                      className="text-xs font-bold text-neutral-500 uppercase
                      tracking-wider"
                    >
                      Email Address
                    </label>
                    <div
                      className="flex items-center gap-1 text-[10px] font-bold
                      text-emerald-500 uppercase"
                    >
                      <BadgeCheck size={12} />
                      Verified
                    </div>
                  </div>
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full bg-neutral-950/50 border border-white/5
                    rounded-2xl px-4 py-3 text-neutral-500 cursor-not-allowed
                    outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleUpdateProfile(displayName)}
                className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold
                hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </section>

          {/* Section: Workspace Preferences */}
          <section>
            <SettingHeader icon={<Monitor size={18} />} title="Workspace" />
            <div
              className="bg-neutral-900/40 border border-white/5 rounded-3xl
              p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Note Density</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Adjust the vertical spacing of your dashboard notes.
                  </p>
                </div>

                <div
                  className="flex bg-neutral-950 p-1 rounded-xl border border-white/5
                  "
                >
                  {["comfortable", "compact"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`
                        px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg
                        transition-all ${density === d
                          ? "bg-white/10 text-white"
                          : "text-neutral-600 hover:text-neutral-400"
                        }
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Data Management */}
          <section>
            <SettingHeader
              icon={<Download size={18} />}
              title="Data Portability"
            />
            <div
              className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6
              flex flex-col sm:flex-row gap-4"
            >
              <DataCard
                title="Export JSON"
                desc="Download a raw backup of all your notes and tags."
                action={() => toast.success("Export started...")}
              />
              <DataCard
                title="Archive All"
                desc="Move all active notes to your vault instantly."
                action={() => toast.info("Archiving workspace...")}
              />
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section
            className="pt-8 border-t border-white/5
            "
          >
            <div
              className="bg-red-500/5 border border-red-500/20 rounded-3xl
              p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-red-500" size={20} />
                <h3 className="text-xl font-bold text-white">Danger Zone</h3>
              </div>

              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between
              gap-4"
              >
                <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
                  Permanently delete your account and all associated data. This
                  action is irreversible.
                </p>

                <button
                  className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20
                  rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white
                  transition-all cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SettingHeader({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="text-sky-400">{icon}</div>
      <h2
        className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500
        "
      >
        {title}
      </h2>
    </div>
  );
}

function InputGroup({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label
        className="text-xs font-bold text-neutral-500 uppercase tracking-wider
        ml-1"
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-neutral-950 border border-white/5 rounded-2xl px-4
        py-3 outline-none focus:ring-2 focus:ring-sky-500/40 text-white
        transition-all"
      />
    </div>
  );
}

function DataCard({ title, desc, action }: any) {
  return (
    <div
      className="flex-1 bg-neutral-950 border border-white/5 p-6 rounded-2xl flex
      flex-col justify-between hover:border-white/10 transition-all group"
    >
      <div>
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">{desc}</p>
      </div>

      <button
        onClick={action}
        className="text-sky-400 text-sm font-bold flex items-center gap-2
        hover:text-white transition-colors cursor-pointer"
      >
        Execute Action <ChevronRight size={16} />
      </button>
    </div>
  );
}
