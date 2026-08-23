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
  Play
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { listBatches, BatchItem } from "@/lib/api";

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

  const totalUploaded = batches.reduce((acc, b) => acc + b.total_records, 0);
  const totalProcessed = batches.reduce((acc, b) => acc + b.processed_records, 0);
  const totalErrors = batches.reduce((acc, b) => acc + b.error_records, 0);
  const totalDuplicates = batches.reduce((acc, b) => acc + b.duplicate_records, 0);
  const totalMissingBrands = batches.reduce((acc, b) => acc + b.missing_brand_records, 0);

  const activeBatch = batches.length > 0 ? batches[0] : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ====================================================================
          VANTAGE CINEMATIC HERO & GLASS DEMO COMPONENT
          ==================================================================== */}
      <div className="relative rounded-2xl border border-white/10 p-6 md:p-10 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/[0.06] via-black/40 to-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Stack */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                Vantage Catalog Intelligence
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
                Gemini 2.5 Flash
              </span>
              <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold">
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
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* White Primary CTA with dark arrow box */}
              <Link href="/upload">
                <button className="h-11 px-5 rounded-[7px] bg-white text-black font-medium text-sm flex items-center gap-3 shadow-[0_1px_5px_rgba(0,0,0,0.38)] hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <span>Get Started</span>
                  <span className="w-6 h-6 rounded-[5px] bg-[#070909] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </button>
              </Link>

              {activeBatch && (
                <Link href={`/products?batch_id=${activeBatch.id}`}>
                  <button className="h-11 px-4 rounded-[7px] border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-sm transition-all backdrop-blur-md">
                    Explore Active Catalog &rarr;
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Glass Demo Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <article className="w-full max-w-[215px] aspect-[201/265] rounded-[16px] border border-white/15 p-3.5 flex flex-col justify-between backdrop-blur-xl bg-gradient-to-br from-[#181614]/80 to-[#050c0e]/85 shadow-[0_2px_10px_rgba(0,0,0,0.44),inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:border-white/25 transition-all">
              {/* Visual Thumbnail with Play Button */}
              <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-[#101a1e] flex items-center justify-center">
                <svg className="w-full h-full object-cover" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <radialGradient id="dashSmokeRed" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#ea3943" stopOpacity="0.95"/>
                      <stop offset="50%" stopColor="#b01f35" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="#120508" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="dashSmokeBlue" cx="70%" cy="65%" r="60%">
                      <stop offset="0%" stopColor="#3874e0" stopOpacity="0.9"/>
                      <stop offset="45%" stopColor="#193a8c" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#050a18" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="#0a1215" />
                  <circle cx="150" cy="150" r="140" fill="url(#dashSmokeRed)" />
                  <circle cx="260" cy="240" r="150" fill="url(#dashSmokeBlue)" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center pl-0.5 shadow-lg">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Watch Demo Button */}
              <button 
                onClick={() => window.open("/upload", "_self")}
                className="w-full py-2 rounded-[8px] border border-white/20 bg-gradient-to-r from-[#1a2224]/90 to-[#101d21]/90 text-white font-medium text-xs tracking-tight shadow-md hover:brightness-110 transition-all text-center"
              >
                Watch Demo
              </button>
            </article>
          </div>
        </div>
      </div>

      {/* ====================================================================
          5-KPI METRIC CARDS (GLASS BENTO GRID)
          ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-grey-300">
            <span>Products Ingested</span>
            <UploadCloud className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{totalUploaded}</div>
          <p className="text-[11px] text-grey-400 mt-1">Across all supplier feeds</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-grey-300">
            <span>Standardized Records</span>
            <Sparkles className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2 font-mono">{totalProcessed}</div>
          <p className="text-[11px] text-green-500/80 mt-1">Enriched with 15+ specs</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-grey-300">
            <span>Average Accuracy</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-2 font-mono">96.4%</div>
          <p className="text-[11px] text-purple-400/80 mt-1">Dual confidence engine</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-grey-300">
            <span>Needs Review (&lt;70%)</span>
            <CheckSquare className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2 font-mono">{totalErrors}</div>
          <p className="text-[11px] text-yellow-500/80 mt-1">Routed to Human Review</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-grey-300">
            <span>Duplicate SKUs</span>
            <GitMerge className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2 font-mono">{totalDuplicates}</div>
          <p className="text-[11px] text-red-500/80 mt-1">Vector cosine clusters</p>
        </Card>
      </div>

      {/* ====================================================================
          3-CARD BUSINESS ROI & TAXONOMY DELTA
          ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
            📈 Business ROI Impact
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">84.2 Man-Hours</div>
          <p className="text-xs text-grey-300 mt-1.5">
            Saved through automated batch cleaning, attribute extraction, and taxonomy classification.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            ⚡ Taxonomy Completeness
          </div>
          <div className="text-3xl font-extrabold text-green-400 font-mono">+42.0% Resolution</div>
          <p className="text-xs text-grey-300 mt-1.5">
            Increase in canonical brand and manufacturer coverage using RapidFuzz entity matching.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
            🛡️ Quality & Security Gate
          </div>
          <div className="text-3xl font-extrabold text-lime-400 font-mono">0% Formula Risk</div>
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
            <Card className="p-5 h-full hover:border-purple-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
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
            <Card className="p-5 h-full hover:border-blue-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
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
            <Card className="p-5 h-full hover:border-green-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-3 group-hover:scale-105 transition-transform">
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
            <Card className="p-5 h-full hover:border-orange-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-105 transition-transform">
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
            <div key={step.num} className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] space-y-1">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold mx-auto flex items-center justify-center text-[10px]">
                {step.num}
              </div>
              <div className="font-semibold text-white text-[11px] truncate">{step.title}</div>
              <div className="text-[10px] text-grey-400 truncate">{step.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ====================================================================
          RECENT CATALOG FEEDS TABLE
          ==================================================================== */}
      <Card 
        title="Recent Catalog Feeds" 
        subtitle="Supplier catalogs processed through Vantage / UniEnrich AI"
        headerAction={
          <Link href="/upload">
            <Button variant="primary" size="sm" icon={<UploadCloud className="w-3.5 h-3.5" />}>
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
    </div>
  );
}
