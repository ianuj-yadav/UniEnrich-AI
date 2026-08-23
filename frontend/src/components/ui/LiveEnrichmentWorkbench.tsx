"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, CheckCircle2, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const PRESET_SAMPLES = [
  {
    category: "Fasteners",
    raw: "HEX BLT 1/2-13x2 SS316 DIN933 PK100",
    brand: "Fabory",
    brandConf: 96,
    clean: "Hex Head Bolt 1/2\"-13 x 2\" Stainless Steel Grade 316 Fully Threaded (DIN 933, Pack of 100)",
    specs: {
      "Thread Size": '1/2"-13 UNC',
      "Length": '2.00 in',
      "Material": "Stainless Steel Grade 316 (Marine)",
      "Standard": "DIN 933 / ISO 4017",
      "Drive Type": "External Hex",
      "Packaging": "100 Units / Pack"
    },
    unspsc: "31161620 (Hex bolts)",
    score: 98.4,
    injectionSafe: true,
  },
  {
    category: "Bearings",
    raw: "BRG BALL DGRV 6205 2RSH C3 SKF ID25 OD52 W15",
    brand: "SKF",
    brandConf: 99,
    clean: "Deep Groove Ball Bearing 6205-2RSH/C3 Rubber Contact Seals Radial Internal Clearance C3 (25x52x15mm)",
    specs: {
      "Bore Diameter": "25 mm",
      "Outer Diameter": "52 mm",
      "Width": "15 mm",
      "Seals": "Dual Contact Rubber (2RSH)",
      "Clearance": "C3 (Greater than Normal)",
      "Dynamic Load": "14.8 kN"
    },
    unspsc: "31171504 (Ball bearings)",
    score: 99.1,
    injectionSafe: true,
  },
  {
    category: "Valves",
    raw: "SS-43GS4 SWAGELOK 1/4IN 1-PC 40G BALL VLV PTFE",
    brand: "Swagelok",
    brandConf: 99,
    clean: "One-Piece 40G Series Ball Valve 1/4\" Fractional Tube Fitting Stainless Steel 316 PTFE Seats",
    specs: {
      "End Connection": '1/4" Swagelok Tube Fitting',
      "Body Material": "316 Stainless Steel",
      "Pressure Rating": "2500 psig (172 bar)",
      "Seat Material": "PTFE",
      "Temperature": "-53°C to 148°C",
      "Flow Pattern": "2-Way Straight"
    },
    unspsc: "40141607 (Ball valves)",
    score: 97.8,
    injectionSafe: true,
  },
  {
    category: "Electrical",
    raw: "FLUKE 87-V IND MULTIMETER TRMS 1000V AC/DC CAT IV",
    brand: "Fluke",
    brandConf: 98,
    clean: "Fluke 87V Industrial True-RMS Digital Multimeter 1000V AC/DC CAT IV 600V / CAT III 1000V",
    specs: {
      "Measurement": "True-RMS AC/DC Voltage & Current",
      "Max Voltage": "1000 V",
      "Safety Rating": "CAT IV 600V / CAT III 1000V",
      "Resolution": "20,000 Counts Display",
      "Thermometer": "Built-in Temperature Function",
      "Warranty": "Lifetime"
    },
    unspsc: "41113608 (Multimeters)",
    score: 98.9,
    injectionSafe: true,
  },
];

export function LiveEnrichmentWorkbench() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const sample = PRESET_SAMPLES[selectedIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(sample.clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl bg-gradient-to-br from-[#181614]/85 to-[#060c0f]/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Real-Time Extraction Workbench</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Live Industrial Enrichment Simulator</h3>
        </div>

        {/* Preset Category Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_SAMPLES.map((s, idx) => (
            <button
              key={s.category}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedIdx === idx
                  ? "bg-white text-black font-semibold shadow-md scale-105"
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
        {/* Left Column: Raw Supplier Feed Input */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase text-grey-400 block mb-1.5">
              1. Raw Supplier Record Input
            </label>
            <div className="p-3.5 rounded-xl border border-white/15 bg-black/60 font-mono text-xs text-yellow-300 break-all select-all shadow-inner">
              {sample.raw}
            </div>
          </div>

          {/* Extracted Pipeline Metas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-grey-400 uppercase font-semibold">Matched Brand</div>
              <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span>{sample.brand}</span>
                <span className="text-[10px] font-mono text-green-400">({sample.brandConf}%)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-grey-400 uppercase font-semibold">UNSPSC Class</div>
              <div className="text-xs font-mono text-purple-300 mt-0.5 truncate">
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
            <span className="font-mono text-[10px] text-grey-300">0% CSV Risk</span>
          </div>
        </div>

        {/* Right Column: Standardized Technical Record */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase text-grey-400 block">
              2. Enriched & Standardized Master Record
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-grey-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-2.5 py-1 rounded-md border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Title"}</span>
            </button>
          </div>

          {/* Master Title */}
          <div className="p-3.5 rounded-xl border border-white/20 bg-white/[0.04] text-xs font-medium text-white leading-relaxed">
            {sample.clean}
          </div>

          {/* Extracted Specification Key-Value Grid */}
          <div>
            <div className="text-[11px] font-semibold uppercase text-grey-400 mb-2">
              Extracted Engineering Specifications (15+ Fields)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(sample.specs).map(([key, val]) => (
                <div 
                  key={key} 
                  className="p-2.5 rounded-lg border border-white/10 bg-black/40 flex flex-col justify-between"
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
              <span className="font-mono text-green-400 font-bold">{sample.score}%</span>
              <Badge variant="success" size="sm">Auto-Approved (&ge;70%)</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
