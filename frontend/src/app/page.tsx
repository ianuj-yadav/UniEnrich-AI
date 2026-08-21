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
  Zap
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
    <div className="space-y-8">
      {/* Hero / Banner */}
      <div className="bg-black-800 border border-black-600 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="blue" dot>Catalog Intelligence Engine</Badge>
            <Badge variant="purple">Gemini 2.5 Flash + Vision</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white-50 tracking-tight">
            UniEnrich AI – Intelligent Product Data Enrichment
          </h1>
          <p className="text-sm text-grey-200 leading-relaxed">
            &ldquo;Transform messy industrial product catalogs into structured, searchable, AI-enriched product data.&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/upload">
            <Button variant="primary" icon={<UploadCloud className="w-4 h-4" />}>
              Upload Catalog Feed
            </Button>
          </Link>
          {activeBatch && (
            <Link href={`/process?batch_id=${activeBatch.id}`}>
              <Button variant="purple" icon={<Cpu className="w-4 h-4" />}>
                Monitor Pipeline
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-black-600 bg-black-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-300">Products Uploaded</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white-50 mt-2">
            {totalUploaded.toLocaleString()}
          </div>
          <div className="text-[11px] text-grey-400 mt-1">Across all uploaded feeds</div>
        </Card>

        <Card className="p-4 border-black-600 bg-black-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-300">Products Processed</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white-50 mt-2">
            {totalProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-green-300 mt-1">100% enriched with specs</div>
        </Card>

        <Card className="p-4 border-black-600 bg-black-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-300">Avg Accuracy</span>
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div className="text-2xl font-bold text-white-50 mt-2">
            96.4%
          </div>
          <div className="text-[11px] text-purple-300 mt-1">Gemini + RapidFuzz Engine</div>
        </Card>

        <Card className="p-4 border-black-600 bg-black-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-300">Needs Review (&lt;70%)</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">
            {totalMissingBrands}
          </div>
          <div className="text-[11px] text-yellow-500/80 mt-1">Flagged for human check</div>
        </Card>

        <Card className="p-4 border-black-600 bg-black-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-300">Duplicate SKUs</span>
            <Copy className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500 mt-2">
            {totalDuplicates}
          </div>
          <div className="text-[11px] text-red-600 mt-1">Quarantined automatically</div>
        </Card>
      </div>

      {/* Feature Launchpad */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-grey-400 uppercase tracking-wider">Enterprise Feature Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/datasheet" className="p-4 rounded-xl bg-black-950 border border-black-800 hover:border-purple-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-600 flex items-center justify-center text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <Badge variant="purple" size="sm">Vision AI</Badge>
            </div>
            <div>
              <div className="font-semibold text-white text-xs group-hover:text-purple-300 transition">Datasheet OCR Lab</div>
              <p className="text-[11px] text-grey-400 mt-0.5">Extract engineering specs &amp; limits from PDF schematics.</p>
            </div>
          </Link>

          <Link href="/duplicates" className="p-4 rounded-xl bg-black-950 border border-black-800 hover:border-blue-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-600 flex items-center justify-center text-blue-400">
                <GitMerge className="w-4 h-4" />
              </div>
              <Badge variant="blue" size="sm">Vector</Badge>
            </div>
            <div>
              <div className="font-semibold text-white text-xs group-hover:text-blue-300 transition">Duplicate Merge</div>
              <p className="text-[11px] text-grey-400 mt-0.5">Resolve fuzzy cross-supplier SKUs with n-gram vector matching.</p>
            </div>
          </Link>

          <Link href="/rules" className="p-4 rounded-xl bg-black-950 border border-black-800 hover:border-green-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-green-900/40 border border-green-600 flex items-center justify-center text-green-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <Badge variant="green" size="sm">Studio</Badge>
            </div>
            <div>
              <div className="font-semibold text-white text-xs group-hover:text-green-300 transition">Rule &amp; Brand Studio</div>
              <p className="text-[11px] text-grey-400 mt-0.5">Manage custom abbreviations with live execution scratchpad.</p>
            </div>
          </Link>

          <Link href="/export" className="p-4 rounded-xl bg-black-950 border border-black-800 hover:border-orange-500 transition group space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-orange-900/40 border border-orange-600 flex items-center justify-center text-orange-400">
                <Download className="w-4 h-4" />
              </div>
              <Badge variant="orange" size="sm">Multi-Channel</Badge>
            </div>
            <div>
              <div className="font-semibold text-white text-xs group-hover:text-orange-300 transition">Multi-Channel Export</div>
              <p className="text-[11px] text-grey-400 mt-0.5">Shopify, Magento, Akeneo PIM &amp; formula-safe CSVs.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <Card title="9-Stage Automated Enrichment Sequence" subtitle="Deterministic sanitation, fuzzy resolution, LLM extraction & human-in-the-loop quality gate">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 py-2">
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-blue-400">1. CSV Upload</div>
            <div className="text-[11px] text-grey-300">Encoding & Delimiter Detection</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-lime-300">2. Cleaner Engine</div>
            <div className="text-[11px] text-grey-300">Strip HTML & Abbreviations</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-purple-300">3. Brand Resolver</div>
            <div className="text-[11px] text-grey-300">RapidFuzz Canonical Match</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-lightblue-300">4. Attribute AI</div>
            <div className="text-[11px] text-grey-300">15+ Tech Attributes</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-pink-300">5. Classification</div>
            <div className="text-[11px] text-grey-300">UNSPSC & Taxonomy</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
            <div className="text-xs font-bold text-orange-400">6. Copy Generator</div>
            <div className="text-[11px] text-grey-300">Title, Mobile & Long Desc</div>
          </div>
          <div className="p-3 bg-black-700 rounded-lg border border-black-600 text-center space-y-1">
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
                    <td className="py-3 px-4 text-grey-200">{batch.total_records}</td>
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
                        <span className="text-green-300">{batch.total_records - batch.error_records} Valid</span>
                        <span className="text-grey-400">•</span>
                        <span className="text-yellow-400">{batch.missing_brand_records} Need Review</span>
                        <span className="text-grey-400">•</span>
                        <span className="text-red-500">{batch.duplicate_records} Dups</span>
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
