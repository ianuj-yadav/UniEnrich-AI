"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LogIn, LogOut, ArrowUpRight, Menu, X, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenCopilot?: () => void;
}

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "WORKSPACE", href: "/upload" },
  { name: "BATCH", href: "/products" },
  { name: "SAVED REPORTS", href: "/profile" },
  { name: "DOCUMENTATION", href: "/datasheet" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userDisplayName = user ? user.name.split(" ")[0].toUpperCase() : "ANUJ";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="h-16 bg-[#F2F1F0]/95 border-b border-stone-300 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl transition-all font-quantico">
      
      {/* Left: Targo-Style Logo + How It Works */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group" aria-label="UniEnrich home">
          {/* 38px dark (#111) circle with white 20x8px ellipse rotated -25° */}
          <div className="w-[36px] h-[36px] rounded-full bg-[#111111] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <div 
              className="w-[18px] h-[7px] rounded-full bg-white"
              style={{ transform: "rotate(-25deg)" }}
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-xl tracking-tight text-[#111111] lowercase">
              unienrich
            </span>
            <span className="text-[11px] font-bold text-[#15BCDF] uppercase tracking-widest hidden sm:inline">
              AI
            </span>
          </div>
        </Link>

        <Link 
          href="/datasheet" 
          className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#3a3a3a] hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-colors"
        >
          <span>HOW IT WORKS</span>
          <ArrowUpRight className="w-3 h-3 text-[#15BCDF]" />
        </Link>
      </div>

      {/* Center Status: Sentinel Telemetry */}
      <div className="hidden xl:flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider bg-white/70 px-3 py-1 rounded-full border border-stone-300 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>SPECIFICATION SIGNALS — REVIEWER JUDGMENT REQUIRED</span>
      </div>

      {/* Right Controls & Nav Links */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-bold uppercase text-[#3a3a3a]">
          {NAV_LINKS.slice(0, 4).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-black transition-colors ${
                pathname === link.href ? "text-black underline underline-offset-4 decoration-[#15BCDF] decoration-2" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Copilot Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-200 text-[#1a1c1e] text-xs font-bold uppercase tracking-wider border border-stone-300 shadow-2xs transition cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-[#15BCDF]" />
          <span className="hidden sm:inline">AI COPILOT</span>
        </button>

        {/* User Auth */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Link 
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-300 text-xs font-bold text-stone-900 hover:bg-stone-100 transition shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{userDisplayName}</span>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-stone-100 text-black border-2 border-stone-800 text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#15BCDF]" />
            <span className="text-black">SIGN IN</span>
          </Link>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col items-center justify-center gap-[4px] w-9 h-9 p-1.5 rounded-lg bg-[#111111] text-white shadow-xs cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <span className="w-4 h-[2px] bg-white rounded-full block" />
              <span className="w-4 h-[2px] bg-white rounded-full block" />
              <span className="w-4 h-[2px] bg-white rounded-full block" />
            </>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#F2F1F0] border-b border-stone-300 p-6 flex flex-col gap-4 shadow-xl z-50 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 font-bold text-sm text-[#1a1c1e]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 border-b border-stone-200 ${
                  pathname === link.href ? "text-[#15BCDF]" : "hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-stone-300 text-xs text-stone-500">
            <span>UNIENRICH INDUSTRIAL AI</span>
            <span className="text-emerald-600 font-bold">● ONLINE</span>
          </div>
        </div>
      )}
    </header>
  );
};
