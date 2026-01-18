import { useNavigate } from "react-router";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 bg-neutral-950 overflow-hidden">
      {/* Dots pattern */}
      <div
        className="absolute inset-0 h-full w-full
        bg-[radial-gradient(#2e2e2e_1px,transparent_1px)]
        [background-size:32px_32px]
        [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      ></div>

      {/* Center Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[500px] h-[500px] bg-neutral-500/10 blur-[120px] rounded-full"
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center animate-fade-up">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight
          bg-gradient-to-b from-white via-neutral-200 to-neutral-500
          bg-clip-text text-transparent py-2 leading-tight"
        >
          Your personal note taking app
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Take notes of anything, and manage all your notes in one place.
          <br /> Built for speed, privacy, and focus.
        </p>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-white text-black font-semibold rounded-full
            hover:bg-neutral-200 transition-all duration-200
            active:scale-95 shadow-lg shadow-white/5 cursor-pointer"
          >
            Get Started
          </button>

          <button
            className="px-8 py-3 bg-neutral-900/50 text-neutral-100 font-semibold rounded-full
            border border-white/10 cursor-pointer
            hover:bg-neutral-800 transition-all duration-200
            active:scale-95"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
