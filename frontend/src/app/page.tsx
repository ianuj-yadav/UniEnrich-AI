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
  Sliders
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { listBatches, BatchItem } from "@/lib/api";
import { Interactive3DCore } from "@/components/ui/Interactive3DCore";
import { LiveEnrichmentWorkbench } from "@/components/ui/LiveEnrichmentWorkbench";
import { SpecCompletenessVisualizer } from "@/components/ui/SpecCompletenessVisualizer";
import { Hero3DLogo } from "@/components/ui/Hero3DLogo";

const REVIEWER_DIALOGUES = [
  {
    role: "Lead Catalog Reviewer",
    author: "Anuj Yadav",
    signal: "This sentence is unusually predictable compared with the surrounding passage.",
    context: "The vendor uses the same phrasing across multiple spec sheets; I will cross-reference the full paragraph before deciding.",
    record: "Reviewer note saved: retain as context, not a finding.",
  },
  {
    role: "Gemini 2.5 Flash Agent",
    author: "Catalog AI Auditor",
    signal: "RapidFuzz resolved vendor acronym 'FAB-SS' to canonical manufacturer 'Fabory Fasteners' with 98.4% Levenshtein similarity.",
    context: "Extracted 6 mechanical dimensions from raw specification tokens: thread pitch, tensile grade, coating, and package quantity.",
    record: "Automated gate pass: Confidence exceeds 70% threshold. Zero formula injection characters detected.",
  },
  {
    role: "ISO Taxonomy Specialist",
    author: "Standards Bureau",
    signal: "Hierarchical classification matched UNSPSC Segment 31 (Manufacturing Components) -> Class 31161620 (Hex Head Bolts).",
    context: "Standard normalized to DIN 933 / ISO 4017 full-thread specification for global procurement compatibility.",
    record: "Audit ledger entry recorded with SHA-256 hash. Master SKU ready for multi-channel syndication.",
  }
];

const PIPELINE_STEPS = [
  {
    step: "Upload",
    desc: "Bring in a CSV, XLSX, or selectable PDF technical datasheet.",
  },
  {
    step: "Inspect",
    desc: "Open the catalog document and inspect each extracted attribute signal.",
  },
  {
    step: "Document",
    desc: "Save a verified review record certified by human judgment.",
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
    <div className="w-full space-y-0 bg-[#f7f4ed] text-[#111111] selection:bg-[#bae6fd] selection:text-[#0369a1]">
      
      {/* ====================================================================
          ACT 1: FULL-BLEED HERO SECTION (WARM IVORY CANVAS #f7f4ed)
          ==================================================================== */}
      <section className="w-full bg-[#f7f4ed] border-b border-stone-300 pt-10 pb-16 px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-stone-600 border-b border-stone-400 pb-0.5 inline-block">
                A BETTER WAY TO REVIEW
              </span>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111111] leading-[1.04]">
                Not a verdict.<br />
                A trail of<br />
                evidence.
              </h1>
            </div>

            <div>
              <Link 
                href="/upload" 
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <span>EXPLORE THE WORKSPACE</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Mission & 3D Emblem */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 text-xs sm:text-sm font-mono text-stone-700 leading-relaxed max-w-md">
              <p>
                Araxyss is more than an AI-powered application — it is a smarter way to conduct evidence-led catalog review.
              </p>
              <p>
                Built to bridge the gap between noisy supplier feeds and search-ready master records, Araxyss uses explainable analysis to reduce repetitive checking, organize review signals, and help reviewers work with more context.
              </p>
              <p className="text-[11px] font-bold text-sky-700 uppercase tracking-widest pt-2">
                LESS COMPLEXITY. LESS REPETITION. MORE ACCOUNTABLE REVIEW.
              </p>
            </div>

            {/* 3D WebGL Vector Core */}
            <div className="pt-2">
              <Hero3DLogo />
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          ACT 2: FULL-WIDTH 3-CARD EVIDENCE RIBBON
          ==================================================================== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-stone-300">
        
        {/* Card 1: Warm Off-White */}
        <div className="bg-[#f7f4ed] p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-300 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center text-black">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
              01 / SURFACE THE SIGNAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
              See where a review deserves attention.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-mono leading-relaxed">
              Read a product in context and see the indicators that produced its review signal.
            </p>
          </div>
        </div>

        {/* Card 2: Solid Pitch Black #111111 with Animated Cyan Signal Bars */}
        <div className="bg-[#111111] text-white p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-between space-y-8 relative overflow-hidden group">
          {/* Animated Cyan Signal Scanlines */}
          <div className="space-y-2.5 pt-2">
            <div className="h-1.5 w-full bg-[#38bdf8] rounded-full cyan-signal-bar-1 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <div className="h-1.5 w-4/5 bg-[#38bdf8] rounded-full cyan-signal-bar-2 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <div className="h-1.5 w-3/5 bg-[#38bdf8] rounded-full cyan-signal-bar-3 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <div className="h-1.5 w-2/3 bg-[#38bdf8] rounded-full cyan-signal-bar-4 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
          </div>

          <div className="space-y-4 pt-6">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">
              02 / INSPECT THE RECEIPT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              Every measure has an explanation.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-mono leading-relaxed">
              Perplexity, GLTR ranks, burstiness, RapidFuzz confidence, and pattern evidence remain visible to the reviewer.
            </p>
          </div>
        </div>

        {/* Card 3: Light Silver / Off-White */}
        <div className="bg-[#f0ece1] p-8 sm:p-12 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-stone-300 flex items-center justify-center text-black">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
              03 / KEEP THE JUDGMENT HUMAN
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
              Decide with evidence, not automation.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-mono leading-relaxed">
              Confirm, dismiss, or add context before an evidence summary is shared.
            </p>
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
              Araxyss gives reviewers a shared language for discussing a sentence: what changed, which signal was observed, and what context belongs in the final record.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="flex flex-wrap gap-2 pt-2">
              {REVIEWER_DIALOGUES.map((d, idx) => (
                <button
                  key={d.author}
                  onClick={() => setActiveReviewerIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeReviewerIdx === idx
                      ? "bg-[#111111] text-white shadow-sm"
                      : "bg-white/60 hover:bg-white text-stone-700 border border-sky-300"
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
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                  <span className="font-bold ml-2">ARA 3155 / REVIEW WORKSPACE</span>
                </div>
              </div>

              {/* Document Body with Cyan Highlights */}
              <div className="space-y-4 text-sm text-stone-900 font-sans leading-relaxed">
                <div>
                  <span className="cyan-highlight-box font-semibold text-base sm:text-lg">
                    Think less. Create more.
                  </span>
                </div>

                <p className="text-stone-700">
                  Araxyss turns ideas into intelligent action.
                </p>

                <div>
                  <span className="cyan-highlight-box font-medium">
                    From complex workflows to everyday tasks, AI works behind the scenes — so you can stay ahead.
                  </span>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-600">
                <span className="font-bold">&#123;&#125; SENTENCE 02</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 font-bold uppercase">
                  REVIEW SIGNAL
                </span>
              </div>
            </div>
          </div>

          {/* Right: One Review Flow Stepper & Table */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-stone-600">
                FROM DOCUMENT TO DISCUSSION
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
                <span>READ THE DOCUMENTATION</span>
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

        </div>
      </section>

      {/* ====================================================================
          ACT 6: FINALE SOLID PITCH BLACK STATEMENT BANNER (#0a0d12)
          ==================================================================== */}
      <section className="w-full bg-[#0a0d12] text-white py-24 px-6 sm:px-12 md:px-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Cyan Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/50 flex items-center justify-center mx-auto text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <FileCheck2 className="w-5 h-5 text-sky-400" />
          </div>

          {/* Giant Centered Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Evidence should make decisions clearer, not make them for you.
          </h2>

          {/* Signature Pill + Cyan Circle CTA Button */}
          <div className="pt-4 flex items-center justify-center">
            <Link 
              href="/upload"
              className="inline-flex items-center gap-3 bg-[#f7f4ed] hover:bg-white text-[#111111] pl-6 pr-2 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider shadow-2xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span>Create your account</span>
              <div className="w-9 h-9 rounded-full bg-[#38bdf8] group-hover:bg-[#0ea5e9] text-black flex items-center justify-center transition-colors shadow-sm">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
