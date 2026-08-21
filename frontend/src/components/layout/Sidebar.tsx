"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Cpu, 
  Database, 
  CheckSquare, 
  BarChart3, 
  Download,
  GitMerge,
  FileText,
  BookOpen,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "CSV Ingestion", icon: UploadCloud },
  { href: "/process", label: "Live Pipeline", icon: Cpu },
  { href: "/products", label: "Catalog & Split View", icon: Database },
  { href: "/review", label: "Review Queue", icon: CheckSquare, badge: "HITL" },
  { href: "/duplicates", label: "Duplicate Merge", icon: GitMerge, badge: "Vector" },
  { href: "/datasheet", label: "Datasheet OCR Lab", icon: FileText, badge: "Vision" },
  { href: "/rules", label: "Rule Studio", icon: BookOpen },
  { href: "/analytics", label: "Data Quality", icon: BarChart3 },
  { href: "/export", label: "Export Center", icon: Download },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black-900 border-r border-black-700 min-h-screen flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-black-700">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
            UE
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              UniEnrich AI
              <Badge variant="blue" size="sm">v2.0</Badge>
            </div>
            <div className="text-[11px] text-grey-400">Product Data Intelligence</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-grey-300 hover:text-white hover:bg-black-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-grey-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "default" : (item.badge === "Vision" || item.badge === "Vector" ? "purple" : "warning")} 
                    size="sm"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 m-3 rounded-lg bg-black-950 border border-black-700/60 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-grey-400 font-medium text-[11px]">System Status</span>
          <Badge variant="green" size="sm" dot>Operational</Badge>
        </div>
        <div className="space-y-1 text-[11px] text-grey-500">
          <div className="flex justify-between">
            <span>LLM Engine:</span>
            <span className="text-grey-300">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between">
            <span>Confidence Gate:</span>
            <span className="text-grey-300">70% Threshold</span>
          </div>
          <div className="flex justify-between">
            <span>Vector Match:</span>
            <span className="text-grey-300">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
