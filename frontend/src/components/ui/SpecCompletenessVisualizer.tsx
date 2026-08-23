"use client";

import React, { useState } from "react";
import { BarChart3, PieChart, Layers } from "lucide-react";

interface SpecStat {
  attribute: string;
  before: number; // percentage
  after: number;  // percentage
  category: string;
}

const SPEC_DATA: SpecStat[] = [
  { attribute: "Manufacturer / Brand", before: 24, after: 98, category: "Core" },
  { attribute: "Material Grade", before: 18, after: 94, category: "Material" },
  { attribute: "Thread Pitch / Size", before: 32, after: 99, category: "Dimensions" },
  { attribute: "UNSPSC Taxonomy Code", before: 0, after: 96, category: "Classification" },
  { attribute: "Operating Voltage / Current", before: 28, after: 95, category: "Electrical" },
  { attribute: "Pressure / Torque Rating", before: 12, after: 91, category: "Mechanical" },
  { attribute: "IP / NEMA Enclosure Rating", before: 8, after: 89, category: "Protection" },
  { attribute: "Standard (DIN/ISO/ANSI)", before: 15, after: 97, category: "Compliance" },
];

export function SpecCompletenessVisualizer() {
  const [activeFilter, setActiveFilter] = useState<"all" | "high-delta">("all");

  const filtered = activeFilter === "high-delta" 
    ? SPEC_DATA.filter(d => (d.after - d.before) >= 70) 
    : SPEC_DATA;

  return (
    <div className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl bg-gradient-to-br from-[#181614]/85 to-[#060c0f]/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>D3 Attribute Density Analyzer</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Catalog Specification Completeness</h3>
          <p className="text-xs text-grey-300">Before (Raw Supplier Feed) vs. After (UniEnrich AI Extraction)</p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === "all"
                ? "bg-white text-black font-semibold shadow-md"
                : "bg-white/[0.05] hover:bg-white/[0.1] text-grey-300 border border-white/10"
            }`}
          >
            All 8 Key Dimensions
          </button>
          <button
            onClick={() => setActiveFilter("high-delta")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === "high-delta"
                ? "bg-white text-black font-semibold shadow-md"
                : "bg-white/[0.05] hover:bg-white/[0.1] text-grey-300 border border-white/10"
            }`}
          >
            Highest Delta (+70%+)
          </button>
        </div>
      </div>

      {/* SVG / CSS Dual Bar Progression Distribution */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const delta = item.after - item.before;
          return (
            <div key={item.attribute} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{item.attribute}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-grey-400">{item.before}% Raw</span>
                  <span className="text-white font-bold">&rarr;</span>
                  <span className="text-green-400 font-bold">{item.after}% Enriched</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 font-semibold">
                    +{delta}%
                  </span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5 flex relative">
                {/* Before bar */}
                <div 
                  className="h-full bg-white/20 rounded-l-full transition-all duration-700" 
                  style={{ width: `${item.before}%` }}
                />
                {/* Delta bar */}
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-r-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${delta}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footnote */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-grey-300">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Calculated across 1,000+ test records with zero manual intervention.</span>
        </div>
        <span className="font-mono text-white font-bold text-xs bg-white/[0.08] px-2.5 py-1 rounded-md border border-white/10">
          Global Quality Score: 96.4%
        </span>
      </div>
    </div>
  );
}
