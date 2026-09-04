"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiShield, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <div
      className="absolute rounded-full bg-indigo-500/20 blur-sm animate-pulse"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + delay}s`,
      }}
    />
  );
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 3) { setError("Enter a valid password"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_session", Date.now().toString());
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    size: 4 + Math.random() * 12,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06060b] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className={`relative w-full max-w-sm mx-4 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Glow effect behind card */}
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-40 animate-pulse" style={{ animationDuration: "3s" }} />

        {/* Card */}
        <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="relative text-center mb-8">
            {/* Logo with animated ring */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-spin" style={{ animationDuration: "8s" }} />
              <div className="absolute inset-[2px] rounded-2xl bg-[#0c0c14] flex items-center justify-center">
                <span className="text-3xl font-black bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">A</span>
              </div>
            </div>

            <h1 className="text-white text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-2">Enter password to access admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2 tracking-wide uppercase">Password</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all duration-300 text-sm"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 text-slate-600 hover:text-slate-400 transition-colors">
                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error message with animation */}
            <div className={`transition-all duration-300 ${error ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5">
                <FiShield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="relative w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 group overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] group-hover:animate-[shimmer_2s_linear_infinite] group-disabled:animate-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Bottom decoration */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent to-indigo-500/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-l from-transparent to-purple-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
