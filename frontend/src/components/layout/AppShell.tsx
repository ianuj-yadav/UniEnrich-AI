"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isLandingOrLogin = pathname === "/" || pathname === "/login";

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLandingOrLogin) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLandingOrLogin, isLoading, router]);

  if (!isLandingOrLogin && (isLoading || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] text-[#363636]">
        <div className="rounded-2xl border border-[#cedaee] bg-[#faf9f7] px-5 py-4 text-xs font-mono uppercase tracking-wider shadow-sm">
          Securing workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#f6f6f6] text-[#161616] relative">
      {/* Light Ambient Background */}
      <div className="light-ambient-bg" />
      <div className="light-vignette" />

      {/* App Shell Navbar */}
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 relative z-10 w-full">
        {/* Render Sidebar only on internal workspace / app pages */}
        {!isLandingOrLogin && <Sidebar />}
        <main className={`flex-1 p-6 md:p-8 w-full overflow-x-hidden ${isLandingOrLogin ? "max-w-6xl mx-auto" : "max-w-7xl mx-auto"}`}>
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
