"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, ArrowRight, RefreshCw, Cpu, CheckCircle2, Zap, Terminal, Activity, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface DemoSKU {
  id: string;
  category: string;
  icon: string;
  raw: string;
  clean: string;
  brand: string;
  brandConf: number;
  score: number;
  specs: { label: string; val: string; isNew?: boolean }[];
  unspsc: string;
  tokens: { text: string; type: "brand" | "size" | "material" | "standard" | "raw" }[];
}

const DEMO_SKUS: DemoSKU[] = [
  {
    id: "sku-1",
    category: "Fasteners",
    icon: "🔩",
    raw: "HEX BLT 1/2-13x2 SS316 DIN933 PK100",
    clean: 'Hex Head Bolt 1/2"-13 x 2" Grade 316 Stainless Steel (DIN 933, Pack of 100)',
    brand: "Fabory Fasteners",
    brandConf: 98.4,
    score: 98.4,
    specs: [
      { label: "Thread Pitch", val: '1/2"-13 UNC', isNew: true },
      { label: "Material Grade", val: "316 Marine SS", isNew: true },
      { label: "ISO Standard", val: "DIN 933 / ISO 4017", isNew: true },
      { label: "Packaging", val: "100 Units / Pack", isNew: true },
    ],
    unspsc: "31161620 (Hex bolts)",
    tokens: [
      { text: "HEX BLT", type: "standard" },
      { text: "1/2-13x2", type: "size" },
      { text: "SS316", type: "material" },
      { text: "DIN933", type: "standard" },
      { text: "PK100", type: "size" },
    ],
  },
  {
    id: "sku-2",
    category: "Bearings",
    icon: "⚙️",
    raw: "BRG BALL DGRV 6205 2RSH C3 SKF ID25 OD52",
    clean: "Deep Groove Ball Bearing 6205-2RSH/C3 Dual Rubber Seals (25x52x15mm, SKF)",
    brand: "SKF Group",
    brandConf: 99.2,
    score: 99.2,
    specs: [
      { label: "Bore Size", val: "25 mm ID", isNew: true },
      { label: "Outer Diameter", val: "52 mm OD", isNew: true },
      { label: "Radial Clearance", val: "C3 Internal", isNew: true },
      { label: "Seal Type", val: "Dual Rubber Contact", isNew: true },
    ],
    unspsc: "31171504 (Ball bearings)",
    tokens: [
      { text: "BRG BALL", type: "standard" },
      { text: "6205", type: "size" },
      { text: "2RSH", type: "material" },
      { text: "C3", type: "standard" },
      { text: "SKF", type: "brand" },
    ],
  },
  {
    id: "sku-3",
    category: "Valves",
    icon: "🚰",
    raw: "SS-43GS4 SWAGELOK 1/4IN 1-PC 40G BALL VLV PTFE",
    clean: '40G Series One-Piece 1/4" Tube Ball Valve 316 Stainless Steel Virgin PTFE Seats',
    brand: "Swagelok",
    brandConf: 99.0,
    score: 97.8,
    specs: [
      { label: "Inlet Connection", val: '1/4" Fractional Fitting', isNew: true },
      { label: "Body Material", val: "Forged 316 SS", isNew: true },
      { label: "Pressure Limit", val: "2500 psig (172 bar)", isNew: true },
      { label: "Seat Material", val: "Virgin PTFE", isNew: true },
    ],
    unspsc: "40141607 (Ball valves)",
    tokens: [
      { text: "SS-43GS4", type: "brand" },
      { text: "SWAGELOK", type: "brand" },
      { text: "1/4IN", type: "size" },
      { text: "BALL VLV", type: "standard" },
      { text: "PTFE", type: "material" },
    ],
  },
  {
    id: "sku-4",
    category: "Electrical",
    icon: "⚡",
    raw: "FLUKE 87-V IND MULTIMETER TRMS 1000V AC/DC CAT IV",
    clean: "Fluke 87V Industrial True-RMS Digital Multimeter 1000V AC/DC CAT IV 600V",
    brand: "Fluke Industrial",
    brandConf: 98.6,
    score: 98.9,
    specs: [
      { label: "Safety Rating", val: "CAT IV 600V / CAT III", isNew: true },
      { label: "Measurement", val: "True-RMS AC/DC", isNew: true },
      { label: "Max Voltage", val: "1000 V AC/DC", isNew: true },
      { label: "Display Counts", val: "20,000 Counts High Res", isNew: true },
    ],
    unspsc: "41113608 (Multimeters)",
    tokens: [
      { text: "FLUKE 87-V", type: "brand" },
      { text: "IND", type: "standard" },
      { text: "TRMS", type: "material" },
      { text: "1000V", type: "size" },
      { text: "CAT IV", type: "standard" },
    ],
  },
];

export function HeroSignalMonitor() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      triggerScan((activeIdx + 1) % DEMO_SKUS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeIdx, isAutoPlay]);

  const triggerScan = (newIdx: number) => {
    setIsScanning(true);
    setTimeout(() => {
      setActiveIdx(newIdx);
      setIsScanning(false);
    }, 280);
  };

  const handleSelectPreset = (idx: number) => {
    setIsAutoPlay(false);
    triggerScan(idx);
  };

  const current = DEMO_SKUS[activeIdx];

  return (
    <div className="relative">
      {/* Floating Pill: Top Right Metric */}
      <div className="absolute -top-3.5 right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[10px] font-mono font-bold text-[#065f46] shadow-[0_4px_12px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>⚡ 1,472 SKUs Ingested in 42ms</span>
      </div>

      {/* Main Terminal Container Card */}
      <div className="relative rounded-3xl border-2 border-[#b18597] bg-[#ffffff] p-6 sm:p-7 shadow-[0_16px_48px_rgba(177,133,151,0.18)] space-y-4 font-sans select-none overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#fff0f0] rounded-full blur-2xl pointer-events-none opacity-90" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#f9c4d2]/30 rounded-full blur-2xl pointer-events-none opacity-80" />

        {/* Card Cockpit Header */}
        <div className="flex items-center justify-between border-b border-[#e8dede] pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fff0f0] border-2 border-[#b18597] flex items-center justify-center text-[#382b22] shadow-[0_2px_0_0_#b18597]">
              <Cpu className="w-4 h-4 text-[#b18597] animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider flex items-center gap-1.5">
                <span>VANTAGE SIGNAL MONITOR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-extrabold text-[#2b201a] tracking-tight">
                Live Multi-Signal Extraction Engine
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => triggerScan((activeIdx + 1) % DEMO_SKUS.length)}
              title="Next Sample"
              className="p-1.5 rounded-lg bg-[#faf6f6] hover:bg-[#fff0f0] border border-[#e8dede] text-[#6e5d56] hover:text-[#2b201a] transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-[#b18597]" : ""}`} />
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[#f5f3ff] border border-[#ddd6fe] text-[10px] font-mono font-bold text-[#5b21b6]">
              GEMINI 2.5
            </span>
          </div>
        </div>

        {/* Domain Category Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 relative z-10">
          {DEMO_SKUS.map((sku, idx) => (
            <button
              key={sku.id}
              onClick={() => handleSelectPreset(idx)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeIdx === idx
                  ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold scale-[1.02]"
                  : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
              }`}
            >
              <span>{sku.icon}</span>
              <span className="hidden sm:inline">{sku.category}</span>
            </button>
          ))}
        </div>

        {/* Active Transformation Display */}
        <div className={`space-y-3.5 transition-all duration-300 relative z-10 ${isScanning ? "opacity-30 scale-[0.99] filter blur-[1px]" : "opacity-100 scale-100"}`}>
          {/* Raw Feed Input Chip with Token Attribution */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8c7770] uppercase font-bold">
              <span>1. Raw Supplier Acronym Feed</span>
              <span className="text-[#991b1b] bg-[#fef2f2] px-1.5 py-0.5 rounded border border-[#fecaca]">Unstructured</span>
            </div>
            
            <div className="p-3 rounded-2xl border-2 border-[#e8dede] bg-[#faf6f6] font-mono text-[11px] text-[#2b201a] flex flex-wrap gap-1.5 items-center">
              {current.tokens.map((tok, i) => (
                <span
                  key={i}
                  className={`px-1.5 py-0.5 rounded-md font-semibold ${
                    tok.type === "brand"
                      ? "bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]"
                      : tok.type === "size"
                      ? "bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe]"
                      : tok.type === "material"
                      ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                      : "bg-[#fff0f0] text-[#703d52] border border-[#f9c4d2]"
                  }`}
                >
                  {tok.text}
                </span>
              ))}
            </div>
          </div>

          {/* Standardized Master Output Chip */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8c7770] uppercase font-bold">
              <span>2. Certified Master Record Title</span>
              <span className="text-[#065f46] bg-[#ecfdf5] px-1.5 py-0.5 rounded border border-[#a7f3d0] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#10b981]" /> Auto-Approved
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border-2 border-[#b18597] bg-[#fff0f0] text-xs font-extrabold text-[#2b201a] leading-snug shadow-sm">
              {current.clean}
            </div>
          </div>

          {/* 4 Extracted Specs Grid */}
          <div>
            <div className="text-[10px] font-mono text-[#8c7770] uppercase font-bold mb-1.5">
              Extracted Engineering Specifications (15+ Attributes)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {current.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="p-2.5 rounded-xl border border-[#e8dede] bg-[#ffffff] flex flex-col justify-between hover:border-[#b18597] transition shadow-2xs"
                >
                  <span className="text-[9px] text-[#8c7770] font-mono font-bold uppercase tracking-wider">{spec.label}</span>
                  <span className="font-mono font-bold text-xs text-[#065f46] mt-0.5 truncate">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Metrics & Confidence Gate */}
        <div className="pt-3 border-t border-[#e8dede] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono relative z-10">
          <div className="flex items-center gap-2 text-[#5e4d46]">
            <ShieldCheck className="w-4 h-4 text-[#065f46]" />
            <span>UNSPSC: <strong className="text-[#2b201a]">{current.unspsc}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8c7770] font-semibold">Confidence:</span>
            <span className="text-[#065f46] font-extrabold text-sm">
              <AnimatedCounter value={current.score} decimals={1} suffix="%" />
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#fff0f0] text-[#703d52] border border-[#b18597] text-[10px] font-extrabold">
              GATE PASS
            </span>
          </div>
        </div>
      </div>

      {/* Floating Pill: Bottom Left Security Badge */}
      <div className="absolute -bottom-3.5 left-6 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] border-2 border-[#b18597] text-[10px] font-mono font-bold text-[#382b22] shadow-[0_4px_12px_rgba(177,133,151,0.2)] animate-in fade-in zoom-in duration-300">
        <ShieldCheck className="w-3.5 h-3.5 text-[#b18597]" />
        <span>100% Deterministic Escaping (0% Formula Risk)</span>
      </div>
    </div>
  );
}
