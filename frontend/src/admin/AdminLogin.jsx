import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [adminPreview, setAdminPreview] = useState(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin") || "null");
    return storedAdmin?.admin || null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setPreviewLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setPreviewLoading(true);
        const response = await api.get(`/api/v1/admin/preview?email=${encodeURIComponent(normalizedEmail)}`);
        setAdminPreview(response.data?.admin || null);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Admin preview error:", error);
        }
        setAdminPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [email]);

  const previewName = useMemo(() => {
    if (!adminPreview) return "Admin Access";
    return `${adminPreview.firstName || ""} ${adminPreview.lastName || ""}`.trim() || "Admin Access";
  }, [adminPreview]);

  const previewInitials = useMemo(() => {
    return previewName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AP";
  }, [previewName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    try {
      const response = await api.post(
        `/api/v1/admin/login`,
        {
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
      toast.success(response.data.message);
      localStorage.setItem("admin", JSON.stringify(response.data));
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      if (error.response) {
        const errorMsg = error.response.data.errors || "Admin login failed!";
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
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.22),transparent_24%),linear-gradient(135deg,#07111f_0%,#10213c_45%,#050816_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute bottom-10 -right-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
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
          <Link to="/admin/signup" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white">
            Create admin
          </Link>
          <Link to="/courses" className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-400">
            View site
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-6 pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/75 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Secure operations console
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-white sm:text-6xl">
            Run the learning platform from a control room that finally looks premium.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Manage courses, learners, certificates, and feedback from one polished admin experience with live profile identity and quick access to the tools you use most.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Courses</p>
              <p className="mt-3 text-3xl font-bold text-white">Live</p>
              <p className="mt-2 text-sm text-slate-300">Update curriculum, plans, materials, and pricing.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Feedback</p>
              <p className="mt-3 text-3xl font-bold text-white">Smart</p>
              <p className="mt-2 text-sm text-slate-300">Review user sentiment and certificate completion flow.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Identity</p>
              <p className="mt-3 text-3xl font-bold text-white">Visible</p>
              <p className="mt-2 text-sm text-slate-300">Recognize admins instantly with profile photo preview.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-4">
              {adminPreview?.profilePhoto ? (
                <img
                  src={adminPreview.profilePhoto}
                  alt={previewName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/15"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-orange-500/20">
                  {previewInitials}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{previewLoading ? "Checking profile" : "Admin identity"}</p>
                <p className="mt-1 text-xl font-bold text-white">{previewName}</p>
                <p className="text-sm text-slate-400">{email || adminPreview?.email || "Use your admin email to continue"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Admin
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Sign in to dashboard</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Access course operations, purchases, certificates, profile tools, and learner feedback from one place.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Admin email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                placeholder="admin@futureproof.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 pr-16 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="Enter your secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-linear-to-r from-orange-500 via-amber-500 to-cyan-500 px-6 py-4 text-base font-bold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Enter admin dashboard
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-400">
            <span>Need an account?</span>
            <Link to="/admin/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Create admin access
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminLogin;