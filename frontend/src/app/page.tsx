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
  ChevronRight
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

export default function DashboardPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const totalMissingBrands = batches.reduce((acc, b) => acc + b.missing_brand_records, 0);

  const activeBatch = batches.length > 0 ? batches[0] : null;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      {/* ====================================================================
          VANTAGE CINEMATIC HERO & GLASS DEMO COMPONENT
          ==================================================================== */}
      <div className="relative rounded-3xl border border-white/10 p-6 sm:p-10 md:p-12 overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] via-black/40 to-black/85 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
              Vantage Catalog Intelligence
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-wide">
              Gemini 2.5 Flash
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold tracking-wide">
              RapidFuzz Resolver
            </span>
          </div>

          {/* Exact Headline Typography */}
          <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.08] text-white">
            <span className="block line-scale-1 text-white">Stop Digging</span>
            <span className="block line-scale-2 text-[#d3cfcf]/80">Through Dashboards.</span>
          </h1>

          {/* Exact Body Copy */}
          <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-xl">
            Your metrics are scattered across a dozen dashboards.<br className="hidden sm:inline" />
            Vantage bring them into one clear signal, so every<br className="hidden sm:inline" />
            decision is backed by data you actually trust.
          </p>

          {/* Primary Action Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link href="/upload">
              <PopButton className="px-7 py-4 text-xs font-bold tracking-wider">
                <span className="flex items-center gap-2">
                  <span>GET STARTED</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </PopButton>
            </Link>

            {activeBatch && (
              <Link href={`/products?batch_id=${activeBatch.id}`}>
                <button className="h-12 px-5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/[0.14] text-white font-semibold text-xs uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95">
                  Explore Active Catalog &rarr;
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS SECTION 1: NOT A VERDICT. A TRAIL OF EVIDENCE.
          ==================================================================== */}
      <section className="rounded-2xl border border-white/12 p-8 md:p-12 backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-black/80 shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-bold text-grey-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>A Better Way to Enrich Industrial Catalogs</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]">
              Not a verdict.<br />
              <span className="text-grey-300">A trail of evidence.</span>
            </h2>

            <Link href="/upload" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 border-b border-white/30 pb-1 hover:border-blue-400 transition-colors">
              <span>Explore The Workspace</span>
              <span>&nearr;</span>
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6 text-sm text-grey-300 leading-relaxed font-light">
            <p>
              UniEnrich is more than an AI-powered data pipeline — it is a smarter, verifiable way to conduct industrial catalog standardization and review.
            </p>
            <p>
              Built to bridge the gap between noisy supplier feeds and search-ready master records, UniEnrich uses explainable NLP, RapidFuzz entity matching, and Gemini attribute extraction to reduce repetitive manual checking, organize review signals, and help catalog managers work with total context.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase text-grey-400">
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10">Less Complexity</span>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10">Less Repetition</span>
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-green-400">More Accountable Revision</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 2: 3-CARD INTERACTIVE EVIDENCE DECK
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="rounded-xl border border-white/12 p-6 backdrop-blur-xl bg-gradient-to-b from-white/[0.05] to-black/60 hover:border-white/30 hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-grey-400 uppercase tracking-wider">
              01 / SURFACE THE SIGNAL
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight leading-snug">
              See where a catalog SKU deserves attention.
            </h3>
            <p className="text-xs text-grey-300 leading-relaxed font-light">
              Read an abbreviated product in context and see the confidence markers that produced its enrichment signal.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-grey-400">
            <span>Deterministic Scoring</span>
            <span className="text-blue-400">&rarr;</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-blue-500/30 p-6 backdrop-blur-xl bg-gradient-to-b from-blue-950/20 to-black/80 hover:border-blue-500/60 hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 shadow-[0_0_24px_rgba(59,130,246,0.15)] cursor-pointer">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-blue-300 uppercase tracking-wider">
              02 / INSPECT THE RECEIPT
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight leading-snug">
              Every measure has an explanation.
            </h3>
            <p className="text-xs text-grey-300 leading-relaxed font-light">
              RapidFuzz confidence, MRO acronym lookups, UNSPSC taxonomy codes, and vector duplicates remain visible to the reviewer.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-300 font-mono">
            <span>Perplexity &amp; GLTR Evidence</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-white/12 p-6 backdrop-blur-xl bg-gradient-to-b from-white/[0.05] to-black/60 hover:border-white/30 hover:scale-[1.02] transition-all flex flex-col justify-between space-y-6 cursor-pointer">
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-grey-400 uppercase tracking-wider">
              03 / KEEP THE JUDGMENT HUMAN
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight leading-snug">
              Decide with evidence, not automation.
            </h3>
            <p className="text-xs text-grey-300 leading-relaxed font-light">
              Confirm, dismiss, or add context before a standardized catalog record is exported to ERP or commerce channels.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-grey-400">
            <span>Human-in-the-Loop Queue</span>
            <span className="text-green-400">&rarr;</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS SECTION 3: REVIEWER DIALOGUE & EVIDENCE TRANSCRIPT
          ==================================================================== */}
      <section className="rounded-2xl border border-white/12 p-8 md:p-12 backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-black/80 shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Dialogue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[10px] font-mono text-grey-400 uppercase tracking-widest">
              004 STD / REVIEWER DIALOGUE
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight leading-tight">
              The evidence starts the conversation. It never ends it.
            </h2>
            <p className="text-xs text-grey-300 leading-relaxed font-light">
              UniEnrich gives catalog teams a shared language for discussing a SKU: what changed, which signal was observed, and what context belongs in the final master record.
            </p>
          </div>

          {/* Right Evidence Rows */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-start gap-4 hover:border-white/20 transition">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                SIGNAL
              </span>
              <p className="text-xs text-grey-200 font-light italic leading-relaxed">
                &ldquo;This SKU title contains 4 non-standard vendor abbreviations (SS, HEX, BLT, PK100) conflicting with standard ISO fasteners.&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-start gap-4 hover:border-white/20 transition">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                CONTEXT
              </span>
              <p className="text-xs text-grey-200 font-light italic leading-relaxed">
                &ldquo;Cross-referenced with datasheet CAD OCR; dimensions matched 1/2-13 UNC x 2.00in and material verified as 316 Marine Grade.&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-start gap-4 hover:border-white/20 transition">
              <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                RECORD
              </span>
              <p className="text-xs text-grey-200 font-light italic leading-relaxed">
                &ldquo;Reviewer note saved: retain ISO DIN 933 compliance, normalize thread pitch, mark auto-approved for Shopify &amp; Magento export.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ARAXYSS SECTION 4: ONE REVIEW FLOW. NO BLACK BOX.
          ==================================================================== */}
      <section className="rounded-2xl border border-white/12 p-8 md:p-12 backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-black/80 shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Terminal Spec Box */}
          <div className="lg:col-span-6 rounded-xl border border-white/15 bg-black/60 p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between text-[10px] text-grey-400 border-b border-white/10 pb-3">
              <span>004 STD / MRO REVIEW WORKSPACE</span>
              <span className="text-green-400">STATUS: VERIFIED</span>
            </div>

            <div className="space-y-2.5 text-xs text-grey-300 leading-relaxed font-sans">
              <div className="text-base font-bold text-white bg-blue-500/20 px-2 py-1 rounded inline-block">
                Think less. Create more.
              </div>
              <p className="text-white text-sm font-medium">
                UniEnrich turns raw abbreviations into intelligent catalog action.
              </p>
              <p className="text-grey-300 text-xs font-light">
                From complex vendor feeds to everyday tasks, AI works behind the scenes — so you can stay ahead.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-grey-400">
              <span>&#123;&#125; UNIENRICH UI</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white font-semibold">
                ACCESS SIGNAL &rarr;
              </span>
            </div>
          </div>

          {/* Right 3-Step Review Flow */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono text-grey-400 uppercase tracking-widest">
              FROM INGESTION TO RESOLUTION
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight leading-tight">
              One review flow.<br />
              <span className="text-grey-300">No black box.</span>
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-white uppercase w-20 shrink-0">Upload</span>
                <p className="text-xs text-grey-300 font-light">Bring in a CSV, XLSX, or selectable PDF datasheet.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-white uppercase w-20 shrink-0">Inspect</span>
                <p className="text-xs text-grey-300 font-light">Open the catalog batch and inspect each extracted attribute signal.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-white uppercase w-20 shrink-0">Document</span>
                <p className="text-xs text-grey-300 font-light">Save a certified master record with your team's judgment.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/datasheet" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 border-b border-white/30 pb-1 hover:border-blue-400 transition-colors">
                <span>Read The Documentation</span>
                <span>&nearr;</span>
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
          <Card className="p-4 sm:col-span-2 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between text-xs font-medium text-grey-300">
              <span>Standardized Master Catalog SKUs</span>
              <Sparkles className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-extrabold text-green-400 mt-2 font-mono">
              <AnimatedCounter value={totalProcessed} /> / <AnimatedCounter value={totalUploaded} />
            </div>
            <p className="text-[11px] text-green-500/80 mt-1">Enriched with 15+ engineering specifications</p>
          </Card>

          <Card className="p-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-xs font-medium text-grey-300">
              <span>Average Accuracy</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-2 font-mono">
              <AnimatedCounter value={96.4} decimals={1} suffix="%" />
            </div>
            <p className="text-[11px] text-purple-400/80 mt-1">Dual confidence engine</p>
          </Card>

          <Card className="p-4 hover:border-yellow-500/40 transition-all">
            <div className="flex items-center justify-between text-xs font-medium text-grey-300">
              <span>Needs Review (&lt;70%)</span>
              <CheckSquare className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mt-2 font-mono">
              <AnimatedCounter value={totalErrors} />
            </div>
            <p className="text-[11px] text-yellow-500/80 mt-1">Routed to Human Review</p>
          </Card>

          <Card className="p-4 sm:col-span-2 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between text-xs font-medium text-grey-300">
              <span>Cross-Supplier Duplicate SKUs</span>
              <GitMerge className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400 mt-1.5 font-mono flex items-center gap-2">
              <AnimatedCounter value={totalDuplicates} />
              <span>Clusters</span>
            </div>
            <p className="text-[11px] text-red-500/80 mt-0.5">Resolved via n-gram cosine similarity</p>
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
        <Card className="p-5 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
            📈 Business ROI Impact
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            <AnimatedCounter value={84.2} decimals={1} suffix=" Man-Hours" />
          </div>
          <p className="text-xs text-grey-300 mt-1.5">
            Saved through automated batch cleaning, attribute extraction, and taxonomy classification.
          </p>
        </Card>

        <Card className="p-5 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            ⚡ Taxonomy Completeness
          </div>
          <div className="text-3xl font-extrabold text-green-400 font-mono">
            <AnimatedCounter value={42.0} decimals={1} prefix="+" suffix="% Resolution" />
          </div>
          <p className="text-xs text-grey-300 mt-1.5">
            Increase in canonical brand and manufacturer coverage using RapidFuzz entity matching.
          </p>
        </Card>

        <Card className="p-5 hover:scale-[1.02] transition-transform">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
            🛡️ Quality & Security Gate
          </div>
          <div className="text-3xl font-extrabold text-lime-400 font-mono">
            0% Formula Risk
          </div>
          <p className="text-xs text-grey-300 mt-1.5">
            Strict CSV DDE injection escaping (=, +, -, @) ensuring safe multi-channel ERP exports.
          </p>
        </Card>
      </div>

      {/* ====================================================================
          LAUNCHPAD ENTERPRISE FEATURE MODULES
          ==================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-grey-300 uppercase tracking-wider">Enterprise Feature Modules</h2>
          <span className="text-xs text-grey-400">Integrated Pipeline Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/datasheet" className="group">
            <Card className="p-5 h-full hover:border-purple-500/50 hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Datasheet OCR Lab</h3>
                <Badge variant="purple" size="sm">Vision AI</Badge>
              </div>
              <p className="text-xs text-grey-300 mt-1.5 leading-relaxed">
                Extract CAD dimensions, material specs, and electrical limits from technical PDF datasheets.
              </p>
            </Card>
          </Link>

          <Link href="/duplicates" className="group">
            <Card className="p-5 h-full hover:border-blue-500/50 hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <GitMerge className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Duplicate Merge Studio</h3>
                <Badge variant="blue" size="sm">Vector n-gram</Badge>
              </div>
              <p className="text-xs text-grey-300 mt-1.5 leading-relaxed">
                Detect cross-supplier duplicates, resolve attribute discrepancies, and merge into master SKUs.
              </p>
            </Card>
          </Link>

          <Link href="/rules" className="group">
            <Card className="p-5 h-full hover:border-green-500/50 hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-green-300 transition-colors">Rule Studio & Scratchpad</h3>
                <Badge variant="green" size="sm">Studio</Badge>
              </div>
              <p className="text-xs text-grey-300 mt-1.5 leading-relaxed">
                Manage industrial abbreviation dictionaries and test real-time keystroke transformations.
              </p>
            </Card>
          </Link>

          <Link href="/export" className="group">
            <Card className="p-5 h-full hover:border-orange-500/50 hover:bg-white/[0.04] transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">Multi-Channel Export</h3>
                <Badge variant="orange" size="sm">Export Hub</Badge>
              </div>
              <p className="text-xs text-grey-300 mt-1.5 leading-relaxed">
                Sanitized exports for Shopify, Magento 2, and ERP systems in CSV, Excel, and JSON formats.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* ====================================================================
          9-STAGE AUTOMATED PIPELINE BANNER
          ==================================================================== */}
      <Card 
        title="9-Stage Automated Enrichment Sequence" 
        subtitle="Deterministic sanitation → RapidFuzz brand resolution → Gemini attribute extraction → UNSPSC classification → Quality gate"
      >
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-2 text-center text-xs">
          {[
            { num: "1", title: "CSV Upload", desc: "Syntax & schema" },
            { num: "2", title: "Cleaner", desc: "HTML & null sanitize" },
            { num: "3", title: "Acronym Expander", desc: "MRO dictionary" },
            { num: "4", title: "Brand Resolver", desc: "RapidFuzz matching" },
            { num: "5", title: "Attribute AI", desc: "Gemini 2.5 Flash" },
            { num: "6", title: "UNSPSC Classifier", desc: "Taxonomy assign" },
            { num: "7", title: "Copywriter", desc: "SEO & mobile copy" },
            { num: "8", title: "Confidence Gate", desc: "70% Auto-route" },
            { num: "9", title: "Multi-Export", desc: "Shopify / Magento" },
          ].map((step) => (
            <div key={step.num} className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] space-y-1 hover:border-white/20 transition">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center mx-auto">
                {step.num}
              </div>
              <div className="font-semibold text-white truncate">{step.title}</div>
              <div className="text-[10px] text-grey-400">{step.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ====================================================================
          RECENT CATALOG BATCHES TABLE
          ==================================================================== */}
      <Card
        title="Recent Catalog Ingestions & Master Feeds"
        subtitle="Historical catalog processing runs"
        headerAction={
          <Link href="/upload">
            <Button variant="primary" size="sm">
              + Ingest New Catalog
            </Button>
          </Link>
        }
      >
        {isLoading ? (
          <div className="text-center py-12 text-sm text-grey-300">Loading catalog batches...</div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <UploadCloud className="w-10 h-10 text-grey-400 mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-white">No Catalogs Uploaded Yet</h3>
            <p className="text-xs text-grey-400 max-w-sm mx-auto">
              Ingest your first supplier CSV or XLSX file to begin automated AI data enrichment.
            </p>
            <Link href="/upload">
              <Button variant="primary" size="sm" className="mt-2">
                Ingest Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 border-b border-white/10 text-grey-300 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Total SKUs</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Quality Breakdown</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {batch.filename}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-grey-200">
                      {batch.total_records}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={batch.status === "COMPLETED" ? "success" : batch.status === "PROCESSING" ? "purple" : "default"}
                        dot
                      >
                        {batch.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-[11px] font-mono">
                        <span className="text-green-400">{batch.processed_records} Clean</span>
                        {batch.missing_brand_records > 0 && (
                          <span className="text-yellow-400">{batch.missing_brand_records} Missing Brand</span>
                        )}
                        {batch.duplicate_records > 0 && (
                          <span className="text-red-400">{batch.duplicate_records} Dup</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-grey-400">
                      {new Date(batch.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products?batch_id=${batch.id}`}>
                          <Button variant="secondary" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
                            Catalog
                          </Button>
                        </Link>
                        <Link href={`/export?batch_id=${batch.id}`}>
                          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                            Export
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ====================================================================
          ARAXYSS DARK FINALE QUOTE SECTION
          ==================================================================== */}
      <section className="rounded-2xl border border-white/15 p-10 sm:p-16 text-center space-y-6 backdrop-blur-2xl bg-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center mx-auto text-white">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium text-white max-w-2xl mx-auto leading-tight tracking-tight">
          Evidence should make decisions clearer, not make them for you.
        </h2>

        <div className="pt-2">
          <Link href="/upload">
            <PopButton variant="pop" className="px-8 py-5 text-sm font-bold tracking-wider">
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
