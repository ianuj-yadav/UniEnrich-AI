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
  Bookmark,
  User,
  LogOut,
  LogIn,
  Palette
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/theme-showcase", label: "Design Studio", icon: Palette, badge: "Themes" },
  { href: "/profile", label: "Saved Dossiers", icon: Bookmark, badge: "Archive" },
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
  const { user, isAuthenticated, logout } = useAuth();

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
                    variant={isActive ? "pink" : (item.badge === "Vision" || item.badge === "Vector" || item.badge === "Archive" ? "purple" : "warning")} 
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

      {/* User Session & System Status Footer */}
      <div className="p-3.5 space-y-3">
        {/* User Card */}
        {isAuthenticated && user ? (
          <div className="p-3 rounded-2xl bg-[#ffffff] border border-[#e8dede] shadow-[0_2px_8px_rgba(177,133,151,0.05)] flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 rounded-xl bg-[#fff0f0] border border-[#b18597] flex items-center justify-center text-xs font-bold text-[#382b22] shrink-0">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-[#2b201a] truncate group-hover:text-[#b18597] transition-colors">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#8c7770] font-mono truncate">
                  {user.provider === "google" ? "Google OAuth" : user.role}
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-xl bg-[#faf6f6] hover:bg-[#fef2f2] border border-[#e8dede] text-[#8c7770] hover:text-[#991b1b] transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full py-2.5 px-3 rounded-2xl bg-[#fff0f0] hover:bg-[#ffe9e9] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] text-xs font-bold text-[#382b22] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#b18597]" />
            <span>SIGN IN TO VAULT</span>
          </Link>
        )}

        {/* Engine Status */}
        <div className="p-3 rounded-2xl bg-[#ffffff] border border-[#e8dede] text-[10px] shadow-[0_2px_8px_rgba(177,133,151,0.04)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#5e4d46] font-semibold uppercase tracking-wider">Engine Status</span>
            <Badge variant="green" size="sm" dot>Active</Badge>
          </div>
          <div className="flex justify-between text-[#7a6860]">
            <span>Model:</span>
            <span className="text-[#2b201a] font-semibold">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between text-[#7a6860]">
            <span>DDE Escaping:</span>
            <span className="text-[#1e40af] font-mono font-semibold">0% Risk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
