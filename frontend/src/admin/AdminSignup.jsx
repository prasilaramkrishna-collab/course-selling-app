import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Attempting admin signup to:", `/api/v1/admin/signup`);
    
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/admin/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Admin signup successful: ", response.data);
      toast.success(response.data.message);
      navigate("/admin/login");
    } catch (error) {
      console.error("Admin signup error:", error);
      if (error.response) {
        const errorMsg = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join(", ")
          : error.response.data.errors || "Admin signup failed!";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Cannot connect to server. Please make sure backend is running on port 4001");
        setErrorMessage("Network error - Cannot reach server");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Network error. Please try again.");
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_25%),radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.2),transparent_22%),linear-gradient(135deg,#08101c_0%,#111f3b_45%,#050816_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-10 top-28 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.webp" alt="Logo" className="h-12 w-12 rounded-2xl border border-white/20 object-cover shadow-lg shadow-orange-500/20" />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Admin Portal</p>
            <p className="text-xl font-bold text-white">Future Proof</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link to="/admin/login" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white">
            Login
          </Link>
          <Link to="/courses" className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-400">
            View site
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-6 pb-10 lg:grid-cols-[1fr_0.95fr] lg:px-10">
        <section className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/75 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Create verified admin access
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-white sm:text-6xl">
            Launch a sharper admin space with the same visual standard as the public platform.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Create new administrator accounts for course operations, content management, feedback review, and learner certificate workflows without falling back to a generic control panel.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Branded access</p>
              <p className="mt-3 text-2xl font-bold text-white">Consistent identity</p>
              <p className="mt-2 text-sm text-slate-300">Admin entry now visually matches the polished student experience.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Profile tools</p>
              <p className="mt-3 text-2xl font-bold text-white">Photo-ready</p>
              <p className="mt-2 text-sm text-slate-300">Upload and manage admin profile imagery directly inside the dashboard.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur-2xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Create admin account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Set up a secure administrator account to manage courses, sales, certificates, and student feedback.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstname" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  First name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Priscilla"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastname" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Ramkrishna"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Work email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="admin@futureproof.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="At least 6 characters"
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-cyan-400 to-orange-400 px-6 py-4 text-base font-bold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Create admin account
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-400">
            <span>Already have access?</span>
            <Link to="/admin/login" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
              Go to login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminSignup;