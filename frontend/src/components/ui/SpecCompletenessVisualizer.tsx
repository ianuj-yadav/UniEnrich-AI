"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

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
    <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 md:p-10 bg-[#ffffff] shadow-[0_8px_32px_rgba(177,133,151,0.06)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8dede] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b18597] uppercase tracking-wider font-mono">
            <BarChart3 className="w-4 h-4 text-[#b18597]" />
            <span>D3 Attribute Density Analyzer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#2b201a] tracking-tight mt-1">
            Catalog Specification Completeness
          </h3>
          <p className="text-xs sm:text-sm text-[#5e4d46] mt-0.5">
            Raw Supplier Feed Baseline vs. Post-Enrichment Master Catalog Coverage
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
            }`}
          >
            All 8 Dimensions
          </button>
          <button
            onClick={() => setActiveFilter("high-delta")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "high-delta"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
            }`}
          >
            Highest Delta (+70%+)
          </button>
        </div>
      </div>

      {/* High-Contrast Progression Distribution */}
      <div className="space-y-5">
        {filtered.map((item) => {
          const delta = item.after - item.before;
          return (
            <div key={item.attribute} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-xs sm:text-sm text-[#2b201a]">
                  {item.attribute}
                </span>
                
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1] text-[11px] font-medium">
                    {item.before}% Raw
                  </span>
                  <span className="text-[#b18597] font-bold">&rarr;</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#fff0f0] text-[#382b22] border border-[#b18597] text-[11px] font-bold">
                    {item.after}% Enriched
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] text-[11px] font-bold">
                    +{delta}% Lift
                  </span>
                </div>
              </div>

              {/* Progress track container */}
              <div className="w-full h-4 bg-[#f3eaed] rounded-full overflow-hidden flex relative border border-[#dfced3] shadow-inner">
                {/* Raw Supplier baseline bar */}
                {item.before > 0 && (
                  <div 
                    style={{ width: `${item.before}%` }}
                    className="bg-[#94a3b8] h-full border-r border-[#64748b]/40 relative"
                    title={`Raw Feed Baseline: ${item.before}%`}
                  />
                )}
                {/* AI Enriched gain delta */}
                <div 
                  style={{ width: `${delta}%` }}
                  className="bg-gradient-to-r from-[#b18597] to-[#8c4b64] h-full"
                  title={`UniEnrich AI Gain: +${delta}%`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Legend Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#e8dede] text-xs text-[#5e4d46] font-mono">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#94a3b8] border border-[#64748b]/40" />
            <span className="font-semibold text-[#475569]">Raw Supplier Feed Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#8c4b64] border border-[#b18597]" />
            <span className="font-bold text-[#382b22]">UniEnrich AI Extraction Lift</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#065f46] font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>Average Catalog Lift: +72.4% Specification Density</span>
        </div>
      </div>
    </div>
  );
}
