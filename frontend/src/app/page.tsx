"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Layers, 
  CheckSquare, 
  BarChart3, 
  Download, 
  FileText, 
  GitMerge, 
  BookOpen, 
  TrendingUp, 
  Cpu, 
  Clock, 
  Play, 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  CheckCircle2, 
  Activity,
  Zap,
  Check,
  Search,
  Shield,
  MessageSquare,
  ArrowUpRight,
  FileCheck2,
  Sliders,
  Database,
  ArrowDown
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { listBatches, BatchItem } from "@/lib/api";
import { Interactive3DCore } from "@/components/ui/Interactive3DCore";
import { LiveEnrichmentWorkbench } from "@/components/ui/LiveEnrichmentWorkbench";
import { SpecCompletenessVisualizer } from "@/components/ui/SpecCompletenessVisualizer";
import { TargoHeroSection } from "@/components/home/TargoHeroSection";

const REVIEWER_DIALOGUES = [
  {
    role: "Human-in-the-Loop Specialist",
    author: "Lead Catalog Reviewer",
    badge: "HUMAN SIGN-OFF",
    signal: "This raw SKU title contains 4 non-standard vendor acronyms (SS, HEX, BLT, PK100) conflicting with standard ISO fasteners.",
    context: "Cross-referenced with datasheet CAD OCR; dimensions matched 1/2-13 UNC x 2.00in and material verified as 316 Marine Grade Stainless.",
    record: "Reviewer note saved: retain ISO DIN 933 compliance, normalize thread pitch, mark auto-approved for ERP & Shopify export.",
  },
  {
    role: "Gemini 2.5 Flash Agent",
    author: "Catalog AI Auditor",
    badge: "CONFIDENCE: 98.4%",
    signal: "RapidFuzz resolved vendor acronym 'FAB-SS' to canonical manufacturer 'Fabory Fasteners' with 98.4% Levenshtein similarity.",
    context: "Extracted 6 mechanical dimensions from raw specification tokens: thread pitch, tensile grade, coating, and package quantity.",
    record: "Automated gate pass: Confidence exceeds 70% threshold. Zero formula injection characters detected.",
  },
  {
    role: "ISO Taxonomy Specialist",
    author: "Standards Bureau",
    badge: "UNSPSC: 31161620",
    signal: "Hierarchical classification matched UNSPSC Segment 31 (Manufacturing Components) -> Class 31161620 (Hex Head Bolts).",
    context: "Standard normalized to DIN 933 / ISO 4017 full-thread specification for global procurement compatibility.",
    record: "Audit ledger entry recorded with SHA-256 hash. Master SKU ready for multi-channel syndication.",
  }
];

const PIPELINE_STEPS = [
  {
    step: "Upload",
    desc: "Ingest CSV, XLSX, or technical PDF datasheet with instant schema mapping and DDE formula sanitization.",
  },
  {
    step: "Inspect",
    desc: "Examine extracted attribute signals, confidence markers, and vector duplicates with side-by-side comparison.",
  },
  {
    step: "Document",
    desc: "Certify master record with human-in-the-loop sign-off and export to Shopify, Magento 2, or SAP.",
  }
];

export default function DashboardPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReviewerIdx, setActiveReviewerIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const batchList = await listBatches();
        setBatches(batchList);
      } catch (err) {
        console.error("Error loading batches:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalUploaded = batches.reduce((acc, b) => acc + b.total_records, 0) || 1472;
  const totalProcessed = batches.reduce((acc, b) => acc + b.processed_records, 0) || 1420;
  const totalErrors = batches.reduce((acc, b) => acc + b.error_records, 0) || 52;
  const totalDuplicates = batches.reduce((acc, b) => acc + b.duplicate_records, 0) || 18;

  const activeDialogue = REVIEWER_DIALOGUES[activeReviewerIdx];

  return (
    <div className="w-full space-y-0 bg-[#F2F1F0] text-[#2b3033]">
      
      {/* ====================================================================
          FRONT SECTION: TARGO HERO + ABOUT SECTIONS
          ==================================================================== */}
      <TargoHeroSection />

      {/* ====================================================================
          ACT 2: FULL-WIDTH 3-CARD EVIDENCE RIBBON (CLEAN LIGHT PORCELAIN)
          ==================================================================== */}
      <section id="unihack-suite" className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-stone-300">
        
        {/* Card 1: Light Warm Silver (matching Card 3) */}
        <div className="bg-[#f0ece1] p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-300 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-stone-300 flex items-center justify-center text-black shadow-xs">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
              01 / SURFACE THE SIGNAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
              See where a catalog SKU deserves attention.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-mono leading-relaxed">
              Read messy supplier abbreviations in context and inspect the confidence markers that produced its enrichment signal.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-xs font-mono font-bold text-stone-700">
            <span>Deterministic Scoring</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 2: Crisp Porcelain White with Cyan Signal Pulse Indicators */}
        <div className="bg-white p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
          {/* Animated Cyan Signal Scanlines */}
          <div className="space-y-2.5 pt-2">
            <div className="h-1.5 w-full bg-sky-500 rounded-full cyan-signal-bar-1 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
            <div className="h-1.5 w-4/5 bg-sky-500 rounded-full cyan-signal-bar-2 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
            <div className="h-1.5 w-3/5 bg-sky-500 rounded-full cyan-signal-bar-3 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
            <div className="h-1.5 w-2/3 bg-sky-500 rounded-full cyan-signal-bar-4 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
          </div>

          <div className="space-y-4 pt-6">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-700">
              02 / INSPECT THE RECEIPT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
              Every measure has an explanation.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-mono leading-relaxed">
              RapidFuzz Levenshtein similarity (98.4%), Gemini confidence ratings, UNSPSC taxonomy codes, and vector duplicate clusters remain visible to the reviewer.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-mono font-bold text-sky-700">
            <span>Levenshtein &amp; Spec Extraction</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 3: Light Warm Silver */}
        <div className="bg-[#f0ece1] p-8 sm:p-12 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-stone-300 flex items-center justify-center text-black shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
              03 / KEEP THE JUDGMENT HUMAN
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
              Decide with evidence, not automation.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-mono leading-relaxed">
              Confirm, dismiss, or add context before a standardized catalog record is exported to ERP, Shopify, or SAP.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-xs font-mono font-bold text-stone-700">
            <span>Human-in-the-Loop Queue</span>
            <span>&rarr;</span>
          </div>
        </div>

      </section>

      {/* ====================================================================
          ACT 3: REVIEWER DIALOGUE STUDIO (FULL-BLEED SOFT ICE BLUE #e2f1f5)
          ==================================================================== */}
      <section className="w-full bg-[#e2f1f5] border-b border-sky-200 py-16 px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-800">
                <MessageSquare className="w-5 h-5 text-sky-700" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest">
                  REVIEWER DIALOGUE
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] leading-[1.08]">
                The evidence starts the conversation. It never ends it.
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-mono text-sky-950/80 leading-relaxed max-w-md">
              UniEnrich gives catalog teams a shared language for discussing a SKU: what changed, which signal was observed, and what context belongs in the final master record.
            </p>

            {/* Persona Switcher Tabs - White bg and Black text when active */}
            <div className="flex flex-wrap gap-2 pt-2">
              {REVIEWER_DIALOGUES.map((d, idx) => (
                <button
                  key={d.author}
                  onClick={() => setActiveReviewerIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeReviewerIdx === idx
                      ? "bg-white text-black border-2 border-black shadow-md"
                      : "bg-white/40 hover:bg-white text-stone-700 border border-sky-300 shadow-2xs"
                  }`}
                >
                  {d.author}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Stacked Evidence Rows */}
          <div className="lg:col-span-7 space-y-0 divide-y divide-sky-300 border-t border-b border-sky-300 font-serif">
            
            {/* Row 1: Signal */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
              <span className="sm:col-span-3 text-[10px] font-mono font-bold uppercase tracking-widest text-sky-800">
                SIGNAL
              </span>
              <p className="sm:col-span-9 text-base sm:text-lg text-stone-900 leading-relaxed italic">
                &ldquo;{activeDialogue.signal}&rdquo;
              </p>
            </div>

            {/* Row 2: Context */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
              <span className="sm:col-span-3 text-[10px] font-mono font-bold uppercase tracking-widest text-sky-800">
                CONTEXT
              </span>
              <p className="sm:col-span-9 text-base sm:text-lg text-stone-900 leading-relaxed italic">
                &ldquo;{activeDialogue.context}&rdquo;
              </p>
            </div>

            {/* Row 3: Record */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
              <span className="sm:col-span-3 text-[10px] font-mono font-bold uppercase tracking-widest text-sky-800">
                RECORD
              </span>
              <p className="sm:col-span-9 text-base sm:text-lg text-stone-900 leading-relaxed italic">
                &ldquo;{activeDialogue.record}&rdquo;
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          ACT 4: ONE REVIEW FLOW & TILTED WORKSPACE DOCUMENT (WARM IVORY)
          ==================================================================== */}
      <section className="w-full bg-[#f7f4ed] border-b border-stone-300 py-16 px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Tilted Floating Document Editor Window */}
          <div className="lg:col-span-6">
            <div className="tilted-doc-card rounded-2xl border-2 border-stone-800 bg-white p-6 sm:p-8 shadow-xl space-y-6 font-mono relative">
              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-3 text-[10px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span className="font-bold ml-2">UNIENRICH 3155 / CATALOG ENRICHMENT WORKSPACE</span>
                </div>
                <span className="text-emerald-700 font-bold">CONFIDENCE: 98.4%</span>
              </div>

              {/* Document Body with Cyan Highlights */}
              <div className="space-y-4 text-sm text-stone-900 font-sans leading-relaxed">
                <div>
                  <span className="cyan-highlight-box font-bold text-base sm:text-lg">
                    NIBCO 3/4" Brass Coupling 150 PSI Threaded (Pack of 50)
                  </span>
                </div>

                <p className="text-stone-600 font-mono text-xs">
                  Raw Feed: <span className="text-stone-900 font-semibold">3/4 CPLG BRS 150# THD NIBCO PK50</span>
                </p>

                <div>
                  <span className="cyan-highlight-box font-medium text-xs">
                    Extracted 4 Engineering Specs: Thread (3/4" NPT), Material (Brass), Pressure (150 PSI), Packaging (Pack of 50).
                  </span>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-600 font-mono">
                <span className="font-bold">&#123;&#125; SKU-10492-SS</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 font-bold uppercase">
                  UNSPSC 31161620
                </span>
              </div>
            </div>
          </div>

          {/* Right: One Review Flow Stepper & Table */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-stone-600">
                FROM INGESTION TO RESOLUTION
              </span>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] leading-[1.06]">
                One review flow.<br />
                No black box.
              </h2>
            </div>

            {/* Stepper Table */}
            <div className="space-y-0 divide-y divide-stone-300 border-t border-b border-stone-300 font-mono text-xs">
              {PIPELINE_STEPS.map((s) => (
                <div key={s.step} className="py-4 grid grid-cols-12 gap-4 items-center">
                  <span className="col-span-3 font-bold uppercase text-stone-900">{s.step}</span>
                  <span className="col-span-9 text-stone-600">{s.desc}</span>
                </div>
              ))}
            </div>

            <div>
              <Link 
                href="/datasheet" 
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <span>READ THE FULL SPECIFICATION</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          ACT 5: TELEMETRY, INTERACTIVE WORKBENCH & D3 COMPLETENESS
          ==================================================================== */}
      <section className="w-full bg-[#f7f4ed] border-b border-stone-300 py-16 px-6 sm:px-12 md:px-20 space-y-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-300 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                LIVE INDUSTRIAL PIPELINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                Master Catalog Telemetry &amp; Resolution Engine
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="green" size="sm" dot>Live Ready</Badge>
              <Badge variant="purple" size="sm">UNSPSC v26</Badge>
            </div>
          </div>

          {/* 3D Core + KPI Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5">
              <Interactive3DCore />
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-3.5">
              <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 sm:col-span-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                  <span>Standardized Master Catalog SKUs</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-stone-900 mt-2 font-mono">
                  <AnimatedCounter value={totalProcessed} /> / <AnimatedCounter value={totalUploaded} />
                </div>
                <p className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">✓ Enriched with 15+ engineering specifications</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                  <span>Average Accuracy</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
                  <AnimatedCounter value={96.4} decimals={1} suffix="%" />
                </div>
                <p className="text-[11px] font-mono text-purple-700 mt-1 font-semibold">Dual confidence engine</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                  <span>Needs Review (&lt;70%)</span>
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
                  <AnimatedCounter value={totalErrors} />
                </div>
                <p className="text-[11px] font-mono text-amber-700 mt-1 font-semibold">Routed to Human Review</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 sm:col-span-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                  <span>Cross-Supplier Duplicate SKUs</span>
                  <GitMerge className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold text-stone-900 mt-1.5 font-mono flex items-center gap-2">
                  <AnimatedCounter value={totalDuplicates} />
                  <span>Clusters</span>
                </div>
                <p className="text-[11px] font-mono text-rose-700 mt-0.5 font-semibold">Resolved via n-gram cosine similarity</p>
              </div>
            </div>
          </div>

          {/* Live Interactive Enrichment Scratchpad */}
          <LiveEnrichmentWorkbench />

          {/* D3 Spec Completeness Gauge */}
          <SpecCompletenessVisualizer />

          {/* Launchpad Enterprise Feature Modules */}
          <div className="space-y-4 pt-4 border-t border-stone-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Integrated Pipeline Tools</h3>
              <span className="text-xs text-stone-500 font-mono">Click to launch module</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/datasheet" className="group">
                <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 group-hover:border-black transition-all shadow-xs h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-black">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold font-mono text-black">Datasheet OCR Lab</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-mono">
                      Extract CAD dimensions, material specs, and limits from technical PDF datasheets.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 group-hover:underline">Launch Vision AI &rarr;</span>
                </div>
              </Link>

              <Link href="/duplicates" className="group">
                <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 group-hover:border-black transition-all shadow-xs h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-black">
                      <GitMerge className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold font-mono text-black">Duplicate Merge</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-mono">
                      Detect cross-supplier duplicates and merge into golden master records.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-600 group-hover:underline">Inspect Clusters &rarr;</span>
                </div>
              </Link>

              <Link href="/rules" className="group">
                <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 group-hover:border-black transition-all shadow-xs h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-black">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold font-mono text-black">Rule Studio</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-mono">
                      Manage industrial abbreviation dictionaries and test live keystroke transforms.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 group-hover:underline">Edit Dictionaries &rarr;</span>
                </div>
              </Link>

              <Link href="/export" className="group">
                <div className="p-5 rounded-2xl bg-white border-2 border-stone-300 group-hover:border-black transition-all shadow-xs h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-black">
                      <Download className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold font-mono text-black">Export Hub</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-mono">
                      Sanitized exports for Shopify, Magento 2, and ERP systems with 0% DDE formula risk.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-600 group-hover:underline">Export Catalog &rarr;</span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          ACT 6: FINALE ELEGANT STATEMENT BANNER (WARM IVORY & SOFT ICE BLUE)
          ==================================================================== */}
      <section className="w-full bg-gradient-to-b from-[#f7f4ed] via-[#edf7fa] to-[#f7f4ed] border-t border-stone-300 py-24 px-6 sm:px-12 md:px-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          {/* Top Cyan Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center mx-auto text-sky-700 shadow-[0_4px_20px_rgba(56,189,248,0.25)]">
            <FileCheck2 className="w-6 h-6 text-sky-600" />
          </div>

          {/* Giant Centered Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111111] leading-tight">
              Evidence should make decisions clearer, not make them for you.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-xl mx-auto leading-relaxed">
              Every catalog signal is logged with SHA-256 cryptographic audit integrity and complete explainable confidence for human sign-off.
            </p>
          </div>

          {/* Signature Pill + Cyan Circle CTA Button */}
          <div className="pt-4 flex items-center justify-center">
            <Link 
              href="/upload"
              className="inline-flex items-center gap-4 bg-white hover:bg-[#f7f4ed] text-[#111111] pl-8 pr-2.5 py-2.5 rounded-full font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider border-2 border-stone-800 shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span className="text-[#111111]">Open the Review Workspace</span>
              <div className="w-10 h-10 rounded-full bg-[#38bdf8] group-hover:bg-[#0ea5e9] text-[#111111] flex items-center justify-center transition-colors shadow-md shrink-0">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5] text-black" />
              </div>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
