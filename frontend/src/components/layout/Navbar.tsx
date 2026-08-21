"use client";

import React from "react";
import { Sparkles, Shield, Cpu, RefreshCw, Bot, Bell } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  return (
    <header className="h-16 bg-black-900 border-b border-black-700 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-grey-400">
          <span className="text-grey-200 font-medium">Platform</span>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Industrial Catalog Engine</span>
        </div>
      </div>

      {/* Action Controls & Badges */}
      <div className="flex items-center gap-3">
        {/* Copilot Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/60 text-purple-300 text-xs font-semibold shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
        </button>

        {/* Engine Token */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black-950 border border-black-700 text-xs text-grey-300">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-grey-400">Model:</span>
          <span className="font-semibold text-white">Gemini 2.5 Flash</span>
        </div>

        {/* Quality Threshold */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black-950 border border-black-700 text-xs text-grey-300">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span className="text-grey-400">Threshold:</span>
          <span className="font-semibold text-green-400">&ge; 70%</span>
        </div>
      </div>
    </header>
  );
};
