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
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
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
    badge: "HUMAN SIGN-OFF",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    signal: "This SKU title contains 4 non-standard vendor abbreviations (SS, HEX, BLT, PK100) conflicting with standard ISO fasteners.",
    context: "Cross-referenced with datasheet CAD OCR; dimensions matched 1/2-13 UNC x 2.00in and material verified as 316 Marine Grade.",
    record: "Reviewer note saved: retain ISO DIN 933 compliance, normalize thread pitch, mark auto-approved for Shopify & Magento export.",
  },
  {
    role: "Gemini 2.5 Flash Agent",
    author: "Catalog AI Auditor",
    badge: "CONFIDENCE: 98.4%",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    signal: "RapidFuzz resolved vendor acronym 'FAB-SS' to canonical manufacturer 'Fabory Fasteners' with 98.4% Levenshtein similarity.",
    context: "Extracted 6 mechanical dimensions from raw specification tokens: thread pitch, tensile grade, coating, and package quantity.",
    record: "Automated gate pass: Confidence exceeds 70% threshold. Zero formula injection characters detected.",
  },
  {
    role: "ISO Taxonomy Specialist",
    author: "Standards Bureau",
    badge: "UNSPSC: 31161620",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    signal: "Hierarchical classification matched UNSPSC Segment 31 (Manufacturing Components) -> Class 31161620 (Hex Head Bolts).",
    context: "Standard normalized to DIN 933 / ISO 4017 full-thread specification for global procurement compatibility.",
    record: "Audit ledger entry recorded with SHA-256 hash. Master SKU ready for multi-channel syndication.",
  }
];

const PIPELINE_STEPS = [
  {
    key: "upload",
    title: "1. Upload",
    desc: "Ingest CSV, XLSX, or technical PDF datasheet with instant schema mapping.",
    terminalSnippet: `$ unienrich intake --file supplier_feed_2026.csv
[INFO] Parsed 1,472 raw vendor SKU rows in 42ms
[INFO] Auto-detected 18 schema columns (title, mpn, vendor, desc)
[SECURITY] Cleaned 0 formula injection characters (=, +, -, @)
[STATUS] Ready for RapidFuzz brand resolution & Gemini attribute extraction`,
  },
  {
    key: "inspect",
    title: "2. Inspect",
    desc: "Examine extracted attribute signals, confidence markers, and vector duplicates.",
    terminalSnippet: `$ unienrich inspect --sku SKU-10492 --model gemini-2.5-flash
[ATTR] Thread Size: 1/2"-13 UNC (Confidence: 0.99)
[ATTR] Material: Grade 316 Marine Stainless (Confidence: 0.98)
[ATTR] Standard: DIN 933 / ISO 4017 (Confidence: 0.97)
[TAXONOMY] UNSPSC Code: 31161620 (Hex bolts)
[VECTOR] Duplicate Cluster #18: 2 vendor matches (Fabory vs Grainger)`,
  },
  {
    key: "document",
    title: "3. Document",
    desc: "Certify master record with human-in-the-loop notes and export to ERP.",
    terminalSnippet: `$ unienrich export --batch b-9281 --channel shopify,magento,sap
[EXPORT] Generated 1,420 sanitized master records
[CHANNELS] Shopify CSV, Magento 2 XML, SAP RFC Payload
[HITL] 52 ambiguous records routed to Human Review Queue
[LEDGER] Audit certificate signed by Anuj Yadav (Lead Reviewer)`,
  }
];

export default function DashboardPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReviewerIdx, setActiveReviewerIdx] = useState(0);
  const [activePipelineStep, setActivePipelineStep] = useState(0);

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

  const activeBatch = batches.length > 0 ? batches[0] : null;
  const activeDialogue = REVIEWER_DIALOGUES[activeReviewerIdx];
  const currentStep = PIPELINE_STEPS[activePipelineStep];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* ====================================================================
          VANTAGE VIBRANT 2-COLUMN HERO SECTION
          ==================================================================== */}
      <div className="relative rounded-3xl border-2 border-indigo-100 p-6 sm:p-10 md:p-12 overflow-hidden bg-white shadow-[0_20px_50px_rgba(59,130,246,0.08)]">
        {/* Soft Radiant Multi-Tone Radial Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/40 to-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/40 to-pink-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Left Hero Stack */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Live Release Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-sm text-[11px] font-mono font-bold text-indigo-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>VANTAGE 2.5 • AI INDUSTRIAL ENRICHMENT</span>
            </div>

            {/* Exact Headline Typography (Rich High Contrast) */}
            <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#2b201a]">
              <span className="block line-scale-1 text-[#2b201a]">Stop Digging</span>
              <span className="block line-scale-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Through Dashboards.
              </span>
            </h1>

            {/* Exact Body Copy & Value Props */}
            <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed max-w-xl">
              Your metrics are scattered across a dozen supplier feeds. 
              Vantage standardizes messy vendor abbreviations into one certified master signal, 
              so every procurement decision is backed by data you actually trust.
            </p>

            {/* Core Capability Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-xs">
                <Check className="w-3.5 h-3.5 text-sky-600" /> RapidFuzz Normalizer
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold shadow-xs">
                <Check className="w-3.5 h-3.5 text-purple-600" /> Gemini 2.5 Spec AI
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> UNSPSC Taxonomy
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/upload">
                <PopButton className="px-8 py-4 text-xs font-bold tracking-wider cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span>GET STARTED NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </PopButton>
              </Link>

              {activeBatch ? (
                <Link href={`/products?batch_id=${activeBatch.id}`}>
                  <Button variant="secondary" size="md" className="px-6 py-4 text-xs cursor-pointer border-slate-300 hover:border-indigo-400">
                    <span>EXPLORE ACTIVE CATALOG</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 text-indigo-600" />
                  </Button>
                </Link>
              ) : (
                <Link href="/upload">
                  <Button variant="secondary" size="md" className="px-6 py-4 text-xs cursor-pointer border-slate-300 hover:border-indigo-400">
                    <span>UPLOAD SUPPLIER FEED</span>
                    <UploadCloud className="w-3.5 h-3.5 ml-2 text-blue-600" />
                  </Button>
                </Link>
              )}
            </div>

            {/* 4-Stat Trust Strip */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
                <div className="text-lg font-extrabold text-emerald-700">
                  <AnimatedCounter value={98.4} decimals={1} suffix="%" />
                </div>
                <div className="text-[11px] text-emerald-800/80 font-sans font-semibold">Accuracy Gate</div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-xs">
                <div className="text-lg font-extrabold text-purple-700">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <div className="text-[11px] text-purple-800/80 font-sans font-semibold">Specs per SKU</div>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-200 shadow-xs">
                <div className="text-lg font-extrabold text-sky-700">
                  <AnimatedCounter value={42} suffix="ms" />
                </div>
                <div className="text-[11px] text-sky-800/80 font-sans font-semibold">Parsing Speed</div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs">
                <div className="text-lg font-extrabold text-amber-700">0% Risk</div>
                <div className="text-[11px] text-amber-800/80 font-sans font-semibold">DDE Escaping</div>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Brand Logo Canvas */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Hero3DLogo />
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS SECTION 1: NOT A VERDICT. A TRAIL OF EVIDENCE.
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-slate-200 p-8 md:p-12 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></span>
              <span>A Better Way to Enrich Industrial Catalogs</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Not a verdict.<br />
              <span className="text-slate-400">A trail of evidence.</span>
            </h2>

            <Link href="/upload" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-900 border-b-2 border-indigo-500 pb-1 transition-colors">
              <span>EXPLORE THE WORKSPACE</span>
              <span className="text-sm">↗</span>
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <p>
              UniEnrich is more than an AI-powered data pipeline — it is a smarter, verifiable way to conduct industrial catalog standardization and review.
            </p>
            <p>
              Built to bridge the gap between noisy supplier feeds and search-ready master records, UniEnrich uses explainable NLP, RapidFuzz entity matching, and Gemini attribute extraction to reduce repetitive manual checking, organize review signals, and help catalog managers work with total context.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
              <span className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-bold">Less Complexity</span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-bold">Less Repetition</span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">More Accountable Revision</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 2: 3-CARD INTERACTIVE EVIDENCE DECK (MULTI-COLOR)
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 - Cyan / Sky Theme */}
        <div className="rounded-3xl border-2 border-sky-100 p-6 bg-gradient-to-b from-white to-sky-50/30 hover:border-sky-400 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-sky-600 uppercase tracking-wider font-bold group-hover:text-sky-700 transition-colors">
              01 / SURFACE THE SIGNAL
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              See where a catalog SKU deserves attention.
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Read an abbreviated product in context and see the confidence markers that produced its enrichment signal.
            </p>
          </div>
          <div className="pt-4 border-t border-sky-100 flex items-center justify-between text-[11px] text-sky-700 font-bold">
            <span>Deterministic Scoring</span>
            <span className="text-sky-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Card 2 - Violet / Purple Theme */}
        <div className="rounded-3xl border-2 border-purple-200 p-6 bg-gradient-to-b from-purple-50/50 to-pink-50/30 hover:border-purple-400 hover:shadow-[0_10px_30px_rgba(168,85,247,0.18)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-purple-700 uppercase tracking-wider font-bold">
              02 / INSPECT THE RECEIPT
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              Every measure has an explanation.
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              RapidFuzz confidence, MRO acronym lookups, UNSPSC taxonomy codes, and vector duplicates remain visible to the reviewer.
            </p>
          </div>
          <div className="pt-4 border-t border-purple-200 flex items-center justify-between text-[11px] text-purple-800 font-mono font-bold">
            <span>Perplexity &amp; GLTR Evidence</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Card 3 - Emerald / Green Theme */}
        <div className="rounded-3xl border-2 border-emerald-100 p-6 bg-gradient-to-b from-white to-emerald-50/30 hover:border-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider font-bold group-hover:text-emerald-700 transition-colors">
              03 / KEEP THE JUDGMENT HUMAN
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              Decide with evidence, not automation.
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm, dismiss, or add context before a standardized catalog record is exported to ERP or commerce channels.
            </p>
          </div>
          <div className="pt-4 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
            <span>Human-in-the-Loop Queue</span>
            <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS SECTION 3: INTERACTIVE REVIEWER DIALOGUE & EVIDENCE TRANSCRIPT
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-slate-200 p-8 md:p-12 bg-white shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold">
              004 STD / REVIEWER DIALOGUE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              The evidence starts the conversation. It never ends it.
            </h2>
          </div>

          {/* Interactive Reviewer Persona Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {REVIEWER_DIALOGUES.map((d, idx) => (
              <button
                key={d.author}
                onClick={() => setActiveReviewerIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeReviewerIdx === idx
                    ? "bg-indigo-600 text-white shadow-md font-bold scale-105"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {d.author}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Persona Info */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold ${activeDialogue.badgeColor}`}>
                {activeDialogue.badge}
              </span>
              <span className="text-xs font-bold text-slate-900">{activeDialogue.role}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              UniEnrich gives catalog teams a shared language for discussing a SKU: what changed, which signal was observed, and what context belongs in the final master record.
            </p>
          </div>

          {/* Right Evidence Rows */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 flex items-start gap-4 hover:border-sky-300 transition">
              <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                SIGNAL
              </span>
              <p className="text-xs text-slate-900 italic leading-relaxed">
                &ldquo;{activeDialogue.signal}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 flex items-start gap-4 hover:border-purple-300 transition">
              <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 border border-purple-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                CONTEXT
              </span>
              <p className="text-xs text-slate-900 italic leading-relaxed">
                &ldquo;{activeDialogue.context}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-4 hover:border-emerald-300 transition">
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                RECORD
              </span>
              <p className="text-xs text-slate-900 italic leading-relaxed">
                &ldquo;{activeDialogue.record}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 4: INTERACTIVE ONE REVIEW FLOW STEPPER
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-slate-200 p-8 md:p-12 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Dynamic Terminal Spec Box */}
          <div className="lg:col-span-6 rounded-3xl border-2 border-indigo-200 bg-slate-950 text-slate-100 p-6 space-y-4 font-mono shadow-md">
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-3">
              <span className="font-bold text-indigo-400">004 STD / MRO REVIEW WORKSPACE</span>
              <span className="text-emerald-400 font-bold">STAGE: {currentStep.title}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-[11px] text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {currentStep.terminalSnippet}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-slate-300">&#123;&#125; UNIENRICH PIPELINE CLI</span>
              <Link href="/upload">
                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-500 transition">
                  TEST WORKSPACE &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Right 3-Step Interactive Review Flow */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold">
              FROM INGESTION TO RESOLUTION
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              One review flow.<br />
              <span className="text-slate-400">No black box.</span>
            </h2>

            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, idx) => (
                <div
                  key={step.key}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    activePipelineStep === idx
                      ? "border-indigo-500 bg-indigo-50/60 shadow-sm scale-[1.01]"
                      : "border-slate-200 bg-slate-50/60 hover:bg-white"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-indigo-900 uppercase w-20 shrink-0 mt-0.5">
                    {step.title}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/datasheet" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-900 border-b-2 border-indigo-500 pb-1 transition-colors">
                <span>READ THE FULL SPECIFICATION</span>
                <span className="text-sm">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3D INTERACTIVE VECTOR GRAPH & 5-KPI BENTO SECTION
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D Particle Cloud Canvas */}
        <div className="lg:col-span-5">
          <Interactive3DCore />
        </div>

        {/* 5-KPI Metric Cards Grid with Animated Counter (Multi-Color) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-3.5">
          <Card className="p-4 sm:col-span-2 border-emerald-200 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Standardized Master Catalog SKUs</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2 font-mono">
              <AnimatedCounter value={totalProcessed} /> / <AnimatedCounter value={totalUploaded} />
            </div>
            <p className="text-[11px] text-emerald-800/80 mt-1 font-semibold">Enriched with 15+ engineering specifications</p>
          </Card>

          <Card className="p-4 border-purple-200 bg-gradient-to-r from-purple-50/50 to-white">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
              <span>Average Accuracy</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2 font-mono">
              <AnimatedCounter value={96.4} decimals={1} suffix="%" />
            </div>
            <p className="text-[11px] text-purple-800/80 mt-1 font-semibold">Dual confidence engine</p>
          </Card>

          <Card className="p-4 border-amber-200 bg-gradient-to-r from-amber-50/50 to-white">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
              <span>Needs Review (&lt;70%)</span>
              <CheckSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">
              <AnimatedCounter value={totalErrors} />
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 font-semibold">Routed to Human Review</p>
          </Card>

          <Card className="p-4 sm:col-span-2 border-rose-200 bg-gradient-to-r from-rose-50/50 to-white">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
              <span>Cross-Supplier Duplicate SKUs</span>
              <GitMerge className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-1.5 font-mono flex items-center gap-2">
              <AnimatedCounter value={totalDuplicates} />
              <span>Clusters</span>
            </div>
            <p className="text-[11px] text-rose-800/80 mt-0.5 font-semibold">Resolved via n-gram cosine similarity</p>
          </Card>
        </div>
      </div>

      {/* ====================================================================
          LIVE ENRICHMENT WORKBENCH (INTERACTIVE TESTER)
          ==================================================================== */}
      <LiveEnrichmentWorkbench />

      {/* ====================================================================
          D3 ATTRIBUTE DENSITY & SPEC COMPLETENESS ANALYZER
          ==================================================================== */}
      <SpecCompletenessVisualizer />

      {/* ====================================================================
          3-CARD BUSINESS ROI & TAXONOMY DELTA
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 font-mono">
            📈 Business ROI Impact
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">
            <AnimatedCounter value={84.2} decimals={1} suffix=" Man-Hours" />
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            Saved through automated batch cleaning, attribute extraction, and taxonomy classification.
          </p>
        </Card>

        <Card className="p-5 border-sky-200 bg-gradient-to-br from-sky-50/40 to-white">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-2 font-mono">
            ⚡ Taxonomy Completeness
          </div>
          <div className="text-3xl font-extrabold text-sky-700 font-mono">
            <AnimatedCounter value={42.0} decimals={1} prefix="+" suffix="% Resolution" />
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            Increase in canonical brand and manufacturer coverage using RapidFuzz entity matching.
          </p>
        </Card>

        <Card className="p-5 border-purple-200 bg-gradient-to-br from-purple-50/40 to-white">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-800 uppercase tracking-wider mb-2 font-mono">
            🛡️ Quality & Security Gate
          </div>
          <div className="text-3xl font-extrabold text-purple-700 font-mono">
            0% Formula Risk
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            Strict CSV DDE injection escaping (=, +, -, @) ensuring safe multi-channel ERP exports.
          </p>
        </Card>
      </div>

      {/* ====================================================================
          LAUNCHPAD ENTERPRISE FEATURE MODULES (COLOR CODED)
          ==================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Enterprise Feature Modules</h2>
          <span className="text-xs text-slate-500">Integrated Pipeline Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/datasheet" className="group">
            <Card className="p-5 h-full border-purple-200 hover:border-purple-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Datasheet OCR Lab</h3>
                <Badge variant="purple" size="sm">Vision AI</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Extract CAD dimensions, material specs, and electrical limits from technical PDF datasheets.
              </p>
            </Card>
          </Link>

          <Link href="/duplicates" className="group">
            <Card className="p-5 h-full border-sky-200 hover:border-sky-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 mb-3 group-hover:scale-110 transition-transform">
                <GitMerge className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">Duplicate Merge</h3>
                <Badge variant="blue" size="sm">Vector n-gram</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Detect cross-supplier duplicates, resolve attribute discrepancies, and merge into master SKUs.
              </p>
            </Card>
          </Link>

          <Link href="/rules" className="group">
            <Card className="p-5 h-full border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Rule Studio</h3>
                <Badge variant="green" size="sm">Studio</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Manage industrial abbreviation dictionaries and test real-time keystroke transformations.
              </p>
            </Card>
          </Link>

          <Link href="/export" className="group">
            <Card className="p-5 h-full border-orange-200 hover:border-orange-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">Export Center</h3>
                <Badge variant="orange" size="sm">Hub</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sanitized exports for Shopify, Magento 2, and ERP systems in CSV, Excel, and JSON formats.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS FINALE QUOTE SECTION (RICH VIBRANT ACCENTS)
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-indigo-200 p-10 sm:p-16 text-center space-y-6 bg-gradient-to-r from-indigo-50/60 via-purple-50/50 to-pink-50/60 shadow-md relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl border-2 border-indigo-300 bg-white flex items-center justify-center mx-auto text-indigo-700 shadow-md">
          <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 max-w-2xl mx-auto leading-tight tracking-tight">
          Evidence should make decisions clearer, not make them for you.
        </h2>

        <div className="pt-2">
          <Link href="/upload">
            <PopButton variant="pop" className="px-8 py-5 text-sm font-bold tracking-wider cursor-pointer">
              <span className="flex items-center gap-2">
                <span>OPEN THE REVIEW WORKSPACE</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </PopButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
