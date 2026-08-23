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
    signal: "This SKU title contains 4 non-standard vendor abbreviations (SS, HEX, BLT, PK100) conflicting with standard ISO fasteners.",
    context: "Cross-referenced with datasheet CAD OCR; dimensions matched 1/2-13 UNC x 2.00in and material verified as 316 Marine Grade.",
    record: "Reviewer note saved: retain ISO DIN 933 compliance, normalize thread pitch, mark auto-approved for Shopify & Magento export.",
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
          VANTAGE LIGHT EDITORIAL 2-COLUMN HERO SECTION
          ==================================================================== */}
      <div className="relative rounded-3xl border-2 border-[#e8dede] p-6 sm:p-10 md:p-12 overflow-hidden bg-[#ffffff] shadow-[0_16px_48px_rgba(177,133,151,0.1)]">
        {/* Soft Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#fff0f0] rounded-full blur-3xl pointer-events-none opacity-90" />
        <div className="absolute -bottom-10 left-1/4 w-[400px] h-[400px] bg-[#f9c4d2]/35 rounded-full blur-3xl pointer-events-none opacity-80" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Left Hero Stack */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Live Release Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff0f0] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] text-[11px] font-mono font-bold text-[#382b22]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>VANTAGE 2.5 • AI-POWERED CATALOG ENRICHMENT</span>
            </div>

            {/* Exact Headline Typography (Light High Contrast) */}
            <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-[#2b201a]">
              <span className="block line-scale-1 text-[#2b201a]">Stop Digging</span>
              <span className="block line-scale-2 text-[#7a6860]">Through Dashboards.</span>
            </h1>

            {/* Exact Body Copy & Value Props */}
            <p className="text-sm sm:text-base text-[#5e4d46] font-normal leading-relaxed max-w-xl">
              Your metrics are scattered across a dozen supplier feeds. 
              Vantage standardizes messy vendor abbreviations into one certified master signal, 
              so every procurement decision is backed by data you actually trust.
            </p>

            {/* Core Capability Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] font-semibold">
                <Check className="w-3 h-3" /> RapidFuzz Normalizer
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe] font-semibold">
                <Check className="w-3 h-3" /> Gemini 2.5 Spec AI
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-semibold">
                <Check className="w-3 h-3" /> UNSPSC Taxonomy
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
                  <Button variant="secondary" size="md" className="px-6 py-4 text-xs cursor-pointer">
                    <span>EXPLORE ACTIVE CATALOG</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/upload">
                  <Button variant="secondary" size="md" className="px-6 py-4 text-xs cursor-pointer">
                    <span>UPLOAD SUPPLIER FEED</span>
                    <UploadCloud className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* 4-Stat Trust Strip */}
            <div className="pt-4 border-t border-[#e8dede] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-base font-extrabold text-[#065f46]">
                  <AnimatedCounter value={98.4} decimals={1} suffix="%" />
                </div>
                <div className="text-[10px] text-[#8c7770] font-sans">Accuracy Gate</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-base font-extrabold text-[#5b21b6]">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <div className="text-[10px] text-[#8c7770] font-sans">Specs per SKU</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-base font-extrabold text-[#1e40af]">
                  <AnimatedCounter value={42} suffix="ms" />
                </div>
                <div className="text-[10px] text-[#8c7770] font-sans">Parsing Speed</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-base font-extrabold text-[#2b201a]">0% Risk</div>
                <div className="text-[10px] text-[#8c7770] font-sans">DDE Escaping</div>
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
      <section className="rounded-3xl border-2 border-[#e8dede] p-8 md:p-12 bg-[#ffffff] shadow-[0_4px_24px_rgba(177,133,151,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-bold text-[#8c7770] uppercase tracking-widest flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#b18597]"></span>
              <span>A Better Way to Enrich Industrial Catalogs</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#2b201a] leading-[1.1]">
              Not a verdict.<br />
              <span className="text-[#8c7770]">A trail of evidence.</span>
            </h2>

            <Link href="/upload" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#382b22] hover:text-[#b18597] border-b-2 border-[#b18597] pb-1 transition-colors">
              <span>EXPLORE THE WORKSPACE</span>
              <span className="text-sm">↗</span>
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6 text-sm text-[#5e4d46] leading-relaxed font-normal">
            <p>
              UniEnrich is more than an AI-powered data pipeline — it is a smarter, verifiable way to conduct industrial catalog standardization and review.
            </p>
            <p>
              Built to bridge the gap between noisy supplier feeds and search-ready master records, UniEnrich uses explainable NLP, RapidFuzz entity matching, and Gemini attribute extraction to reduce repetitive manual checking, organize review signals, and help catalog managers work with total context.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase text-[#6e5d56]">
              <span className="px-3 py-1 rounded-lg bg-[#faf6f6] border border-[#e8dede] font-semibold">Less Complexity</span>
              <span className="px-3 py-1 rounded-lg bg-[#faf6f6] border border-[#e8dede] font-semibold">Less Repetition</span>
              <span className="px-3 py-1 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] font-semibold">More Accountable Revision</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 2: 3-CARD INTERACTIVE EVIDENCE DECK
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="rounded-3xl border-2 border-[#e8dede] p-6 bg-[#ffffff] hover:border-[#b18597] hover:shadow-[0_8px_24px_rgba(177,133,151,0.12)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[#8c7770] uppercase tracking-wider font-semibold group-hover:text-[#b18597] transition-colors">
              01 / SURFACE THE SIGNAL
            </div>
            <h3 className="text-xl font-bold text-[#2b201a] tracking-tight leading-snug">
              See where a catalog SKU deserves attention.
            </h3>
            <p className="text-xs text-[#5e4d46] leading-relaxed">
              Read an abbreviated product in context and see the confidence markers that produced its enrichment signal.
            </p>
          </div>
          <div className="pt-4 border-t border-[#e8dede] flex items-center justify-between text-[11px] text-[#8c7770] font-semibold">
            <span>Deterministic Scoring</span>
            <span className="text-[#b18597] font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl border-2 border-[#b18597] p-6 bg-[#fff0f0]/70 hover:bg-[#fff0f0] hover:shadow-[0_8px_24px_rgba(177,133,151,0.18)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[#703d52] uppercase tracking-wider font-bold">
              02 / INSPECT THE RECEIPT
            </div>
            <h3 className="text-xl font-bold text-[#2b201a] tracking-tight leading-snug">
              Every measure has an explanation.
            </h3>
            <p className="text-xs text-[#5e4d46] leading-relaxed">
              RapidFuzz confidence, MRO acronym lookups, UNSPSC taxonomy codes, and vector duplicates remain visible to the reviewer.
            </p>
          </div>
          <div className="pt-4 border-t border-[#d4c3c9] flex items-center justify-between text-[11px] text-[#703d52] font-mono font-bold">
            <span>Perplexity &amp; GLTR Evidence</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-3xl border-2 border-[#e8dede] p-6 bg-[#ffffff] hover:border-[#b18597] hover:shadow-[0_8px_24px_rgba(177,133,151,0.12)] hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer group">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[#8c7770] uppercase tracking-wider font-semibold group-hover:text-[#065f46] transition-colors">
              03 / KEEP THE JUDGMENT HUMAN
            </div>
            <h3 className="text-xl font-bold text-[#2b201a] tracking-tight leading-snug">
              Decide with evidence, not automation.
            </h3>
            <p className="text-xs text-[#5e4d46] leading-relaxed">
              Confirm, dismiss, or add context before a standardized catalog record is exported to ERP or commerce channels.
            </p>
          </div>
          <div className="pt-4 border-t border-[#e8dede] flex items-center justify-between text-[11px] text-[#8c7770] font-semibold">
            <span>Human-in-the-Loop Queue</span>
            <span className="text-[#065f46] font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS SECTION 3: INTERACTIVE REVIEWER DIALOGUE & EVIDENCE TRANSCRIPT
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-[#e8dede] p-8 md:p-12 bg-[#ffffff] shadow-[0_4px_24px_rgba(177,133,151,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8dede] pb-4">
          <div>
            <div className="text-[10px] font-mono text-[#8c7770] uppercase tracking-widest font-semibold">
              004 STD / REVIEWER DIALOGUE
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#2b201a] tracking-tight mt-1">
              The evidence starts the conversation. It never ends it.
            </h2>
          </div>

          {/* Interactive Reviewer Persona Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {REVIEWER_DIALOGUES.map((d, idx) => (
              <button
                key={d.author}
                onClick={() => setActiveReviewerIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeReviewerIdx === idx
                    ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_3px_0_0_#b18597] font-bold"
                    : "bg-[#faf6f6] hover:bg-[#fff5f7] text-[#6e5d56] border border-[#e8dede]"
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
              <span className="px-2.5 py-1 rounded-md bg-[#fff0f0] border border-[#b18597] text-[#382b22] font-mono text-[10px] font-bold">
                {activeDialogue.badge}
              </span>
              <span className="text-xs font-bold text-[#2b201a]">{activeDialogue.role}</span>
            </div>
            <p className="text-xs text-[#5e4d46] leading-relaxed">
              UniEnrich gives catalog teams a shared language for discussing a SKU: what changed, which signal was observed, and what context belongs in the final master record.
            </p>
          </div>

          {/* Right Evidence Rows */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-2xl border border-[#e8dede] bg-[#faf6f6] flex items-start gap-4 hover:border-[#b18597] transition">
              <span className="px-2.5 py-1 rounded-md bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                SIGNAL
              </span>
              <p className="text-xs text-[#2b201a] italic leading-relaxed">
                &ldquo;{activeDialogue.signal}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e8dede] bg-[#faf6f6] flex items-start gap-4 hover:border-[#b18597] transition">
              <span className="px-2.5 py-1 rounded-md bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe] font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                CONTEXT
              </span>
              <p className="text-xs text-[#2b201a] italic leading-relaxed">
                &ldquo;{activeDialogue.context}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e8dede] bg-[#faf6f6] flex items-start gap-4 hover:border-[#b18597] transition">
              <span className="px-2.5 py-1 rounded-md bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                RECORD
              </span>
              <p className="text-xs text-[#2b201a] italic leading-relaxed">
                &ldquo;{activeDialogue.record}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 4: INTERACTIVE ONE REVIEW FLOW STEPPER
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-[#e8dede] p-8 md:p-12 bg-[#ffffff] shadow-[0_4px_24px_rgba(177,133,151,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Dynamic Terminal Spec Box */}
          <div className="lg:col-span-6 rounded-3xl border-2 border-[#d4c3c9] bg-[#fffbfb] p-6 space-y-4 font-mono shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-[#8c7770] border-b border-[#e8dede] pb-3">
              <span className="font-bold">004 STD / MRO REVIEW WORKSPACE</span>
              <span className="text-[#065f46] font-bold">STAGE: {currentStep.title}</span>
            </div>

            <div className="bg-[#faf6f6] border border-[#e8dede] p-3.5 rounded-xl text-[11px] text-[#2b201a] whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {currentStep.terminalSnippet}
            </div>

            <div className="pt-2 border-t border-[#e8dede] flex items-center justify-between text-[10px] text-[#8c7770]">
              <span className="font-bold">&#123;&#125; UNIENRICH PIPELINE CLI</span>
              <Link href="/upload">
                <span className="px-3 py-1 rounded-lg bg-[#fff0f0] border border-[#b18597] text-[#382b22] font-bold cursor-pointer hover:bg-[#ffe9e9]">
                  TEST WORKSPACE &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Right 3-Step Interactive Review Flow */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono text-[#8c7770] uppercase tracking-widest font-semibold">
              FROM INGESTION TO RESOLUTION
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#2b201a] tracking-tight leading-tight">
              One review flow.<br />
              <span className="text-[#8c7770]">No black box.</span>
            </h2>

            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, idx) => (
                <div
                  key={step.key}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    activePipelineStep === idx
                      ? "border-[#b18597] bg-[#fff0f0] shadow-sm"
                      : "border-[#e8dede] bg-[#faf6f6] hover:bg-[#ffffff]"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-[#2b201a] uppercase w-20 shrink-0 mt-0.5">
                    {step.title}
                  </span>
                  <p className="text-xs text-[#5e4d46] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/datasheet" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#382b22] hover:text-[#b18597] border-b-2 border-[#b18597] pb-1 transition-colors">
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

        {/* 5-KPI Metric Cards Grid with Animated Counter */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-3.5">
          <Card className="p-4 sm:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6e5d56]">
              <span>Standardized Master Catalog SKUs</span>
              <Sparkles className="w-4 h-4 text-[#065f46]" />
            </div>
            <div className="text-3xl font-extrabold text-[#065f46] mt-2 font-mono">
              <AnimatedCounter value={totalProcessed} /> / <AnimatedCounter value={totalUploaded} />
            </div>
            <p className="text-[11px] text-[#065f46]/80 mt-1">Enriched with 15+ engineering specifications</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6e5d56]">
              <span>Average Accuracy</span>
              <TrendingUp className="w-4 h-4 text-[#5b21b6]" />
            </div>
            <div className="text-2xl font-bold text-[#5b21b6] mt-2 font-mono">
              <AnimatedCounter value={96.4} decimals={1} suffix="%" />
            </div>
            <p className="text-[11px] text-[#5b21b6]/80 mt-1">Dual confidence engine</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6e5d56]">
              <span>Needs Review (&lt;70%)</span>
              <CheckSquare className="w-4 h-4 text-[#92400e]" />
            </div>
            <div className="text-2xl font-bold text-[#92400e] mt-2 font-mono">
              <AnimatedCounter value={totalErrors} />
            </div>
            <p className="text-[11px] text-[#92400e]/80 mt-1">Routed to Human Review</p>
          </Card>

          <Card className="p-4 sm:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6e5d56]">
              <span>Cross-Supplier Duplicate SKUs</span>
              <GitMerge className="w-4 h-4 text-[#991b1b]" />
            </div>
            <div className="text-2xl font-bold text-[#991b1b] mt-1.5 font-mono flex items-center gap-2">
              <AnimatedCounter value={totalDuplicates} />
              <span>Clusters</span>
            </div>
            <p className="text-[11px] text-[#991b1b]/80 mt-0.5">Resolved via n-gram cosine similarity</p>
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
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#065f46] uppercase tracking-wider mb-2 font-mono">
            📈 Business ROI Impact
          </div>
          <div className="text-3xl font-extrabold text-[#2b201a] font-mono">
            <AnimatedCounter value={84.2} decimals={1} suffix=" Man-Hours" />
          </div>
          <p className="text-xs text-[#5e4d46] mt-1.5">
            Saved through automated batch cleaning, attribute extraction, and taxonomy classification.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1e40af] uppercase tracking-wider mb-2 font-mono">
            ⚡ Taxonomy Completeness
          </div>
          <div className="text-3xl font-extrabold text-[#065f46] font-mono">
            <AnimatedCounter value={42.0} decimals={1} prefix="+" suffix="% Resolution" />
          </div>
          <p className="text-xs text-[#5e4d46] mt-1.5">
            Increase in canonical brand and manufacturer coverage using RapidFuzz entity matching.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5b21b6] uppercase tracking-wider mb-2 font-mono">
            🛡️ Quality & Security Gate
          </div>
          <div className="text-3xl font-extrabold text-[#065f46] font-mono">
            0% Formula Risk
          </div>
          <p className="text-xs text-[#5e4d46] mt-1.5">
            Strict CSV DDE injection escaping (=, +, -, @) ensuring safe multi-channel ERP exports.
          </p>
        </Card>
      </div>

      {/* ====================================================================
          LAUNCHPAD ENTERPRISE FEATURE MODULES
          ==================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2b201a] uppercase tracking-wider font-mono">Enterprise Feature Modules</h2>
          <span className="text-xs text-[#8c7770]">Integrated Pipeline Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/datasheet" className="group">
            <Card className="p-5 h-full hover:border-[#b18597] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] flex items-center justify-center text-[#5b21b6] mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2b201a] group-hover:text-[#5b21b6] transition-colors">Datasheet OCR Lab</h3>
                <Badge variant="purple" size="sm">Vision AI</Badge>
              </div>
              <p className="text-xs text-[#5e4d46] mt-1.5 leading-relaxed">
                Extract CAD dimensions, material specs, and electrical limits from technical PDF datasheets.
              </p>
            </Card>
          </Link>

          <Link href="/duplicates" className="group">
            <Card className="p-5 h-full hover:border-[#b18597] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-[#1e40af] mb-3 group-hover:scale-110 transition-transform">
                <GitMerge className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2b201a] group-hover:text-[#1e40af] transition-colors">Duplicate Merge Studio</h3>
                <Badge variant="blue" size="sm">Vector n-gram</Badge>
              </div>
              <p className="text-xs text-[#5e4d46] mt-1.5 leading-relaxed">
                Detect cross-supplier duplicates, resolve attribute discrepancies, and merge into master SKUs.
              </p>
            </Card>
          </Link>

          <Link href="/rules" className="group">
            <Card className="p-5 h-full hover:border-[#b18597] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#065f46] mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2b201a] group-hover:text-[#065f46] transition-colors">Rule Studio & Scratchpad</h3>
                <Badge variant="green" size="sm">Studio</Badge>
              </div>
              <p className="text-xs text-[#5e4d46] mt-1.5 leading-relaxed">
                Manage industrial abbreviation dictionaries and test real-time keystroke transformations.
              </p>
            </Card>
          </Link>

          <Link href="/export" className="group">
            <Card className="p-5 h-full hover:border-[#b18597] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center text-[#9a3412] mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2b201a] group-hover:text-[#9a3412] transition-colors">Multi-Channel Export</h3>
                <Badge variant="orange" size="sm">Export Hub</Badge>
              </div>
              <p className="text-xs text-[#5e4d46] mt-1.5 leading-relaxed">
                Sanitized exports for Shopify, Magento 2, and ERP systems in CSV, Excel, and JSON formats.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS FINALE QUOTE SECTION (LIGHT BLUSH PORCELAIN)
          ==================================================================== */}
      <section className="rounded-3xl border-2 border-[#b18597] p-10 sm:p-16 text-center space-y-6 bg-[#fff0f0] shadow-[0_8px_32px_rgba(177,133,151,0.15)] relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl border-2 border-[#b18597] bg-[#ffffff] flex items-center justify-center mx-auto text-[#382b22] shadow-[0_4px_0_0_#b18597]">
          <Sparkles className="w-6 h-6 text-[#b18597]" />
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-[#2b201a] max-w-2xl mx-auto leading-tight tracking-tight">
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
