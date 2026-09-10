"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiShield, FiArrowRight, FiMail, FiLock } from "react-icons/fi";

function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <div
      className="absolute rounded-full bg-[#c9f36c]/20 blur-sm animate-pulse"
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

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "unauthorized":
          setError("Please login with a valid authorized email.");
          break;
        case "access_denied":
          setError("Access denied. Please sign in with your Google account.");
          break;
        case "not_configured":
          setError("OAuth not configured. Check environment variables.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "/api/admin/auth/google";
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        sessionStorage.setItem("admin_session", "authenticated");
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center bg-[#101412] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#c9f36c]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#a8d94a]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#c9f36c]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(201,243,108,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,243,108,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className={`relative w-full max-w-sm mx-4 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Glow effect behind card */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#c9f36c]/30 via-[#a8d94a]/30 to-[#c9f36c]/30 rounded-3xl blur-2xl opacity-40 animate-pulse" style={{ animationDuration: "3s" }} />

        {/* Card */}
        <div className="relative bg-[#151b17]/80 backdrop-blur-xl border border-[#c9f36c]/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#c9f36c]/10 via-transparent to-[#c9f36c]/10 pointer-events-none" />

          <div className="relative text-center mb-8">
            {/* Logo with animated ring */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] animate-spin" style={{ animationDuration: "8s" }} />
              <div className="absolute inset-[2px] rounded-2xl bg-[#151b17] flex items-center justify-center">
                <span className="text-3xl font-black bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>A</span>
              </div>
            </div>

            <h1 className="text-[#f4f7f2] text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#91a096] text-sm mt-2">Sign in to admin panel</p>
          </div>

          <div className="space-y-5 relative">
            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5">
                <FiShield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Mode Toggle */}
            <div className="flex gap-2 p-1 rounded-xl bg-[#101412] border border-[#c9f36c]/10">
              <button
                onClick={() => { setLoginMode("google"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  loginMode === "google"
                    ? "bg-[#c9f36c]/20 text-[#c9f36c] border border-[#c9f36c]/20"
                    : "text-[#91a096] hover:text-[#f4f7f2]"
                }`}
              >
                Google
              </button>
              <button
                onClick={() => { setLoginMode("email"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  loginMode === "email"
                    ? "bg-[#c9f36c]/20 text-[#c9f36c] border border-[#c9f36c]/20"
                    : "text-[#91a096] hover:text-[#f4f7f2]"
                }`}
              >
                Email & Password
              </button>
            </div>

            {/* Google Login */}
            {loginMode === "google" && (
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl bg-[#c9f36c]/10 border border-[#c9f36c]/20 text-[#f4f7f2] font-semibold text-sm transition-all duration-300 group overflow-hidden hover:bg-[#c9f36c]/20 hover:border-[#c9f36c]/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#c9f36c]/10 via-[#a8d94a]/10 to-[#c9f36c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-[#c9f36c]/30 border-t-[#c9f36c] rounded-full animate-spin" />
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Sign in with Google</span>
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                    </>
                  )}
                </span>
              </button>
            )}

            {/* Email/Password Login */}
            {loginMode === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#91a096]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#101412] border border-[#c9f36c]/10 text-[#f4f7f2] text-sm placeholder:text-[#91a096]/50 focus:outline-none focus:border-[#c9f36c]/30 focus:ring-1 focus:ring-[#c9f36c]/20 transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#91a096]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#101412] border border-[#c9f36c]/10 text-[#f4f7f2] text-sm placeholder:text-[#91a096]/50 focus:outline-none focus:border-[#c9f36c]/30 focus:ring-1 focus:ring-[#c9f36c]/20 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] text-[#101412] font-bold text-sm transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-[#c9f36c]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-[#101412]/30 border-t-[#101412] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

            {/* Info text */}
            <p className="text-[#91a096] text-xs text-center leading-relaxed">
              {loginMode === "google"
                ? "Only authorized Gmail accounts can access the admin panel."
                : "Use your registered email and password to sign in."}
            </p>
          </div>

          {/* Bottom decoration */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent to-[#c9f36c]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9f36c]/40" />
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-l from-transparent to-[#c9f36c]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#101412]">
        <div className="w-10 h-10 border-2 border-[#c9f36c] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
