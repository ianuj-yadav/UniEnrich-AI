import React from "react";
import Link from "next/link";
import { Sparkles, Database, ShieldCheck, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-black-900 border-b border-black-600 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white-50 font-bold text-lg shadow-sm group-hover:bg-blue-400 transition-colors">
            U
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white-100 tracking-tight">UniEnrich AI</span>
              <Badge variant="purple" size="sm">v1.0 Hackathon</Badge>
            </div>
            <span className="text-[11px] text-grey-400 block -mt-0.5">Industrial Catalog Intelligence</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black-800 border border-black-600 rounded-md text-xs text-grey-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>LLM Engine: <strong className="text-white-100 font-medium">Gemini 2.5 Flash</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-black-800 border border-black-600 rounded-md text-xs text-grey-200">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Matching: <strong className="text-white-100 font-medium">RapidFuzz C++</strong></span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700/60 rounded-md text-xs text-green-300">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span>Quality Gate: <strong>&ge; 70%</strong></span>
        </div>
      </div>
    </header>
  );
};
