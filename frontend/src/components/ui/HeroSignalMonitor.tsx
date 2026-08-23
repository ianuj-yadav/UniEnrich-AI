"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, ArrowRight, RefreshCw, Cpu, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface DemoSKU {
  id: string;
  category: string;
  icon: string;
  raw: string;
  clean: string;
  brand: string;
  score: number;
  specs: { label: string; val: string }[];
  unspsc: string;
}

const DEMO_SKUS: DemoSKU[] = [
  {
    id: "sku-1",
    category: "Fasteners",
    icon: "🔩",
    raw: "HEX BLT 1/2-13x2 SS316 DIN933 PK100",
    clean: 'Hex Head Bolt 1/2"-13 x 2" 316 Stainless Steel (DIN 933)',
    brand: "Fabory (98.4%)",
    score: 98.4,
    specs: [
      { label: "Thread", val: '1/2"-13 UNC' },
      { label: "Material", val: "316 Stainless" },
      { label: "Standard", val: "DIN 933" },
      { label: "Pack", val: "100 Units" },
    ],
    unspsc: "31161620",
  },
  {
    id: "sku-2",
    category: "Bearings",
    icon: "⚙️",
    raw: "BRG BALL DGRV 6205 2RSH C3 SKF 25x52x15",
    clean: "Deep Groove Ball Bearing 6205-2RSH/C3 Rubber Sealed (SKF)",
    brand: "SKF (99.2%)",
    score: 99.2,
    specs: [
      { label: "Bore", val: "25 mm ID" },
      { label: "Outer", val: "52 mm OD" },
      { label: "Clearance", val: "C3 Radial" },
      { label: "Seals", val: "2RSH Contact" },
    ],
    unspsc: "31171504",
  },
  {
    id: "sku-3",
    category: "Valves",
    icon: "🚰",
    raw: "SS-43GS4 SWAGELOK 1/4IN 1-PC BALL VLV PTFE",
    clean: '40G Series 1/4" Ball Valve 316 Stainless Steel PTFE Seats',
    brand: "Swagelok (99.0%)",
    score: 97.8,
    specs: [
      { label: "Inlet", val: '1/4" Fractional' },
      { label: "Body", val: "316 SS" },
      { label: "Pressure", val: "2500 psig" },
      { label: "Seats", val: "PTFE Virgin" },
    ],
    unspsc: "40141607",
  },
  {
    id: "sku-4",
    category: "Electrical",
    icon: "⚡",
    raw: "FLUKE 87-V IND MULTIMETER TRMS 1000V AC/DC",
    clean: "Fluke 87V Industrial True-RMS Digital Multimeter 1000V",
    brand: "Fluke (98.6%)",
    score: 98.9,
    specs: [
      { label: "Rating", val: "CAT IV 600V" },
      { label: "Accuracy", val: "0.05% Basic" },
      { label: "Voltage", val: "1000V AC/DC" },
      { label: "Display", val: "20,000 Counts" },
    ],
    unspsc: "41113608",
  },
];

export function HeroSignalMonitor() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % DEMO_SKUS.length);
        setIsTransitioning(false);
      }, 250);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleSelect = (idx: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsTransitioning(false);
    }, 200);
  };

  const current = DEMO_SKUS[activeIdx];

  return (
    <div className="relative rounded-3xl border-2 border-[#b18597] bg-[#ffffff] p-6 shadow-[0_12px_40px_rgba(177,133,151,0.18)] space-y-4 font-sans select-none overflow-hidden">
      {/* Subtle top blush highlight */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#fff0f0] rounded-full blur-2xl pointer-events-none" />

      {/* Card Header & Live Status */}
      <div className="flex items-center justify-between border-b border-[#e8dede] pb-3.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#fff0f0] border border-[#b18597] flex items-center justify-center text-[#382b22]">
            <Cpu className="w-3.5 h-3.5 text-[#b18597] animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider">
              VANTAGE SIGNAL MONITOR
            </div>
            <div className="text-xs font-bold text-[#2b201a]">Live Extraction Stream</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[10px] font-mono font-bold text-[#065f46]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>REAL-TIME</span>
        </div>
      </div>

      {/* Domain Category Selector Tabs */}
      <div className="grid grid-cols-4 gap-1.5 relative z-10">
        {DEMO_SKUS.map((sku, idx) => (
          <button
            key={sku.id}
            onClick={() => handleSelect(idx)}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeIdx === idx
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold scale-[1.02]"
                : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
            }`}
          >
            <span>{sku.icon}</span>
            <span className="hidden sm:inline">{sku.category}</span>
          </button>
        ))}
      </div>

      {/* Active Transformation Display */}
      <div className={`space-y-3 transition-opacity duration-300 relative z-10 ${isTransitioning ? "opacity-30" : "opacity-100"}`}>
        {/* Raw Feed Input Chip */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8c7770] uppercase font-bold">
            <span>Raw Supplier Feed</span>
            <span className="text-[#991b1b]">Noisy Acronyms</span>
          </div>
          <div className="p-2.5 rounded-xl border border-[#e8dede] bg-[#faf6f6] font-mono text-[11px] text-[#5e4d46] truncate">
            {current.raw}
          </div>
        </div>

        {/* Standardized Master Output Chip */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8c7770] uppercase font-bold">
            <span>Standardized Master Record</span>
            <span className="text-[#065f46]">Certified</span>
          </div>
          <div className="p-3 rounded-xl border-2 border-[#b18597] bg-[#fff0f0] text-xs font-bold text-[#2b201a] leading-snug shadow-sm">
            {current.clean}
          </div>
        </div>

        {/* 4 Extracted Specs Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {current.specs.map((spec) => (
            <div
              key={spec.label}
              className="p-2 rounded-lg border border-[#e8dede] bg-[#ffffff] flex items-center justify-between text-[10px] shadow-2xs"
            >
              <span className="text-[#8c7770] font-mono font-semibold uppercase">{spec.label}</span>
              <span className="font-mono font-bold text-[#065f46]">{spec.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Metrics & Confidence Gate */}
      <div className="pt-3 border-t border-[#e8dede] flex items-center justify-between text-[11px] font-mono relative z-10">
        <div className="flex items-center gap-1.5 text-[#5e4d46]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#065f46]" />
          <span>Brand: <strong>{current.brand}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#065f46] font-bold">
            <AnimatedCounter value={current.score} decimals={1} suffix="%" />
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#fff0f0] text-[#703d52] border border-[#f9c4d2] text-[10px] font-bold">
            PASS
          </span>
        </div>
      </div>
    </div>
  );
}
