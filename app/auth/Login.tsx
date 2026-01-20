import { Link } from "react-router";

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b
      from-neutral-950 via-neutral-900 to-neutral-950"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70
        backdrop-blur p-6 shadow-xl"
      >
        <h1 className="text-3xl font-semibold text-white text-center">
          Create account
        </h1>

        <p className="text-center text-sm text-neutral-400 mt-2">
          Sign up to continue
        </p>

        <form className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950
              px-4 py-3 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-sky-500/60"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950
              px-4 py-3 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-sky-500/60"
              required
              minLength={8}
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400"
          >
            Create account
          </button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link to="/signup" className="text-sky-400 hover:text-sky-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
