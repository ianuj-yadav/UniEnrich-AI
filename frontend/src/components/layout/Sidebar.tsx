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
    <aside className="w-64 bg-[#faf6f6]/95 border-r border-[#e8dede] sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 backdrop-blur-xl shadow-[1px_0_10px_rgba(177,133,151,0.03)] overflow-y-auto">
      <div>
        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                  isActive
                    ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                    : "text-[#6e5d56] hover:text-[#2b201a] hover:bg-[#ffffff] hover:border hover:border-[#e8dede]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#b18597]" : "text-[#8c7770]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "pink" : (item.badge === "Vision" || item.badge === "Vector" ? "purple" : "warning")} 
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
      <div className="p-4 m-3.5 rounded-2xl bg-[#ffffff] border border-[#e8dede] text-xs shadow-[0_2px_12px_rgba(177,133,151,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#5e4d46] font-semibold text-[11px] uppercase tracking-wider">Engine Status</span>
          <Badge variant="green" size="sm" dot>Active</Badge>
        </div>
        <div className="space-y-1.5 text-[11px] text-[#7a6860]">
          <div className="flex justify-between">
            <span className="text-[#8c7770]">Model:</span>
            <span className="text-[#2b201a] font-semibold">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c7770]">Confidence Gate:</span>
            <span className="text-[#065f46] font-mono font-semibold">70% Auto-Approved</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c7770]">DDE Escaping:</span>
            <span className="text-[#1e40af] font-mono font-semibold">0% Risk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
