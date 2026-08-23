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
    <div className="rounded-3xl border-2 border-[#e8dede] p-6 md:p-8 bg-[#ffffff] shadow-[0_4px_24px_rgba(177,133,151,0.06)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8dede] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#b18597] uppercase tracking-wider font-mono">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>D3 Attribute Density Analyzer</span>
          </div>
          <h3 className="text-lg font-bold text-[#2b201a] mt-1">Catalog Specification Completeness</h3>
          <p className="text-xs text-[#5e4d46]">Before (Raw Supplier Feed) vs. After (UniEnrich AI Extraction)</p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
            }`}
          >
            All 8 Dimensions
          </button>
          <button
            onClick={() => setActiveFilter("high-delta")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "high-delta"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
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
                <span className="font-bold text-[#2b201a]">{item.attribute}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#8c7770] font-medium">{item.before}% Raw</span>
                  <span className="text-[#b18597] font-bold">&rarr;</span>
                  <span className="text-[#065f46] font-bold">{item.after}% Enriched</span>
                  <span className="text-[10px] text-[#065f46] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-md font-bold">
                    +{delta}%
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-3.5 bg-[#f5eff1] rounded-full overflow-hidden flex relative border border-[#e0d0d5]">
                {/* Raw Supplier baseline bar */}
                <div 
                  style={{ width: `${item.before}%` }}
                  className="bg-[#d4c3c9] h-full"
                  title={`Raw Baseline: ${item.before}%`}
                />
                {/* AI Enriched gain delta */}
                <div 
                  style={{ width: `${delta}%` }}
                  className="bg-[#b18597] h-full"
                  title={`AI Enrichment Gain: +${delta}%`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Legend Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#e8dede] text-[11px] text-[#7a6860] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#d4c3c9]" />
            <span>Raw Feed Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#b18597]" />
            <span className="text-[#382b22] font-bold">UniEnrich Attribute AI Gain</span>
          </div>
        </div>
        <span className="font-bold text-[#065f46]">Avg Delta: +72.4% Attribute Coverage</span>
      </div>
    </div>
  );
}
