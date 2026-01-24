import { toast } from "sonner";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-neutral-950 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#2e2e2e_1px,transparent_1px)]
        [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"
      ></div>

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-8 shadow-2xl">
        <header className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-400">
            Enter your details to access your notes
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-neutral-100
              outline-none focus:ring-2 focus:ring-sky-500/40 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-neutral-100
              outline-none focus:ring-2 focus:ring-sky-500/40 transition-all placeholder:text-neutral-700"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-xs text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-4 font-bold text-black transition-all hover:bg-neutral-200
            active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <footer className="pt-4 text-center">
            <p className="text-sm text-neutral-500">
              New here?{" "}
              <Link
                to="/signup"
                className="text-white font-medium hover:underline underline-offset-4 cursor-pointer"
              >
                Create an account
              </Link>
            </p>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Login;
