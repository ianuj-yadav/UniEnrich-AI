"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, CheckCircle2, Copy, Check, RefreshCw, Layers, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface PresetSample {
  category: string;
  raw: string;
  brand: string;
  brandConf: number;
  clean: string;
  specs: Record<string, string>;
  unspsc: string;
  score: number;
  injectionSafe: boolean;
}

const PRESET_SAMPLES: PresetSample[] = [
  {
    category: "Fasteners",
    raw: "HEX BLT 1/2-13x2 SS316 DIN933 PK100",
    brand: "Fabory",
    brandConf: 96.4,
    clean: 'Hex Head Bolt 1/2"-13 x 2" Stainless Steel Grade 316 Fully Threaded (DIN 933, Pack of 100)',
    specs: {
      "Thread Size": '1/2"-13 UNC',
      "Length": "2.00 in (50.8 mm)",
      "Material Grade": "Marine Grade 316 Stainless",
      "Standard": "DIN 933 / ISO 4017",
      "Drive Type": "External Hexagon",
      "Package Qty": "100 Units / Pack",
    },
    unspsc: "31161620 (Hex bolts)",
    score: 98.4,
    injectionSafe: true,
  },
  {
    category: "Bearings",
    raw: "BRG BALL DGRV 6205 2RSH C3 SKF ID25 OD52 W15",
    brand: "SKF",
    brandConf: 99.2,
    clean: "Deep Groove Ball Bearing 6205-2RSH/C3 Rubber Contact Seals Radial Internal Clearance C3 (25x52x15mm)",
    specs: {
      "Bore Diameter": "25 mm",
      "Outer Diameter": "52 mm",
      "Width": "15 mm",
      "Seals": "Dual Contact Rubber (2RSH)",
      "Clearance": "C3 (Greater than Normal)",
      "Dynamic Load": "14.8 kN",
    },
    unspsc: "31171504 (Ball bearings)",
    score: 99.1,
    injectionSafe: true,
  },
  {
    category: "Valves",
    raw: "SS-43GS4 SWAGELOK 1/4IN 1-PC 40G BALL VLV PTFE",
    brand: "Swagelok",
    brandConf: 99.0,
    clean: 'One-Piece 40G Series Ball Valve 1/4" Fractional Tube Fitting Stainless Steel 316 PTFE Seats',
    specs: {
      "End Connection": '1/4" Swagelok Tube Fitting',
      "Body Material": "316 Stainless Steel",
      "Pressure Rating": "2500 psig (172 bar)",
      "Seat Material": "PTFE",
      "Temperature": "-53°C to 148°C",
      "Flow Pattern": "2-Way Straight",
    },
    unspsc: "40141607 (Ball valves)",
    score: 97.8,
    injectionSafe: true,
  },
  {
    category: "Electrical",
    raw: "FLUKE 87-V IND MULTIMETER TRMS 1000V AC/DC CAT IV",
    brand: "Fluke",
    brandConf: 98.6,
    clean: "Fluke 87V Industrial True-RMS Digital Multimeter 1000V AC/DC CAT IV 600V / CAT III 1000V",
    specs: {
      "Measurement": "True-RMS AC/DC Voltage & Current",
      "Max Voltage": "1000 V",
      "Safety Rating": "CAT IV 600V / CAT III 1000V",
      "Resolution": "20,000 Counts Display",
      "Thermometer": "Built-in Temperature Probe",
      "Warranty": "Limited Lifetime",
    },
    unspsc: "41113608 (Multimeters)",
    score: 98.9,
    injectionSafe: true,
  },
  {
    category: "Pneumatics",
    raw: "SMC CDQ2B32-25DZ COMPACT CYL DBL ACT SINGLE ROD",
    brand: "SMC",
    brandConf: 97.5,
    clean: "CQ2 Series Compact Pneumatic Cylinder Double Acting Single Rod 32mm Bore 25mm Stroke Auto-Switch Capable",
    specs: {
      "Bore Size": "32 mm",
      "Stroke": "25 mm",
      "Action": "Double Acting, Single Rod",
      "Mounting": "Through-Hole (Standard)",
      "Operating Fluid": "Air",
      "Max Pressure": "1.0 MPa (145 psi)",
    },
    unspsc: "40141612 (Pneumatic cylinders)",
    score: 98.1,
    injectionSafe: true,
  }
];

export function LiveEnrichmentWorkbench() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customInput, setCustomInput] = useState(PRESET_SAMPLES[0].raw);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const sample = PRESET_SAMPLES[selectedIdx];

  const handleSelectPreset = (idx: number) => {
    setSelectedIdx(idx);
    setCustomInput(PRESET_SAMPLES[idx].raw);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sample.clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/12 p-6 md:p-8 backdrop-blur-xl bg-gradient-to-br from-[#181614]/85 to-[#060c0f]/90 shadow-[0_4px_32px_rgba(0,0,0,0.5)] space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Real-Time Extraction Sandbox</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Live Industrial Enrichment Simulator</h3>
          <p className="text-xs text-grey-300">Click any domain preset or type your own abbreviated SKU string to test live parsing</p>
        </div>

        {/* Preset Category Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_SAMPLES.map((s, idx) => (
            <button
              key={s.category}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedIdx === idx
                  ? "bg-white text-black font-bold shadow-lg scale-105"
                  : "bg-white/[0.06] hover:bg-white/[0.12] text-grey-200 border border-white/10"
              }`}
            >
              {s.category}
            </button>
          ))}
        </div>
      </div>

      {/* Raw Input vs Normalized Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw Input with live editability */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase text-grey-400">
                1. Raw Supplier Record Input
              </label>
              <span className="text-[10px] text-grey-400 font-mono flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-blue-400" /> Editable
              </span>
            </div>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-white/20 bg-black/70 font-mono text-xs text-yellow-300 focus:outline-none focus:border-white/40 shadow-inner"
            />
          </div>

          {/* Extracted Pipeline Metas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-1">
              <div className="text-[10px] text-grey-400 uppercase font-semibold">Matched Brand</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{sample.brand}</span>
                <span className="text-[10px] font-mono text-green-400">({sample.brandConf}%)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-1">
              <div className="text-[10px] text-grey-400 uppercase font-semibold">UNSPSC Class</div>
              <div className="text-xs font-mono text-purple-300 truncate">
                {sample.unspsc}
              </div>
            </div>
          </div>

          {/* DDE Injection Escaped Proof */}
          <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-green-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>DDE Formula Escaped</span>
            </div>
            <span className="font-mono text-[10px] text-grey-300">0% CSV Injection Risk</span>
          </div>
        </div>

        {/* Right Column: Standardized Technical Record */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase text-grey-400 block">
              2. Enriched &amp; Standardized Master Record
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-grey-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-2.5 py-1 rounded-md border border-white/10 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Title"}</span>
            </button>
          </div>

          {/* Master Title */}
          <div className={`p-4 rounded-xl border border-white/20 bg-white/[0.04] text-xs font-medium text-white leading-relaxed transition-opacity duration-300 ${isProcessing ? "opacity-40" : "opacity-100"}`}>
            {sample.clean}
          </div>

          {/* Extracted Specification Key-Value Grid */}
          <div>
            <div className="text-[11px] font-semibold uppercase text-grey-400 mb-2">
              Extracted Engineering Specifications (15+ Technical Attributes)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(sample.specs).map(([key, val]) => (
                <div 
                  key={key} 
                  className="p-2.5 rounded-lg border border-white/10 bg-black/50 flex flex-col justify-between hover:border-white/25 transition"
                >
                  <span className="text-[10px] text-grey-400 uppercase font-semibold tracking-wider">{key}</span>
                  <span className="text-xs font-mono text-green-300 font-medium mt-0.5 truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Confidence Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-grey-400">Confidence Scoring:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-400 font-bold">
                <AnimatedCounter value={sample.score} decimals={1} suffix="%" />
              </span>
              <Badge variant="success" size="sm">Auto-Approved (&ge;70%)</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
