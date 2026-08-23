"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HERO_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4";

export const TargoHeroSection: React.FC = () => {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Resize listener for breakpoint <= 700px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Video Autoplay Robustness logic: retry play() every 1s & on first user interaction
  useEffect(() => {
    const playVideo = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = true;
        heroVideoRef.current.play().catch(() => {
          // Swallow rejection and let retry handler retry
        });
      }
    };

    playVideo();
    const interval = setInterval(playVideo, 1000);

    const handleFirstInteraction = () => {
      playVideo();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  return (
    <div className="w-full font-quantico selection:bg-[#15BCDF] selection:text-[#111111] overflow-x-hidden">
      
      {/* ====================================================================
          SECTION 1: HERO SECTION
          ==================================================================== */}
      <section 
        className="relative w-full overflow-hidden bg-[#F2F1F0]"
        style={{ minHeight: "calc(100svh - 64px)" }}
      >
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute pointer-events-none object-contain select-none z-0"
          style={
            isMobile
              ? { top: 0, left: "-12%", width: "119%", height: "auto" }
              : { top: 0, right: "-20%", width: "99%", height: "auto" }
          }
        />

        {/* Desktop-only Scrim Overlay (Left 70%) */}
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              width: "70%",
              background:
                "linear-gradient(90deg, #F2F1F0 0%, #F2F1F0 55%, rgba(242,241,240,0.85) 78%, rgba(242,241,240,0) 100%)",
            }}
          />
        )}

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: "calc(100svh - 64px)" }}>
          
          {/* Top Spacing / Subheader Badge */}
          <div 
            className="flex items-center gap-3 pt-6"
            style={{
              paddingLeft: isMobile ? "20px" : "clamp(20px, 9vw, 118px)",
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 bg-white/60 px-3 py-1 rounded-full border border-stone-300">
              INDUSTRIAL CATALOG STANDARDIZATION &amp; ENRICHMENT
            </span>
          </div>

          {/* Headline (H1 Staircase Lines) */}
          <div
            className="flex flex-col select-none"
            style={
              isMobile
                ? {
                    marginTop: "300px",
                    padding: "0 20px 24px 20px",
                  }
                : {
                    padding:
                      "min(clamp(30px, 6vw, 80px), 6vh) 20px min(clamp(20px, 3vw, 36px), 4vh) clamp(20px, 9vw, 118px)",
                  }
            }
          >
            <h1
              className="uppercase font-bold text-[#2b3033]"
              style={{
                fontSize: isMobile
                  ? "clamp(34px, 10vw, 56px)"
                  : "min(clamp(34px, 7.6vw, 80px), 9.2vh)",
                lineHeight: 0.98,
                letterSpacing: "0.01em",
              }}
            >
              <div>ENRICHING</div>
              <div>THE</div>
              <div>CATALOG</div>
              <div style={{ marginLeft: "min(238px, 28vw)" }}>FOR</div>
              <div style={{ marginLeft: "min(238px, 28vw)" }}>MODERN</div>
              <div style={{ marginLeft: "min(238px, 28vw)", color: "#15BCDF" }}>
                INDUSTRY
              </div>
            </h1>
          </div>

          {/* CTA Button "EXPLORE WORKSPACE" */}
          <div
            className="flex items-center"
            style={{
              paddingLeft: isMobile 
                ? "20px" 
                : "calc(clamp(20px, 9vw, 118px) + min(238px, 28vw))",
              paddingBottom: "min(clamp(36px, 6vw, 80px), 7vh)",
            }}
          >
            <Link
              href="/upload"
              className="chamfer-btn targo-btn-glow inline-flex items-center gap-3 bg-[#15BCDF] hover:bg-[#3fd0ef] border border-[#0fa3c2] text-[#1a1c1e] uppercase font-bold transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              style={{
                padding: "18px 34px",
                fontSize: "clamp(13px, 2.2vw, 16px)",
                letterSpacing: "0.14em",
              }}
            >
              <span>EXPLORE WORKSPACE</span>
              {/* Trailing 22x1px dark line */}
              <span className="w-[22px] h-[1px] bg-[#1a1c1e] block" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
