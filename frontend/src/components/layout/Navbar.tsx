"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, Cpu, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface NavbarProps {
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const [timeString, setTimeString] = useState("9:47 PM • 14 July 2026");

  useEffect(() => {
    // Dynamic real-time update with fallback to static format
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
    <header className="h-16 bg-black/60 border-b border-white/[0.12] px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Vantage home">
          {/* Exact 25x25 SVG Disc Brand Logo */}
          <div className="w-[25px] h-[25px] shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="navbar-brand-disc">
                  <circle cx="12.5" cy="12.5" r="12.5" />
                </clipPath>
              </defs>
              <g clip-path="url(#navbar-brand-disc)">
                <rect width="25" height="25" fill="#ededed" />
                <path d="M12.5 2.5L22.5 12.5L12.5 22.5L2.5 12.5Z" fill="#050606" />
                <path d="M12.5 5L20 12.5L12.5 20L5 12.5Z" fill="#737778" />
                <path d="M12.5 7.5L17.5 12.5L12.5 17.5L7.5 12.5Z" fill="#fafafa" />
                <path d="M12.5 9.5L15.5 12.5L12.5 15.5L9.5 12.5Z" fill="#0a0b0b" />
              </g>
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">Vantage</span>
            <span className="text-white/40 text-xs font-light">/</span>
            <span className="text-xs text-grey-300 font-medium hidden sm:inline">UniEnrich AI</span>
          </div>
        </Link>
      </div>

      {/* Center / Right Status & Time Panel */}
      <div className="flex items-center gap-4">
        {/* Time Panel (Timezone) */}
        <div className="hidden md:flex flex-col justify-center h-10 pl-3 border-l-2 border-white/20 text-left">
          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Timezone</span>
          <span className="text-xs font-medium text-white/90 font-mono tracking-tight">{timeString}</span>
        </div>

        {/* Model Spec Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-grey-200">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-white/50">Engine:</span>
          <span className="font-medium text-white">Gemini 2.5 Flash</span>
        </div>

        {/* Copilot Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 text-xs font-medium shadow-sm transition hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
        >
          <Bot className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
          <span>AI Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
        </button>
      </div>
    </header>
  );
};
