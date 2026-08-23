"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Cpu, Sparkles, User } from "lucide-react";

interface NavbarProps {
  onOpenCopilot?: () => void;
}

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "WORKSPACE", href: "/upload" },
  { name: "BATCH", href: "/products" },
  { name: "METHODOLOGY", href: "/rules" },
  { name: "DOCUMENTATION", href: "/datasheet" },
  { name: "REPORTS", href: "/analytics" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const pathname = usePathname();
  const [timeString, setTimeString] = useState("9:47 PM • 14 July 2026");

  useEffect(() => {
    try {
      const updateTime = () => {
        const now = new Date();
        const timePart = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        const datePart = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        setTimeString(`${timePart} • ${datePart}`);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    } catch {
      // Fallback
    }
  }, []);

  return (
    <header className="h-16 bg-black/75 border-b border-white/[0.12] px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Araxyss home">
          {/* Exact 25x25 SVG Disc Brand Logo */}
          <div className="w-[25px] h-[25px] shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="navbar-brand-disc">
                  <circle cx="12.5" cy="12.5" r="12.5" />
                </clipPath>
              </defs>
              <g clipPath="url(#navbar-brand-disc)">
                <rect width="25" height="25" fill="#ededed" />
                <path d="M12.5 2.5L22.5 12.5L12.5 22.5L2.5 12.5Z" fill="#050606" />
                <path d="M12.5 5L20 12.5L12.5 20L5 12.5Z" fill="#737778" />
                <path d="M12.5 7.5L17.5 12.5L12.5 17.5L7.5 12.5Z" fill="#fafafa" />
                <path d="M12.5 9.5L15.5 12.5L12.5 15.5L9.5 12.5Z" fill="#0a0b0b" />
              </g>
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">Araxyss</span>
            <span className="text-white/40 text-xs font-light">/</span>
            <span className="text-xs text-grey-300 font-medium hidden sm:inline">UniEnrich AI</span>
          </div>
        </Link>
      </div>

      {/* Center Nav Links (Araxyss Navigation Bar) */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative px-3.5 py-1.5 text-xs font-bold tracking-wider transition-colors uppercase ${
                isActive ? "text-white" : "text-grey-400 hover:text-white"
              }`}
            >
              <span>{link.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls & User Info */}
      <div className="flex items-center gap-3">
        {/* Time Panel */}
        <div className="hidden xl:flex flex-col justify-center h-9 pl-3 border-l border-white/20 text-left mr-1">
          <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider">Timezone</span>
          <span className="text-[11px] font-medium text-white/90 font-mono tracking-tight">{timeString}</span>
        </div>

        {/* Copilot Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2e1065]/70 hover:bg-[#3b0764] border-2 border-[#8b5cf6] text-[#e9d5ff] text-xs font-semibold uppercase tracking-wider shadow-[0_4px_0_0_#8b5cf6] transition-all hover:translate-y-0.5 active:translate-y-1.5 backdrop-blur-md cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-[#c084fc] animate-pulse" />
          <span className="hidden sm:inline">AI COPILOT</span>
        </button>

        {/* User / Analyst Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1c23] border-2 border-[#b18597]/50 shadow-[0_4px_0_0_#b18597/60] text-xs text-white font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>ANUJ</span>
        </div>
      </div>
    </header>
  );
};

