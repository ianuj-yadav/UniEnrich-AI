"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col antialiased bg-black text-white relative">
      {/* Mandatory Edge-to-Edge Background Video */}
      <video 
        className="cinematic-bg" 
        autoPlay 
        muted 
        loop 
        playsInline 
        disablePictureInPicture 
        aria-hidden="true"
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Screen Vignette Overlay */}
      <div className="cinematic-vignette" />

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
