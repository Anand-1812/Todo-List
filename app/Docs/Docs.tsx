import {
  Book,
  Terminal,
  Shield,
  Trash2,
  Pin,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen mt-8 bg-neutral-950 text-neutral-300 font-sans selection:bg-white
      selection:text-black"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:24px_24px]
        opacity-20 pointer-events-none"
      />

      <main
        className="relative z-10 max-w-4xl mx-auto px-6 py-20
        "
      >
        {/* Header */}
        <header
          className="mb-20 border-b border-white/5 pb-10
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center
              "
            >
              <Book className="text-black" size={20} />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500
              "
            >
              System Manual v1.0
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold text-white tracking-tighter
            mb-4"
          >
            NotesApp Documentation
          </h1>

          <p
            className="text-lg text-neutral-500 max-w-2xl leading-relaxed
            "
          >
            A developer-centric guide to mastering your minimalist workspace.
            Built for high-performance note capturing and technical
            organization.
          </p>
        </header>

        {/* Section: Core Philosophies */}
        <section className="mb-24">
          <h2
            className="text-sm font-bold uppercase tracking-widest text-sky-400
            mb-8"
          >
            Core Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocFeature
              icon={<Terminal size={18} />}
              title="Performance First"
              desc="Every interaction is optimized for <100ms response time. Your thoughts shouldn't wait for your UI."
            />
            <DocFeature
              icon={<Shield size={18} />}
              title="Data Integrity"
              desc="Stateless authentication and ownership checks on every request ensure your notes remain strictly private."
            />
          </div>
        </section>

        {/* Section: Feature Guide */}
        <section className="mb-24 space-y-12">
          <h2
            className="text-sm font-bold uppercase tracking-widest text-sky-400
            mb-8"
          >
            Feature Guide
          </h2>

          <div className="space-y-16">
            <FeatureBlock
              title="Smart Pinned View"
              icon={<Pin size={20} className="text-sky-400" />}
              desc="Prioritize critical information by pinning notes to the top. The dashboard utilizes a dual-sort algorithm: isPinned DESC, followed by createdAt DESC."
            />

            <FeatureBlock
              title="Inline Contextual Editing"
              icon={<Pencil size={20} className="text-neutral-400" />}
              desc="Clicking Edit populates the primary controller with existing note data and triggers an automatic scroll-to-top, maintaining focus on the active task."
            />

            <FeatureBlock
              title="Intentional Deletion"
              icon={<Trash2 size={20} className="text-red-400" />}
              desc="To prevent catastrophic data loss, deletions include a 1000ms artificial delay and a custom confirmation modal, reinforcing destructive intent."
            />
          </div>
        </section>

        {/* Section: UX Design System */}
        <section className="mb-24">
          <h2
            className="text-sm font-bold uppercase tracking-widest text-sky-400
            mb-10"
          >
            Clean UI Design
          </h2>

          <div
            className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8
            "
          >
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div
                  className="w-2 h-2 rounded-full bg-sky-500 mt-2
                  shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                />
                <div>
                  <span className="text-white font-medium">Glassmorphism:</span>
                  <p
                    className="text-sm text-neutral-500 mt-1
                    "
                  >
                    Containers utilize bg-neutral-900/40 with backdrop-blur-xl
                    to create visual separation without losing context.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-2 h-2 rounded-full bg-sky-500 mt-2
                  shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                />
                <div>
                  <span className="text-white font-medium">Masonry Grid:</span>
                  <p
                    className="text-sm text-neutral-500 mt-1
                    "
                  >
                    Leverages CSS columns-1 through columns-4 to maximize
                    vertical screen real estate across different device widths.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="pt-20 border-t border-white/5 text-center
          "
        >
          <p
            className="text-neutral-600 text-xs tracking-widest uppercase
            mb-4"
          >
            End of Document
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sky-400 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2
            mx-auto"
          >
            <ArrowLeft size={16} />
            Return to Workspace
          </button>
        </footer>
      </main>
    </div>
  );
}

function DocFeature({ icon, title, desc }: any) {
  return (
    <div
      className="group border border-white/5 bg-neutral-900/30 p-6 rounded-2xl hover:border-white/10
      transition-all"
    >
      <div
        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-4 text-neutral-400
        group-hover:text-white transition-colors"
      >
        {icon}
      </div>
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureBlock({ title, icon, desc }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-neutral-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
