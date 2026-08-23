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
  BookOpen
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
    <aside className="w-64 bg-black/50 border-r border-white/[0.1] min-h-screen flex flex-col justify-between shrink-0 backdrop-blur-xl">
      <div>
        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/[0.12] text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold backdrop-blur-md"
                    : "text-grey-300 hover:text-white hover:bg-white/[0.05]"
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
      <div className="p-4 m-3.5 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] text-xs backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 font-medium text-[11px]">Enrichment Engine</span>
          <Badge variant="green" size="sm" dot>Operational</Badge>
        </div>
        <div className="space-y-1.5 text-[11px] text-grey-400">
          <div className="flex justify-between">
            <span className="text-white/40">Model:</span>
            <span className="text-white/90">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Confidence Gate:</span>
            <span className="text-green-400 font-mono">70% Threshold</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">DDE Escaping:</span>
            <span className="text-blue-400 font-mono">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
