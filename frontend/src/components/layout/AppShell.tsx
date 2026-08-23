"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { ThemeSwitcherDock } from "./ThemeSwitcherDock";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isLandingOrLogin = pathname === "/" || pathname === "/login" || pathname === "/theme-showcase";

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLandingOrLogin) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLandingOrLogin, isLoading, router]);

  if (!isLandingOrLogin && (isLoading || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbfb] text-[#2b201a]">
        <div className="rounded-2xl border-2 border-[#e8dede] bg-[#ffffff] px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider shadow-md">
          Securing workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased relative selection:bg-[#f9c4d2] selection:text-[#382b22]">
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
      
      {/* Floating Interactive Theme Switcher Dock */}
      <ThemeSwitcherDock />
    </div>
  );
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppShellContent>{children}</AppShellContent>
      </ThemeProvider>
    </AuthProvider>
  );
};
