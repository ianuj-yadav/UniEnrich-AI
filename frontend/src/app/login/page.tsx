"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Cpu, 
  Zap, 
  KeyRound,
  Building2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PopButton } from "@/components/ui/PopButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, signup, user, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("anuj.yadav@unienrich.ai");
  const [password, setPassword] = useState("Password123!");
  const [name, setName] = useState("Anuj Yadav");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        if (!email.trim()) {
          setErrorMessage("Please enter your email address.");
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name.trim() || !email.trim()) {
          setErrorMessage("Please fill out all required fields.");
          setIsSubmitting(false);
          return;
        }
        await signup(name, email, password);
      }
      router.push("/profile");
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch (err: any) {
      setErrorMessage(err?.message || "Google sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail("anuj.yadav@unienrich.ai");
    setPassword("Password123!");
    setIsSubmitting(true);
    await login("anuj.yadav@unienrich.ai", "Password123!");
    router.push("/profile");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Top Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="login-brand-disc">
                    <circle cx="12.5" cy="12.5" r="12.5" />
                  </clipPath>
                </defs>
                <g clipPath="url(#login-brand-disc)">
                  <rect width="25" height="25" fill="#fdfafb" />
                  <path d="M12.5 2.5L22.5 12.5L12.5 22.5L2.5 12.5Z" fill="#382b22" />
                  <path d="M12.5 5L20 12.5L12.5 20L5 12.5Z" fill="#b18597" />
                  <path d="M12.5 7.5L17.5 12.5L12.5 17.5L7.5 12.5Z" fill="#fff0f0" />
                  <path d="M12.5 9.5L15.5 12.5L12.5 15.5L9.5 12.5Z" fill="#382b22" />
                </g>
              </svg>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b201a] tracking-tight">
              {mode === "signin" ? "Sign In to Vantage" : "Create Reviewer Account"}
            </h1>
            <p className="text-xs text-[#5e4d46] mt-1">
              Industrial Catalog Intelligence &amp; Master Enrichment Platform
            </p>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_16px_48px_rgba(177,133,151,0.12)] space-y-6 relative overflow-hidden">
          {/* Ambient Top Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#fff0f0] rounded-full blur-2xl pointer-events-none opacity-80" />

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#faf6f6] border border-[#e8dede] relative z-10">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold"
                  : "text-[#6e5d56] hover:text-[#2b201a]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold"
                  : "text-[#6e5d56] hover:text-[#2b201a]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* 1. Google OAuth Button */}
          <div className="space-y-3 relative z-10">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ffffff] hover:bg-[#faf6f6] border-2 border-[#e8dede] hover:border-[#b18597] text-[#2b201a] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_0_0_#e8dede] hover:shadow-[0_4px_0_0_#b18597] active:translate-y-1 transition-all cursor-pointer"
            >
              {/* Google G Logo SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-[#e8dede] flex-1" />
              <span className="text-[10px] font-mono font-bold text-[#8c7770] uppercase">
                Or with Email
              </span>
              <div className="h-px bg-[#e8dede] flex-1" />
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 2. Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-[#5e4d46] block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8c7770] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anuj Yadav"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#e8dede] bg-[#faf6f6] text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase font-bold text-[#5e4d46] block">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8c7770] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anuj.yadav@unienrich.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#e8dede] bg-[#faf6f6] text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase font-bold text-[#5e4d46] block">
                  Password
                </label>
                {mode === "signin" && (
                  <span className="text-[10px] text-[#b18597] font-semibold hover:underline cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8c7770] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-[#e8dede] bg-[#faf6f6] text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7770] hover:text-[#2b201a]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <PopButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-bold tracking-wider cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin text-[#382b22]" />
                    <span>AUTHENTICATING CIPHER VAULT...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{mode === "signin" ? "SIGN IN TO WORKSPACE" : "CREATE REVIEWER ACCOUNT"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </PopButton>
            </div>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-[#e8dede] space-y-2 relative z-10">
            <div className="text-[10px] font-mono text-center text-[#8c7770] uppercase font-bold">
              Instant Demo Access
            </div>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 rounded-xl bg-[#faf6f6] hover:bg-[#fff0f0] border border-[#e8dede] hover:border-[#b18597] text-xs font-semibold text-[#382b22] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#b18597]" />
              <span>Login with Lead Reviewer Demo (Anuj Yadav)</span>
            </button>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#8c7770]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#065f46]" />
            <span>256-bit TLS Encrypted</span>
          </span>
          <span>•</span>
          <span>SOC2 Type II</span>
          <span>•</span>
          <span>Zero Formula Risk</span>
        </div>
      </div>
    </div>
  );
}
