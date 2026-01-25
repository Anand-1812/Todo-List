import AuthContext from "Context/Context";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Sparkles, Zap, Shield, Layout } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(#2e2e2e_1px,transparent_1px)]
        [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      ></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 px-4 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5
          text-xs text-neutral-400 mb-8 animate-fade-in"
        >
          <Sparkles size={14} className="text-sky-400" />
          <span>Now in Pre-Final Beta</span>
        </div>

        <h1
          className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-neutral-500
          bg-clip-text text-transparent leading-[1.1] max-w-6xl"
        >
          The minimal way to manage your thoughts.
        </h1>

        <p className="mt-8 text-lg text-neutral-400 max-w-2xl leading-relaxed">
          Built for speed and focus. Organize your daily thoughts, ML progress,
          and side projects in a clutter-free environment.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(user ? "/dashboard" : "/signup")}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200
            transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {user ? "Go to Dashboard" : "Start Writing"}
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/docs")}
            className="px-8 py-4 bg-neutral-900 border border-white/10 font-bold rounded-full
            hover:bg-neutral-800 transition-all cursor-pointer"
          >
            How to use ?
          </button>
        </div>
      </div>

      {/* Bento Feature Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-neutral-900/50
          backdrop-blur-sm hover:border-white/20 transition-all cursor-default group"
        >
          <Layout
            className="text-sky-400 mb-4 group-hover:scale-110 transition-transform"
            size={32}
          />
          <h3 className="text-2xl font-bold mb-2">Google Keep Aesthetics</h3>
          <p className="text-neutral-400">
            A clean masonry layout that lets your ideas flow naturally. No
            distractions, just your content.
          </p>
        </div>

        <div
          className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm
          hover:border-white/20 transition-all cursor-default"
        >
          <Zap className="text-amber-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Instant Search</h3>
          <p className="text-neutral-400 text-sm">
            Find any note, tag, or code snippet in milliseconds.
          </p>
        </div>

        <div
          className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm
          hover:border-white/20 transition-all cursor-default"
        >
          <Shield className="text-emerald-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Secure Store</h3>
          <p className="text-neutral-400 text-sm">
            Your notes are stored with MongoDB and protected by session auth.
          </p>
        </div>

        <div
          className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950
          hover:border-white/20 transition-all cursor-pointer group"
          onClick={() => navigate("/signup")}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Ready to clear your mind?
              </h3>
              <p className="text-neutral-400">
                Join other developers managing their streaks and notes here.
              </p>
            </div>
            <div className="bg-white text-black p-3 rounded-full group-hover:translate-x-2 transition-transform">
              <ArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
