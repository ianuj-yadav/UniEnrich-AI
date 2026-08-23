"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#fdfbfb] text-[#2b201a] relative">
      {/* Light Ambient Background */}
      <div className="light-ambient-bg" />
      <div className="light-vignette" />

      {/* App Shell Content */}
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <CopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};
