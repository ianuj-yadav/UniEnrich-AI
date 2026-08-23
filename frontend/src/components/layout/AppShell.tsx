"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#fdfbfb] text-[#2b201a] relative">
      {/* Light Ambient Background */}
      <div className="light-ambient-bg" />
      <div className="light-vignette" />

      {/* App Shell Navbar */}
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 relative z-10 w-full">
        {/* Render Sidebar only on internal workspace / app pages */}
        {!isHomePage && <Sidebar />}
        <main className={`flex-1 p-6 md:p-8 w-full overflow-x-hidden ${isHomePage ? "max-w-6xl mx-auto" : "max-w-7xl mx-auto"}`}>
          {children}
        </main>
      </div>

      <CopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};
