"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HERO_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4";
const ABOUT_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4";

export const TargoHeroSection: React.FC = () => {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const playVideos = () => {
      [heroVideoRef.current, aboutVideoRef.current].forEach((vid) => {
        if (vid) {
          vid.muted = true;
          vid.play().catch(() => {
            // Swallow rejection and let retry handler retry
          });
        }
      });
    };

    playVideos();
    const interval = setInterval(playVideos, 1000);

    const handleFirstInteraction = () => {
      playVideos();
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
        style={{ minHeight: "100svh" }}
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
        <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: "100svh" }}>
          
          {/* Navbar */}
          <header
            className="relative flex items-center justify-between flex-wrap z-20"
            style={{
              gap: "clamp(20px, 5vw, 56px)",
              padding: "clamp(20px, 3vw, 38px) clamp(20px, 4vw, 48px) 0",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              {/* 38px dark (#111) circle with white 20x8px ellipse rotated -25° */}
              <div 
                className="w-[38px] h-[38px] rounded-full bg-[#111111] flex items-center justify-center shrink-0 shadow-xs"
              >
                <div 
                  className="w-[20px] h-[8px] rounded-full bg-white"
                  style={{ transform: "rotate(-25deg)" }}
                />
              </div>
              <span
                className="font-normal text-[#111111] leading-none"
                style={{
                  fontSize: "clamp(22px, 5vw, 30px)",
                  letterSpacing: "-0.5px",
                }}
              >
                targo
              </span>
            </div>

            {/* Desktop Links HOME / ABOUT / CONTACT US */}
            <nav className="hidden md:flex items-center gap-[34px]">
              <a
                href="#hero"
                className="font-bold text-[#3a3a3a] hover:text-black transition-colors uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(12px, 2.4vw, 15px)", letterSpacing: "0.06em" }}
              >
                HOME
              </a>
              <a
                href="#about"
                className="font-bold text-[#3a3a3a] hover:text-black transition-colors uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(12px, 2.4vw, 15px)", letterSpacing: "0.06em" }}
              >
                ABOUT
              </a>
              <a
                href="#unihack-suite"
                className="font-bold text-[#3a3a3a] hover:text-black transition-colors uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(12px, 2.4vw, 15px)", letterSpacing: "0.06em" }}
              >
                WORKSPACE
              </a>
            </nav>

            {/* Desktop "Contact us" chamfered button */}
            <div className="hidden md:flex items-center">
              <a
                href="#about"
                className="chamfer-contact-btn flex items-center gap-2.5 bg-transparent hover:bg-white/20 text-white uppercase transition-all duration-200 cursor-pointer shadow-xs"
                style={{
                  padding: "14px 26px",
                  letterSpacing: "0.14em",
                  fontSize: "clamp(12px, 2vw, 14px)",
                }}
              >
                {/* White stroked mail-envelope SVG (17x13, stroke-width 1.4) */}
                <svg
                  width="17"
                  height="13"
                  viewBox="0 0 17 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white"
                  style={{ strokeWidth: 1.4 }}
                >
                  <rect x="0.7" y="0.7" width="15.6" height="11.6" rx="1.3" stroke="currentColor" />
                  <path d="M1 2L8.5 7.5L16 2" stroke="currentColor" />
                </svg>
                <span className="font-bold text-white">Contact us</span>
              </a>
            </div>

            {/* Mobile Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10 p-2 cursor-pointer rounded-lg bg-[#111111]/80 shadow-md"
              aria-label="Toggle navigation"
            >
              <span className="w-[22px] h-[2px] bg-white rounded-full block" />
              <span className="w-[22px] h-[2px] bg-white rounded-full block" />
              <span className="w-[22px] h-[2px] bg-white rounded-full block" />
            </button>

            {/* Mobile Stacked Menu */}
            {mobileMenuOpen && (
              <div className="w-full md:hidden flex flex-col gap-[18px] bg-white/95 p-6 rounded-2xl shadow-xl border border-stone-300 mt-3 font-bold text-[#1a1c1e] text-sm">
                <a href="#hero" onClick={() => setMobileMenuOpen(false)}>HOME</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>ABOUT</a>
                <a href="#unihack-suite" onClick={() => setMobileMenuOpen(false)}>WORKSPACE</a>
                <Link href="/upload" onClick={() => setMobileMenuOpen(false)} className="text-[#15BCDF]">OPEN WORKSPACE &rarr;</Link>
              </div>
            )}
          </header>

          {/* Headline (H1 Staircase Lines) */}
          <div
            className="flex flex-col select-none"
            style={
              isMobile
                ? {
                    marginTop: "360px",
                    padding: "0 20px 28px 20px",
                  }
                : {
                    padding:
                      "min(clamp(40px, 9vw, 120px), 9vh) 20px min(clamp(24px, 4vw, 44px), 5vh) clamp(20px, 9vw, 118px)",
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
              <div>SCALING</div>
              <div>THE</div>
              <div>PLATFORM</div>
              <div style={{ marginLeft: "min(238px, 28vw)" }}>FOR</div>
              <div style={{ marginLeft: "min(238px, 28vw)" }}>YOUR</div>
              <div style={{ marginLeft: "min(238px, 28vw)", color: "#15BCDF" }}>
                BUSINESS
              </div>
            </h1>
          </div>

          {/* CTA Button "GET STARTED" */}
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
              <span>GET STARTED</span>
              {/* Trailing 22x1px dark line */}
              <span className="w-[22px] h-[1px] bg-[#1a1c1e] block" />
            </Link>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 2: ABOUT SECTION
          ==================================================================== */}
      <section
        id="about"
        className="w-full flex flex-wrap items-center gap-[40px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #F2F1F0 0%, #F7F6F8 18%, #F7F6F8 100%)",
          padding: "clamp(60px, 10vw, 140px) 0 clamp(30px, 5vw, 70px) clamp(20px, 9vw, 118px)",
        }}
      >
        {/* Left Column */}
        <div className="flex-[1_1_420px] min-w-[300px] pr-6 md:pr-10 select-none">
          {/* H2 Staircase lines */}
          <h2
            className="uppercase font-bold text-[#2b3033]"
            style={{
              fontSize: "clamp(34px, 6.5vw, 72px)",
              lineHeight: 0.98,
              letterSpacing: "0.01em",
            }}
          >
            <div>ABOUT</div>
            <div style={{ marginLeft: "min(160px, 18vw)", color: "#15BCDF" }}>
              BUSINESS
            </div>
          </h2>

          {/* Verbatim Paragraph */}
          <p
            className="text-[#6b6f72] font-normal max-w-[520px]"
            style={{
              margin: "32px 0 0 min(160px, 18vw)",
              fontSize: "clamp(14px, 1.6vw, 17px)",
              lineHeight: 1.7,
            }}
          >
            Targo builds the testing infrastructure modern teams rely on. From automated pipelines to full-scale QA audits, we make sure your software ships fast and breaks nothing. Hundreds of releases, zero surprises.
          </p>

          {/* "LEARN MORE" Button */}
          <div style={{ margin: "36px 0 0 min(160px, 18vw)" }}>
            <Link
              href="/datasheet"
              className="chamfer-btn targo-btn-glow inline-flex items-center gap-3 bg-[#15BCDF] hover:bg-[#3fd0ef] border border-[#0fa3c2] text-[#1a1c1e] uppercase font-bold transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              style={{
                padding: "18px 34px",
                fontSize: "clamp(13px, 2.2vw, 16px)",
                letterSpacing: "0.14em",
              }}
            >
              <span>LEARN MORE</span>
              {/* Trailing 22x1px dark line */}
              <span className="w-[22px] h-[1px] bg-[#1a1c1e] block" />
            </Link>
          </div>
        </div>

        {/* Right Column: Video flush to right edge with #15BCDF Hue Blend Overlay */}
        <div className="flex-[1_1_360px] min-w-[280px] flex justify-end relative overflow-hidden">
          <div className="relative w-full max-w-[644px] flex justify-end">
            <video
              ref={aboutVideoRef}
              src={ABOUT_VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full max-w-[644px] h-auto block select-none pointer-events-none"
            />
            {/* Overlay rectangle: #15BCDF with mix-blend-mode: hue */}
            <div
              className="absolute top-0 right-0 w-full max-w-[644px] h-full pointer-events-none z-[1]"
              style={{
                backgroundColor: "#15BCDF",
                mixBlendMode: "hue",
              }}
            />
          </div>
        </div>
      </section>

    </div>
  );
};
