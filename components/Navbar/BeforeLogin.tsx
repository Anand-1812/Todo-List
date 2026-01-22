import AuthContext from "Context/Context";
import { useContext } from "react";
import { Link, useNavigate } from "react-router";

const BeforeLogin = () => {
  const navigate = useNavigate();

  const isLoggedIn = useContext(AuthContext);

  return (
    <nav className="absolute fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 mt-2">
      <div
        className="w-full max-w-5xl flex items-center justify-between
        border border-white/10 rounded-full px-6 py-3
        bg-white/5 backdrop-blur-lg shadow-xl shadow-black/20"
      >
        <h1
          className="text-2xl md:text-3xl font-semibold tracking-tight
          bg-gradient-to-b from-neutral-500 via-white to-neutral-500
          bg-clip-text text-transparent text-shadow-black"
        >
          <Link to="/">Notes App</Link>
        </h1>

        <button
          onClick={() => navigate("/signup")}
          className="text-lg font-medium px-6 py-2
          bg-neutral-800 text-neutral-100 shadow-xl shadow-black/40
          rounded-full transition-all duration-200
          active:scale-95 cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default BeforeLogin;
