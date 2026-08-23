"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
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
  Building2,
  X,
  Check,
  LogOut,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PopButton } from "@/components/ui/PopButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, signup, user, isAuthenticated, logout } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Google OAuth Account Chooser Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [isCustomGoogle, setIsCustomGoogle] = useState(false);

  const handleGoogleCredential = useCallback(async ({ credential }: GoogleCredentialResponse): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    const ok = await loginWithGoogle(credential);
    if (ok) {
      setSuccessMessage("Google account verified. Opening your workspace…");
      setTimeout(() => router.push("/profile"), 600);
    } else {
      setErrorMessage("Google sign-in could not be verified. Please try again.");
    }
    setIsSubmitting(false);
  }, [loginWithGoogle, router]);

  const renderGoogleButton = useCallback((): void => {
    if (!googleClientId || !googleButtonRef.current || !window.google) return;
    googleButtonRef.current.replaceChildren();
    window.google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleCredential });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline", size: "large", width: googleButtonRef.current.clientWidth, text: "continue_with",
    });
  }, [googleClientId, handleGoogleCredential]);

  useEffect(() => {
    if (isGoogleLoaded) renderGoogleButton();
  }, [isGoogleLoaded, renderGoogleButton]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        if (!email.trim()) {
          setErrorMessage("Please enter your email address.");
          setIsSubmitting(false);
          return;
        }
        const ok = await login(email, password);
        if (ok) {
          setSuccessMessage(`Welcome back! Authenticated as ${email}`);
          setTimeout(() => router.push("/profile"), 600);
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } else {
        if (!name.trim() || !email.trim()) {
          setErrorMessage("Please fill out all required fields.");
          setIsSubmitting(false);
          return;
        }
        const ok = await signup(name, email, password);
        if (ok) {
          setSuccessMessage(`Account created successfully for ${name}!`);
          setTimeout(() => router.push("/profile"), 600);
        } else {
          setErrorMessage("Failed to create account.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectGoogleAccount = async (credential: string, accountName: string) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const ok = await loginWithGoogle(credential);
      if (ok) {
        setIsGoogleModalOpen(false);
        setSuccessMessage(`Signed in with Google as ${accountName}`);
        setTimeout(() => router.push("/profile"), 600);
      } else {
        setErrorMessage("Google authentication failed.");
      }
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
    const ok = await login("anuj.yadav@unienrich.ai", "Password123!");
    if (ok) {
      setSuccessMessage("Signed in with Lead Reviewer demo session.");
      setTimeout(() => router.push("/profile"), 500);
    }
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
              {mode === "signin" ? "Sign In to UniEnrich" : "Create Reviewer Account"}
            </h1>
            <p className="text-xs text-[#5e4d46] mt-1">
              Industrial Catalog Intelligence &amp; Master Enrichment Platform
            </p>
          </div>
        </div>

        {/* If Already Logged In: Show Active Session Notice */}
        {isAuthenticated && user && (
          <div className="p-4 rounded-3xl border-2 border-[#b18597] bg-[#fff0f0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-[#382b22]">CURRENTLY SIGNED IN</span>
              </div>
              <Badge variant="green" size="sm">{user.provider === "google" ? "Google" : "Email"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#2b201a]">{user.name}</div>
                <div className="text-xs text-[#5e4d46] font-mono">{user.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="primary" size="sm">
                    Open Profile
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-[#ffffff] hover:bg-[#faf6f6] border border-[#b18597] text-[#8c7770] hover:text-[#991b1b] transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Authentication Card */}
        <div className="auth-card rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_16px_48px_rgba(177,133,151,0.12)] space-y-6 relative overflow-hidden">
          {/* Ambient Top Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#fff0f0] rounded-full blur-2xl pointer-events-none opacity-80" />

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#faf6f6] border border-[#e8dede] relative z-10">
            <button
              type="button"
              onClick={() => { setMode("signin"); setErrorMessage(null); setSuccessMessage(null); }}
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
              onClick={() => { setMode("signup"); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold"
                  : "text-[#6e5d56] hover:text-[#2b201a]"
              }`}
            >
              Create Account
            </button>
          </div>

          <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setIsGoogleLoaded(true)} />

          {/* Google Identity Services renders its verified sign-in control here. */}
          <div className="space-y-3 relative z-10">
            <div className="rounded-2xl border-2 border-[#e8dede] bg-white p-1 shadow-[0_3px_0_0_#e8dede]">
              {googleClientId ? <div ref={googleButtonRef} className="min-h-10 w-full" /> : (
                <p className="px-4 py-3 text-center text-xs text-[#8c7770]">Google sign-in is not configured.</p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-[#e8dede] flex-1" />
              <span className="text-[10px] font-mono font-bold text-[#8c7770] uppercase">
                Or with Work Email
              </span>
              <div className="h-px bg-[#e8dede] flex-1" />
            </div>
          </div>

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10b981]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
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
              disabled={isSubmitting}
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

      {/* ====================================================================
          GOOGLE OAUTH ACCOUNT CHOOSER MODAL
          ==================================================================== */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b201a]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#ffffff] rounded-3xl border-2 border-[#b18597] shadow-[0_24px_64px_rgba(177,133,151,0.3)] max-w-sm w-full p-6 space-y-5">
            {/* Google Header */}
            <div className="flex items-start justify-between border-b border-[#e8dede] pb-3">
              <div className="flex items-center gap-2.5">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-[#2b201a]">Sign in with Google</h3>
                  <p className="text-[10px] text-[#8c7770]">to continue to UniEnrich AI</p>
                </div>
              </div>

              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#faf6f6] text-[#8c7770] hover:text-[#2b201a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount("anuj.yadav@gmail.com", "Anuj Yadav")}
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl border border-[#e8dede] hover:border-[#b18597] hover:bg-[#fff0f0] flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#b18597] text-[#ffffff] font-bold text-xs flex items-center justify-center">
                    AY
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2b201a] group-hover:text-[#b18597]">Anuj Yadav</div>
                    <div className="text-[11px] text-[#7a6860]">anuj.yadav@gmail.com</div>
                  </div>
                </div>
                <Badge variant="purple" size="sm">Personal</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount("anuj.yadav@unienrich.ai", "Anuj Yadav (Work)")}
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl border border-[#e8dede] hover:border-[#b18597] hover:bg-[#fff0f0] flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#382b22] text-[#fff0f0] font-bold text-xs flex items-center justify-center">
                    UW
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2b201a] group-hover:text-[#b18597]">Anuj Yadav (Work)</div>
                    <div className="text-[11px] text-[#7a6860]">anuj.yadav@unienrich.ai</div>
                  </div>
                </div>
                <Badge variant="pink" size="sm">Workspace</Badge>
              </button>

              {/* Custom Google Account Option */}
              {isCustomGoogle ? (
                <div className="p-3 rounded-2xl border-2 border-[#b18597] bg-[#faf6f6] space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-[#5e4d46] block">
                    Enter Google Email:
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#e8dede] bg-[#ffffff] text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      if (customGoogleEmail.trim()) {
                        const nameFrom = customGoogleEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
                        handleSelectGoogleAccount(customGoogleEmail, nameFrom);
                      }
                    }}
                  >
                    Continue as Google User
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogle(true)}
                  className="w-full p-2.5 rounded-2xl border border-dashed border-[#e8dede] hover:border-[#b18597] text-xs text-[#5e4d46] hover:text-[#2b201a] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#b18597]" />
                  <span>Use another Google account</span>
                </button>
              )}
            </div>

            {/* Google Notice */}
            <p className="text-[10px] text-[#8c7770] text-center leading-relaxed">
              To continue, Google will share your name, email address, and profile picture with UniEnrich AI.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
