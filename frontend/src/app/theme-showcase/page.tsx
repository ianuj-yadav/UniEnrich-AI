"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Palette, 
  Check, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Sliders, 
  Eye, 
  Download, 
  Copy, 
  CheckCircle2,
  ShieldCheck,
  Zap,
  Box,
  Compass,
  Cpu,
  Bookmark
} from "lucide-react";
import { useTheme, THEME_CONFIGS, ThemeStyle, ThemeConfig } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Hero3DLogo } from "@/components/ui/Hero3DLogo";

export default function ThemeShowcasePage() {
  const { theme, setTheme } = useTheme();
  const [selectedPreviewTab, setSelectedPreviewTab] = useState<ThemeStyle>(theme);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const activeConfig = THEME_CONFIGS[selectedPreviewTab] || THEME_CONFIGS.vantage;

  const handleSetGlobalTheme = (tId: ThemeStyle) => {
    setTheme(tId);
    setSelectedPreviewTab(tId);
    setSavedSuccess(`Theme "${THEME_CONFIGS[tId].name}" applied across the entire website.`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleCopyJson = (config: ThemeConfig) => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedToken(config.id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-current/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Design Studio</Badge>
            <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">
              Interactive Multi-Theme Architecture
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Design Systems &amp; Visual Archetype Gallery
          </h1>
          <p className="text-xs sm:text-sm opacity-80 max-w-2xl leading-relaxed">
            Test 5 curated industrial design directions in real time. Switch themes instantly to preview how typography, 3D emblems, buttons, and catalog matrices adapt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSetGlobalTheme(selectedPreviewTab)}
            className="px-5 py-2.5 rounded-2xl bg-[#2b201a] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Set "{activeConfig.name}" as Site Default</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* 5 Theme Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.values(THEME_CONFIGS).map((t) => {
          const isSelected = t.id === selectedPreviewTab;
          const isGlobal = t.id === theme;

          return (
            <button
              key={t.id}
              onClick={() => setSelectedPreviewTab(t.id)}
              className={`p-4 rounded-3xl border-2 text-left transition-all relative flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? "ring-2 scale-[1.02] shadow-xl"
                  : "opacity-75 hover:opacity-100 hover:scale-[1.01]"
              }`}
              style={{
                backgroundColor: t.colors.surface,
                color: t.colors.textPrimary,
                borderColor: isSelected ? t.colors.borderHover : t.colors.border,
                outlineColor: t.colors.borderHover,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.icon}</span>
                {isGlobal && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                    Active
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase opacity-60 block">{t.tag}</span>
                <h3 className="font-bold text-sm tracking-tight">{t.name}</h3>
                <p className="text-[11px] opacity-70 mt-0.5 line-clamp-1">{t.subtitle}</p>
              </div>

              {/* Color Swatch Dots */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-current/10">
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.background }} title="Background" />
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.surface }} title="Surface" />
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.accent }} title="Accent" />
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.textPrimary }} title="Text" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Live Interactive Sandbox for Selected Theme */}
      <div 
        className="rounded-3xl border-2 p-6 sm:p-10 space-y-10 shadow-2xl transition-all"
        style={{
          backgroundColor: activeConfig.colors.background,
          borderColor: activeConfig.colors.border,
          color: activeConfig.colors.textPrimary,
          fontFamily: activeConfig.typography.fontFamily,
        }}
      >
        {/* Sandbox Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeConfig.icon}</span>
              <h2 className="text-2xl font-extrabold tracking-tight">{activeConfig.name} Showcase Sandbox</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-current/20">
                {activeConfig.tag}
              </span>
            </div>
            <p className="text-xs opacity-75">{activeConfig.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyJson(activeConfig)}
              className="px-3.5 py-1.5 rounded-xl border border-current/20 text-xs font-mono font-semibold hover:bg-current/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedToken === activeConfig.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken === activeConfig.id ? "Copied JSON" : "Copy Design Tokens"}</span>
            </button>
            <button
              onClick={() => handleSetGlobalTheme(activeConfig.id)}
              className="px-4 py-1.5 rounded-xl bg-current text-white text-xs font-mono font-bold uppercase transition hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: activeConfig.colors.accent,
                color: activeConfig.id === "brutalist" ? "#000" : "#fff",
              }}
            >
              Apply Theme
            </button>
          </div>
        </div>

        {/* 1. Live Hero Mockup */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 block">
            1. Hero Section &amp; 3D Emblem Interaction
          </span>

          <div 
            className={`p-6 sm:p-8 rounded-3xl border-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${activeConfig.cardClass}`}
            style={{
              backgroundColor: activeConfig.colors.surface,
              borderColor: activeConfig.colors.border,
            }}
          >
            <div className="lg:col-span-7 space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold ${activeConfig.badgeClass}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>VANTAGE 2.5 • AI INDUSTRIAL ENRICHMENT</span>
              </div>

              <h3 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${activeConfig.typography.headingStyle}`}>
                Stop Digging Through Dashboards.
              </h3>

              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-lg">
                Your catalog metrics are scattered across a dozen supplier feeds. Vantage standardizes messy abbreviations into one certified master record.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className={`px-5 py-3 text-xs font-bold uppercase cursor-pointer ${activeConfig.buttonClass}`}>
                  Get Started Now &rarr;
                </button>
                <button className="px-5 py-3 text-xs font-mono font-bold uppercase rounded-xl border border-current/20 hover:bg-current/5 transition cursor-pointer">
                  Upload Supplier Feed
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono opacity-80">
                <span className="px-2 py-0.5 rounded border border-current/20">✓ RapidFuzz (98.4%)</span>
                <span className="px-2 py-0.5 rounded border border-current/20">✓ Gemini Spec AI</span>
                <span className="px-2 py-0.5 rounded border border-current/20">✓ UNSPSC 31161620</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border border-current/10 rounded-2xl bg-current/[0.02]">
              <Hero3DLogo />
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 mt-2">
                Interactive 3D WebGL Vector Core (360° Drag Orbit)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Interactive Button & Tag Playground */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 block">
            2. Button Physics &amp; Badge System
          </span>

          <div 
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${activeConfig.cardClass}`}
            style={{
              backgroundColor: activeConfig.colors.surface,
              borderColor: activeConfig.colors.border,
            }}
          >
            <div>
              <span className="text-xs font-bold font-mono opacity-70 block mb-3">TACTILE BUTTON STYLES:</span>
              <div className="flex flex-wrap items-center gap-3">
                <button className={`px-5 py-2.5 text-xs font-bold uppercase ${activeConfig.buttonClass}`}>
                  Primary Action
                </button>
                <button className="px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl border-2 border-current/30 hover:bg-current/5 transition">
                  Secondary Action
                </button>
                <button className="px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 transition">
                  ✓ Verified Approval
                </button>
                <button className="px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20 transition">
                  ✕ Reject SKU
                </button>
              </div>
            </div>

            <div className="border-t border-current/10 pt-4">
              <span className="text-xs font-bold font-mono opacity-70 block mb-3">DATA CONFIDENCE PILLS:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-mono font-bold ${activeConfig.badgeClass}`}>
                  ● 98% High Confidence
                </span>
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30">
                  ● 76% Pass Threshold
                </span>
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                  ● 54% Needs Review
                </span>
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/30">
                  UNSPSC: 31161620
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Data Table & Comparison Matrix */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 block">
            3. Master Catalog Matrix &amp; Table Density
          </span>

          <div 
            className={`rounded-3xl border-2 overflow-hidden ${activeConfig.cardClass}`}
            style={{
              backgroundColor: activeConfig.colors.surface,
              borderColor: activeConfig.colors.border,
            }}
          >
            <table className="w-full text-left text-xs">
              <thead className="border-b border-current/10 bg-current/[0.03] uppercase font-mono font-bold text-[10px] opacity-70">
                <tr>
                  <th className="py-3 px-4">Canonical SKU</th>
                  <th className="py-3 px-4">Raw Supplier Feed</th>
                  <th className="py-3 px-4">AI Standardized Record</th>
                  <th className="py-3 px-4">Extracted Attributes</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10">
                {[
                  {
                    sku: "SKU-10492-SS",
                    raw: "3/4 CPLG BRS 150# THD NIBCO PK50",
                    standard: 'NIBCO 3/4" Brass Coupling 150 PSI Threaded (Pack of 50)',
                    attrs: { Material: "Brass", Size: '3/4"', Pressure: "150 PSI" },
                    score: "98%",
                    badge: "green" as const,
                  },
                  {
                    sku: "SKU-20841-HYD",
                    raw: "FAB-SS-1/2-HEX-BLT 316 UNC DIN933",
                    standard: "Fabory Grade 316 Stainless Steel Hex Head Bolt 1/2-13 UNC x 2.00in",
                    attrs: { Material: "316 SS", Pitch: "1/2-13 UNC", Standard: "DIN 933" },
                    score: "96%",
                    badge: "green" as const,
                  },
                  {
                    sku: "SKU-30914-VLV",
                    raw: "SWAG-BALL-VLV-1/4-SS-1000PSI",
                    standard: "Swagelok 1/4in Stainless Steel Ball Valve 1000 PSI",
                    attrs: { Material: "SS", Port: '1/4"', Pressure: "1000 PSI" },
                    score: "99%",
                    badge: "green" as const,
                  },
                ].map((row) => (
                  <tr key={row.sku} className="hover:bg-current/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{row.sku}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-mono text-[11px] opacity-75">{row.raw}</td>
                    <td className="py-3.5 px-4 font-semibold">{row.standard}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(row.attrs).map(([k, v]) => (
                          <span key={k} className="px-1.5 py-0.5 rounded border border-current/15 text-[10px] font-mono">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{row.score}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className={`px-3 py-1 text-[11px] font-bold uppercase cursor-pointer ${activeConfig.buttonClass}`}>
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
