"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col antialiased bg-black-900 text-white-100">
      <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <CopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};
