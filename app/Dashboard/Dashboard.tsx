import { useState } from "react";
import type { Route } from "./+types/Dashboard";
import { requireUserSession } from "~/utils/auth.router";
import { Plus, Search, MoreVertical, Pin, Tag } from "lucide-react";

interface Note {
  title?: string;
  content: string;
  tag?: string;
  color?: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUserSession(request);
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const userName = loaderData?.user?.name || "Guest";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pl-20 transition-all duration-300">
      <header className="sticky top-0 z-30 bg-neutral-950/60 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-sky-400 transition-colors" />
          <input
            type="text"
            placeholder="Search your notes..."
            className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4
              focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:bg-neutral-900 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Modern Welcome Section */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-2">
            Personal Workspace
          </p>
          <h1 className="text-4xl font-light text-neutral-400 leading-tight">
            Welcome back,{" "}
            <span className="text-white font-semibold">{userName}</span>
          </h1>
        </div>

        {/* Note create bar */}
        <div className="max-w-2xl mx-auto mb-20">
          <div
            className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 shadow-2xl
            hover:border-white/20 transition-all cursor-text flex items-center justify-between group"
          >
            <span className="text-neutral-500 group-hover:text-neutral-400 ml-2 font-medium">
              Take a note...
            </span>
            <button className="p-2 hover:bg-white/5 rounded-xl text-neutral-500 hover:text-sky-400 transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Masonry Grid with Spacing Consistency */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <NoteCard
            title="Project Rice UI"
            content="Finalize the sidebar components and test glass-morphism effects."
            tag="Development"
            color="border-sky-500/40"
          />
          <NoteCard
            title="DSA Practice"
            content="Focus on Dynamic Programming. 400+ problems solved, keep it up!"
            tag="DSA"
            color="border-purple-500/40"
          />
          <NoteCard
            title="Mid-Sem Prep"
            content="Review Naive Bayes and Decision Trees for the exam on Feb 4th."
            tag="Academic"
            color="border-amber-500/40"
          />
          <NoteCard
            title="Shopping List"
            content="Mechanical keyboard lube and a new desk mat."
            tag="Personal"
          />
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center
        shadow-2xl shadow-sky-500/40 hover:scale-110 hover:bg-sky-400 transition-all active:scale-95 sm:hidden z-50"
      >
        <Plus className="text-white w-8 h-8" />
      </button>
    </div>
  );
}

function NoteCard({ title, content, tag, color = "border-white/10" }: Note) {
  return (
    <div
      className={`break-inside-avoid bg-neutral-900/40 border-t-4 ${color} border-x border-b border-white/5
      rounded-2xl p-6 hover:bg-neutral-900/60 transition-all group shadow-lg hover:shadow-sky-500/5`}
    >
      <div className="flex justify-between items-start mb-4">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-100 leading-tight">
            {title}
          </h3>
        )}
        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg text-neutral-500 transition-all">
          <Pin size={18} />
        </button>
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
            <Tag size={12} />
            {tag}
          </div>
        ) : (
          <div />
        )}
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg
          text-neutral-500 hover:text-white transition-all"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
