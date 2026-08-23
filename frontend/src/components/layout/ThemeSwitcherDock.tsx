"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Palette, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Eye
} from "lucide-react";
import { useTheme, ThemeStyle } from "@/context/ThemeContext";

export const ThemeSwitcherDock: React.FC = () => {
  const { theme, setTheme, config, allThemes } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  const isDark = theme === "matrix" || theme === "luxury";

  const handleSelect = (tId: ThemeStyle) => {
    setTheme(tId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[95vw]">
      {/* Toast Notification */}
      {showToast && (
        <div className="px-4 py-2 rounded-full bg-[#2b201a] text-white text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Theme: {config.name} ({config.tag})</span>
        </div>
      )}

      {/* Main Dock Container */}
      <div 
        className="flex items-center gap-2 p-2 rounded-3xl border-2 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.25)] transition-all"
        style={{
          backgroundColor: isDark ? "rgba(12, 14, 18, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderColor: config.colors.borderHover,
          color: config.colors.textPrimary,
        }}
      >
        {/* Dock Header / Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-r border-current/15">
          <Palette className="w-4 h-4 text-amber-500 animate-pulse" />
          <div className="hidden sm:block text-left">
            <span className="text-[10px] uppercase font-mono font-bold block opacity-60">Design Archetype</span>
            <span className="text-xs font-bold font-mono tracking-tight block">{config.name}</span>
          </div>
        </div>

        {/* Theme Buttons */}
        {isExpanded && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            {allThemes.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  title={`${t.name} - ${t.subtitle}`}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive 
                      ? "ring-2 scale-105 shadow-md" 
                      : "opacity-75 hover:opacity-100 hover:scale-100"
                  }`}
                  style={{
                    backgroundColor: isActive 
                      ? t.colors.surface 
                      : (isDark ? "#1a1f26" : "#faf6f6"),
                    color: t.colors.textPrimary,
                    borderColor: isActive ? t.colors.accent : "transparent",
                    borderWidth: isActive ? "2px" : "1px",
                    outlineColor: t.colors.accent,
                  }}
                >
                  <span className="text-sm">{t.icon}</span>
                  <span className="hidden md:inline font-mono text-[11px]">{t.name}</span>
                  {isActive && <Check className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Showcase Link */}
        <Link
          href="/theme-showcase"
          className="px-3 py-1.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100 hover:bg-current/10"
          title="Open Full Design Studio Gallery"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Gallery</span>
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl hover:bg-current/10 transition cursor-pointer"
          title={isExpanded ? "Collapse Dock" : "Expand Theme Dock"}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
