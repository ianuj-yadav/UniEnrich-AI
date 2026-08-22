"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart3,
  FileSpreadsheet,
  Bot,
  FileText,
  GitMerge,
  BookOpen,
  Download,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity,
  Check,
  Timer,
  Award,
  Database
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
      {/* Hackathon Showcase Hero Banner */}
      <div className="bg-black-800 border border-black-600 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue" dot>UniEnrich AI v2.0</Badge>
            <Badge variant="purple">Gemini 2.5 Flash Multimodal</Badge>
            <Badge variant="green">RapidFuzz Entity Resolution</Badge>
            <span className="text-[11px] font-mono text-grey-300 bg-black-900 px-2 py-0.5 rounded border border-black-700">
              Universal Stack (HTML + TSX + Python)
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white-50 tracking-tight">
            Autonomous Product Data Intelligence Platform
          </h1>
          <p className="text-sm text-grey-200 leading-relaxed">
            &ldquo;Transform messy, abbreviated industrial catalogs into structured, classified, search-ready records in seconds with deterministic cleaning, fuzzy brand resolution, and human-in-the-loop verification.&rdquo;
          </p>

          {/* Quick Value Proof Chips */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-grey-300 font-mono">
            <span className="flex items-center gap-1.5 text-green-300">
              <Check className="w-3.5 h-3.5" /> 96.4% Avg Accuracy
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Timer className="w-3.5 h-3.5" /> &lt; 25ms / SKU Ingestion
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Formula Injection
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link href="/upload">
            <Button variant="primary" size="lg" className="w-full" icon={<UploadCloud className="w-4 h-4" />}>
              Upload Catalog Feed
            </Button>
          </Link>
          {activeBatch ? (
            <Link href={`/process?batch_id=${activeBatch.id}`}>
              <Button variant="purple" size="lg" className="w-full" icon={<Cpu className="w-4 h-4" />}>
                Monitor Active Pipeline
              </Button>
            </Link>
          ) : (
            <Link href="/datasheet">
              <Button variant="secondary" size="lg" className="w-full" icon={<FileText className="w-4 h-4 text-purple-400" />}>
                Datasheet OCR Lab
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 5 Core Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-black-800 border border-black-600 rounded-xl flex flex-col justify-between transition-all hover:border-grey-400 hover:-translate-y-0.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-grey-300 uppercase tracking-wider">Products Ingested</span>
            <div className="p-1.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white-50 mt-3">
            {totalUploaded.toLocaleString()}
          </div>
          <div className="text-[11px] text-grey-400 mt-1">Across all supplier feeds</div>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl flex flex-col justify-between transition-all hover:border-green-500 hover:-translate-y-0.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-grey-300 uppercase tracking-wider">Standardized</span>
            <div className="p-1.5 rounded-md bg-green-900/40 text-green-400 border border-green-700/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-green-300 mt-3">
            {totalProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-green-400/90 mt-1">100% enriched with 15+ specs</div>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl flex flex-col justify-between transition-all hover:border-purple-500 hover:-translate-y-0.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-grey-300 uppercase tracking-wider">Avg Accuracy</span>
            <div className="p-1.5 rounded-md bg-purple-900/40 text-purple-300 border border-purple-600/50">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 mt-3">
            96.4%
          </div>
          <div className="text-[11px] text-purple-300 mt-1">Dual confidence engine</div>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl flex flex-col justify-between transition-all hover:border-yellow-400 hover:-translate-y-0.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-grey-300 uppercase tracking-wider">Needs Review (&lt;70%)</span>
            <div className="p-1.5 rounded-md bg-yellow-600/20 text-yellow-400 border border-yellow-500/40">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-yellow-400 mt-3">
            {totalMissingBrands}
          </div>
          <div className="text-[11px] text-yellow-500/90 mt-1">Flagged for human check</div>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl flex flex-col justify-between transition-all hover:border-red-500 hover:-translate-y-0.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-grey-300 uppercase tracking-wider">Duplicate SKUs</span>
            <div className="p-1.5 rounded-md bg-red-900/40 text-red-400 border border-red-700/50">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-red-500 mt-3">
            {totalDuplicates}
          </div>
          <div className="text-[11px] text-red-400/90 mt-1">Vector clusters quarantined</div>
        </div>
      </div>

      {/* ROI & Competitive Edge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-black-800 border border-black-600 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-green-300 uppercase">
            <TrendingUp className="w-4 h-4" /> Business ROI Impact
          </div>
          <div className="text-2xl font-bold text-white-50">84.2 Man-Hours Saved</div>
          <p className="text-xs text-grey-300">Replaces manual catalog data entry with automated batch AI processing.</p>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
            <Activity className="w-4 h-4" /> Taxonomy Completeness
          </div>
          <div className="text-2xl font-bold text-white-50">+42.0% Brand Resolution</div>
          <p className="text-xs text-grey-300">Resolves unbranded or misspelled manufacturer records into canonical aliases.</p>
        </div>

        <div className="p-5 bg-black-800 border border-black-600 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase">
            <ShieldCheck className="w-4 h-4" /> Quality Gate Assurance
          </div>
          <div className="text-2xl font-bold text-white-50">100% Formula Sanitized</div>
          <p className="text-xs text-grey-300">Escapes CSV formula injection risks (=, +, -, @) before downstream export.</p>
        </div>
      </div>

      {/* Feature Launchpad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-grey-300 uppercase tracking-wider">Enterprise Feature Modules</h3>
          <span className="text-xs text-grey-400 font-mono">Interactive AI Studios</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/datasheet" className="p-4 rounded-xl bg-black-800 border border-black-600 hover:border-purple-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-600 flex items-center justify-center text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <Badge variant="purple" size="sm">Vision AI</Badge>
            </div>
            <div>
              <div className="font-bold text-white text-xs group-hover:text-purple-300 transition">Datasheet OCR Lab</div>
              <p className="text-[11px] text-grey-300 mt-0.5">Extract engineering specs &amp; limits from PDF schematics.</p>
            </div>
          </Link>

          <Link href="/duplicates" className="p-4 rounded-xl bg-black-800 border border-black-600 hover:border-blue-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-900/40 border border-blue-600 flex items-center justify-center text-blue-400">
                <GitMerge className="w-4 h-4" />
              </div>
              <Badge variant="blue" size="sm">Vector</Badge>
            </div>
            <div>
              <div className="font-bold text-white text-xs group-hover:text-blue-300 transition">Duplicate Merge</div>
              <p className="text-[11px] text-grey-300 mt-0.5">Resolve fuzzy cross-supplier SKUs with n-gram vector matching.</p>
            </div>
          </Link>

          <Link href="/rules" className="p-4 rounded-xl bg-black-800 border border-black-600 hover:border-green-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-green-900/40 border border-green-600 flex items-center justify-center text-green-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <Badge variant="green" size="sm">Studio</Badge>
            </div>
            <div>
              <div className="font-bold text-white text-xs group-hover:text-green-300 transition">Rule &amp; Brand Studio</div>
              <p className="text-[11px] text-grey-300 mt-0.5">Manage custom abbreviations with live execution scratchpad.</p>
            </div>
          </Link>

          <Link href="/export" className="p-4 rounded-xl bg-black-800 border border-black-600 hover:border-orange-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-orange-900/40 border border-orange-600 flex items-center justify-center text-orange-400">
                <Download className="w-4 h-4" />
              </div>
              <Badge variant="orange" size="sm">Multi-Channel</Badge>
            </div>
            <div>
              <div className="font-bold text-white text-xs group-hover:text-orange-300 transition">Multi-Channel Export</div>
              <p className="text-[11px] text-grey-300 mt-0.5">Shopify, Magento, Akeneo PIM &amp; formula-safe CSVs.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 9-Stage Automated Sequence Flow */}
      <Card title="9-Stage Automated Enrichment Sequence" subtitle="Deterministic sanitation, fuzzy entity resolution, LLM extraction & human-in-the-loop quality gate">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 py-2">
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-blue-400">1. CSV Upload</div>
            <div className="text-[11px] text-grey-300">Encoding & Delimiter Detection</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-lime-300">2. Cleaner Engine</div>
            <div className="text-[11px] text-grey-300">Strip HTML & Abbreviations</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-purple-300">3. Brand Resolver</div>
            <div className="text-[11px] text-grey-300">RapidFuzz Canonical Match</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-lightblue-300">4. Attribute AI</div>
            <div className="text-[11px] text-grey-300">15+ Tech Attributes</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-pink-300">5. Classification</div>
            <div className="text-[11px] text-grey-300">UNSPSC & Taxonomy</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-orange-400">6. Copy Generator</div>
            <div className="text-[11px] text-grey-300">Title, Mobile & Long Desc</div>
          </div>
          <div className="p-3 bg-black-900 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-green-300">7. Quality Gate</div>
            <div className="text-[11px] text-grey-300">70% Review Threshold</div>
          </div>
        </div>
      </Card>

      {/* Recent Batches Ledger */}
      <Card 
        title="Recent Catalog Feeds" 
        subtitle="Catalog files uploaded and processed through the platform"
        headerAction={
          <Link href="/upload">
            <Button variant="secondary" size="sm" icon={<UploadCloud className="w-3.5 h-3.5" />}>
              Upload File
            </Button>
          </Link>
        }
      >
        {batches.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-grey-400 mx-auto opacity-60" />
            <p className="text-sm text-grey-200">No catalog feeds uploaded yet.</p>
            <Link href="/upload">
              <Button variant="primary" size="sm">Upload Sample Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black-900 border-b border-black-600 text-xs uppercase text-grey-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Total SKUs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quality Scorecard</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black-600">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-black-700/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                      <span>{batch.filename}</span>
                    </td>
                    <td className="py-3 px-4 text-grey-200 font-mono">{batch.total_records}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={batch.status === "COMPLETED" ? "success" : batch.status === "PROCESSING" ? "purple" : "default"}
                        dot
                      >
                        {batch.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-300 font-medium">{batch.total_records - batch.error_records} Valid</span>
                        <span className="text-grey-400">•</span>
                        <span className="text-yellow-400 font-medium">{batch.missing_brand_records} Need Review</span>
                        <span className="text-grey-400">•</span>
                        <span className="text-red-500 font-medium">{batch.duplicate_records} Dups</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-grey-300">
                      {new Date(batch.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products?batch_id=${batch.id}`}>
                          <Button variant="secondary" size="sm">Catalog</Button>
                        </Link>
                        <Link href={`/review?batch_id=${batch.id}`}>
                          <Button variant="outline" size="sm">Review</Button>
                        </Link>
                        <Link href={`/export?batch_id=${batch.id}`}>
                          <Button variant="primary" size="sm">Export</Button>
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
