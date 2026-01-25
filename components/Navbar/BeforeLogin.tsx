import { useNavigate } from "react-router";

const BeforeLogin = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-5xl flex items-center justify-between
        border border-white/10 rounded-full px-6 py-3
        bg-neutral-900/50 backdrop-blur-md shadow-2xl"
      >
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-black font-bold text-xs">N</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Notes<span className="text-neutral-500">App</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block text-sm font-medium text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm font-bold px-6 py-2 bg-white text-black rounded-full
            hover:bg-neutral-200 transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BeforeLogin;
