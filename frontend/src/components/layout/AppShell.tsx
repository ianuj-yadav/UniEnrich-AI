"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isLanding = pathname === "/";
  const isLogin = pathname === "/login";

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLanding && !isLogin) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLanding, isLogin, isLoading, router]);

  if (!isLanding && !isLogin && (isLoading || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ed] text-[#111111]">
        <div className="rounded-2xl border border-stone-300 bg-white px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
          Securing workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#f7f4ed] text-[#111111] relative selection:bg-[#bae6fd] selection:text-[#0369a1]">
      {/* App Shell Navbar */}
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 relative z-10 w-full">
        {/* Render Sidebar only on internal workspace / app pages */}
        {!isLanding && !isLogin && <Sidebar />}
        <main className={`flex-1 w-full overflow-x-hidden ${isLanding ? "p-0 max-w-none" : isLogin ? "p-6 md:p-8 max-w-md mx-auto" : "p-6 md:p-8 max-w-7xl mx-auto"}`}>
          {children}
        </main>
      </div>

      <CopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppShellContent>{children}</AppShellContent>
    </AuthProvider>
  );
};
