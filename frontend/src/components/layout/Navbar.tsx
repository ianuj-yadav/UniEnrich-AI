"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Cpu, Sparkles, User, Bookmark, LogIn, LogOut, Menu, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenCopilot?: () => void;
}

const NAV_LINKS = [
  { name: "WORKSPACE", href: "/upload" },
  { name: "BATCH", href: "/products" },
  { name: "SAVED REPORTS", href: "/profile" },
  { name: "METHODOLOGY", href: "/rules" },
  { name: "DOCUMENTATION", href: "/datasheet" },
  { name: "REPORTS", href: "/analytics" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const userDisplayName = user ? user.name.split(" ")[0].toUpperCase() : "ANUJ";

  return (
    <header className="h-14 bg-[#f7f4ed]/95 border-b border-stone-300 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl transition-all">
      {/* Left: How It Works & Brand */}
      <div className="flex items-center gap-6">
        <Link 
          href="/datasheet" 
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 hover:text-black border-b border-stone-400 hover:border-black pb-0.5 transition-colors"
        >
          <span>HOW IT WORKS</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>

        <Link href="/" className="flex items-center gap-2.5 group" aria-label="UniHack home">
          {/* Brand Logo [U] */}
          <div className="w-6 h-6 rounded bg-[#111111] text-[#f7f4ed] font-mono font-black flex items-center justify-center text-xs shadow-xs">
            U
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-[#111111]">
            <span>UniHack</span>
            <span className="text-stone-400 font-light">/</span>
            <span className="text-xs text-stone-600 font-medium hidden md:inline">UniEnrich AI</span>
          </div>
        </Link>
      </div>

      {/* Center Status: Sentinel Telemetry */}
      <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>SPECIFICATION SIGNALS — REVIEWER JUDGMENT REQUIRED</span>
      </div>

      {/* Right Controls & Nav Links */}
      <div className="flex items-center gap-3">
        {/* Quick Nav Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-mono font-bold uppercase text-stone-700">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-black transition-colors ${pathname === link.href ? "text-black underline underline-offset-4" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Copilot Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-900 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">AI COPILOT</span>
        </button>

        {/* User Auth */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Link 
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-stone-900 hover:bg-stone-200 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{userDisplayName}</span>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1 rounded-lg hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1 rounded-lg bg-black text-[#f7f4ed] text-xs font-mono font-bold uppercase tracking-wider hover:bg-stone-800 transition cursor-pointer"
          >
            SIGN IN
          </Link>
        )}
      </div>
    </header>
  );
};
