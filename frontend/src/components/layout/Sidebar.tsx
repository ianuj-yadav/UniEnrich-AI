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
  LogIn
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-sky-600", bg: "bg-sky-50" },
  { href: "/profile", label: "Saved Dossiers", icon: Bookmark, badge: "Archive", color: "text-purple-600", bg: "bg-purple-50" },
  { href: "/upload", label: "CSV Ingestion", icon: UploadCloud, color: "text-cyan-600", bg: "bg-cyan-50" },
  { href: "/process", label: "Live Pipeline", icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50" },
  { href: "/products", label: "Catalog & Split View", icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/review", label: "Review Queue", icon: CheckSquare, badge: "HITL", color: "text-amber-600", bg: "bg-amber-50" },
  { href: "/duplicates", label: "Duplicate Merge", icon: GitMerge, badge: "Vector", color: "text-rose-600", bg: "bg-rose-50" },
  { href: "/datasheet", label: "Datasheet OCR Lab", icon: FileText, badge: "Vision", color: "text-purple-600", bg: "bg-purple-50" },
  { href: "/rules", label: "Rule Studio", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/analytics", label: "Data Quality", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
  { href: "/export", label: "Export Center", icon: Download, color: "text-orange-600", bg: "bg-orange-50" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <aside className="w-64 bg-white/95 border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 backdrop-blur-xl shadow-xs overflow-y-auto">
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${isActive ? "bg-white/20 text-white" : `${item.bg} ${item.color}`}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "blue" : (item.badge === "Vision" || item.badge === "Archive" ? "purple" : item.badge === "Vector" ? "red" : "warning")} 
                    size="sm"
                    className={isActive ? "bg-white/20 text-white border-white/30" : ""}
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
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {user.provider === "google" ? "Google OAuth" : user.role}
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full py-2.5 px-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600" />
            <span>SIGN IN TO VAULT</span>
          </Link>
        )}

        {/* Engine Status */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-[10px] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-semibold uppercase tracking-wider">Engine Status</span>
            <Badge variant="green" size="sm" dot>Active</Badge>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Model:</span>
            <span className="text-indigo-600 font-semibold">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>DDE Escaping:</span>
            <span className="text-emerald-700 font-mono font-semibold">0% Risk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
