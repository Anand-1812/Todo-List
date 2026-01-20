import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(" ");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Signup failed");
        return;
      }

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-linear-to-b
      from-neutral-950 via-neutral-900 to-neutral-950"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70
        backdrop-blur p-6 shadow-xl"
      >
        <h1
          className="text-3xl font-semibold text-center text-shadow-black
          text-transparent bg-gradient-to-l from-neutral-50 via-neutral-300 to-neutral-50 bg-clip-text"
        >
          Let's get you onboard
        </h1>

        <p className="text-center text-sm text-neutral-400 mt-2">
          Sign up to continue
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Name</label>
            <input
              type="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950
              px-4 py-3 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-sky-500/60"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
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
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950
              px-4 py-3 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-sky-500/60"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400"
          >
            Create account
          </button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:text-sky-300">
              log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
