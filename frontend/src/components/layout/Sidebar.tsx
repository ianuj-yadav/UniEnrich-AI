"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Cpu, 
  Layers, 
  CheckSquare, 
  BarChart3, 
  Download,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "CSV Ingestion", href: "/upload", icon: UploadCloud },
  { label: "Live Pipeline", href: "/process", icon: Cpu },
  { label: "Catalog & Split View", href: "/products", icon: Layers },
  { label: "Human Review Queue", href: "/review", icon: CheckSquare, badge: "HITL" },
  { label: "Data Quality Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Export Center", href: "/export", icon: Download },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black-900 border-r border-black-600 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold text-grey-400 uppercase tracking-wider px-3 mb-2 block">
            Core Modules
          </span>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                      : "text-grey-200 hover:bg-black-800 hover:text-white-100 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-grey-300")} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-600/30 text-yellow-400 border border-yellow-500/40 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-black-600">
          <span className="text-[11px] font-semibold text-grey-400 uppercase tracking-wider px-3 mb-2 block">
            Documentation & Standards
          </span>
          <div className="space-y-1 text-xs text-grey-300 px-3">
            <div className="flex items-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              <span>IEEE 29148 SRS Active</span>
            </div>
            <div className="flex items-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>UNSPSC Classification</span>
            </div>
            <div className="flex items-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>9 Industrial Attributes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-black-800 border border-black-600 rounded-lg text-xs space-y-1.5">
        <div className="font-semibold text-white-100">UniEnrich AI Engine</div>
        <p className="text-grey-300 text-[11px] leading-relaxed">
          Transforms cryptic MRO abbreviations into search-ready e-commerce records.
        </p>
      </div>
    </aside>
  );
};
