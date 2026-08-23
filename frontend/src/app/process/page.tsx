"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Cpu, 
  CheckCircle2, 
  Layers, 
  CheckSquare, 
  BarChart3, 
  Download, 
  Terminal, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { getEnrichmentProgress, listBatches, BatchItem } from "@/lib/api";

export const dynamic = "force-dynamic";

function ProcessContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batchId, setBatchId] = useState<string | null>(batchIdFromUrl);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [progressData, setProgressData] = useState<BatchItem | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  // Load available batches if no ID specified
  useEffect(() => {
    async function loadBatches() {
      try {
        const list = await listBatches();
        setBatches(list);
        if (!batchId && list.length > 0) {
          setBatchId(list[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadBatches();
  }, [batchId]);

  // Poll progress data
  useEffect(() => {
    if (!batchId) return;

    let interval: NodeJS.Timeout;
    async function poll() {
      try {
        const data = await getEnrichmentProgress(batchId!);
        setProgressData(data);
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          setIsPolling(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    poll();
    if (isPolling) {
      interval = setInterval(poll, 1000);
    }
    return () => clearInterval(interval);
  }, [batchId, isPolling]);

  const percentage = progressData?.progress_percentage || 0;
  const isComplete = progressData?.status === "COMPLETED";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Stage 2</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Live Pipeline Orchestration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            AI Processing &amp; Pipeline Monitor
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Real-time execution of abbreviation expansion, RapidFuzz brand matching, Gemini 2.5 spec extraction, UNSPSC classification, and confidence gate validation.
          </p>
        </div>

        {/* Batch Selector */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2 bg-[#ffffff] p-2 rounded-2xl border-2 border-[#e8dede] shadow-xs">
            <span className="text-xs font-mono font-bold text-[#8c7770] pl-2">FEED:</span>
            <select
              value={batchId || ""}
              onChange={(e) => {
                setBatchId(e.target.value);
                setIsPolling(true);
              }}
              className="bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} ({b.total_records} SKUs)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Live Progress Card */}
      <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-6">
        {/* Top Title & Step */}
        <div className="flex items-center justify-between border-b border-[#e8dede] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider">
              BATCH REFERENCE: {batchId || "INGEST-2026-LIVE"}
            </span>
            <h2 className="text-xl font-bold text-[#2b201a] mt-0.5">
              {progressData?.filename || "Industrial Supplier Feed"}
            </h2>
          </div>

          <Badge variant={isComplete ? "green" : "purple"} size="sm" dot>
            {progressData?.status || "PROCESSING"}
          </Badge>
        </div>

        {/* Progress Percentage Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-[#2b201a] flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-[#b18597] animate-pulse" />
              <span>{progressData?.current_step || "Executing Extraction Pipeline..."}</span>
            </span>
            <span className="font-mono font-extrabold text-2xl text-[#b18597]">
              {Math.round(percentage)}%
            </span>
          </div>

          {/* Custom Blush/Rose Progress Bar */}
          <div className="w-full h-4 bg-[#faf6f6] border-2 border-[#e8dede] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#b18597] rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(177,133,151,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#5e4d46] pt-1 font-mono">
            <span>
              Processed: <strong className="text-[#2b201a] font-bold">{progressData?.processed_records || 0}</strong> / {progressData?.total_records || 0} Products
            </span>
            <span className="text-[#065f46] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DDE Safe Escaping Active</span>
            </span>
          </div>
        </div>

        {/* 6 Stage Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3 border-t border-[#e8dede]">
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 15 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">1. Cleaning</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 15 ? "✓ Done" : "Waiting"}</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 30 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">2. Brand Match</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 30 ? "✓ Done" : "Waiting"}</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 50 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">3. Attributes</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 50 ? "✓ Done" : "Waiting"}</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 70 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">4. Taxonomy</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 70 ? "✓ Done" : "Waiting"}</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 85 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">5. Copy Gen</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 85 ? "✓ Done" : "Waiting"}</div>
          </div>
          <div className={`p-3 rounded-2xl border text-center text-xs transition-all ${percentage >= 100 ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]' : 'bg-[#faf6f6] border-[#e8dede] text-[#8c7770]'}`}>
            <div className="font-bold">6. Scoring</div>
            <div className="text-[10px] font-mono mt-0.5">{percentage >= 100 ? "✓ Done" : "Waiting"}</div>
          </div>
        </div>
      </div>

      {/* Terminal Live Execution Logs */}
      <div className="rounded-3xl border-2 border-[#e8dede] p-6 bg-[#ffffff] shadow-[0_4px_24px_rgba(177,133,151,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#b18597]" />
            <h3 className="text-sm font-bold text-[#2b201a]">Live Pipeline Audit Trail</h3>
          </div>
          <span className="text-[10px] font-mono text-[#8c7770] uppercase">Gemini 2.5 Flash ASGI Stream</span>
        </div>

        <div className="bg-[#faf6f6] border-2 border-[#e8dede] rounded-2xl p-4 font-mono text-xs text-[#382b22] h-64 overflow-y-auto space-y-1.5">
          {(!progressData?.logs || progressData.logs.length === 0) ? (
            <div className="text-[#8c7770] italic">Waiting for pipeline task execution logs...</div>
          ) : (
            progressData.logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#b18597] font-bold shrink-0">&gt;</span>
                <span className={log.includes("finished") || log.includes("completed") ? "text-[#065f46] font-bold" : "text-[#2b201a]"}>{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completion Next Steps */}
      {isComplete && (
        <div className="p-6 sm:p-8 bg-[#ecfdf5] border-2 border-[#a7f3d0] rounded-3xl space-y-5 animate-in fade-in shadow-[0_8px_32px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ffffff] border-2 border-[#10b981] flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-7 h-7 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#065f46]">Enrichment Completed Successfully!</h3>
              <p className="text-xs text-[#065f46]/80 font-medium">
                All {progressData?.total_records} industrial catalog products have been cleaned, attribute-extracted, and certified with 0 duplicate collisions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <Link href={`/products?batch_id=${batchId}`}>
              <PopButton className="w-full py-3.5 text-xs justify-center">
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>MASTER CATALOG</span>
                </span>
              </PopButton>
            </Link>

            <Link href={`/review?batch_id=${batchId}`}>
              <Button variant="secondary" size="md" icon={<CheckSquare className="w-4 h-4" />} className="w-full justify-center text-xs">
                Human Review Queue
              </Button>
            </Link>

            <Link href={`/analytics?batch_id=${batchId}`}>
              <Button variant="secondary" size="md" icon={<BarChart3 className="w-4 h-4" />} className="w-full justify-center text-xs">
                Quality Analytics
              </Button>
            </Link>

            <Link href={`/export?batch_id=${batchId}`}>
              <Button variant="secondary" size="md" icon={<Download className="w-4 h-4" />} className="w-full justify-center text-xs">
                Export Standard CSV
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProcessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading pipeline monitor...</div>}>
      <ProcessContent />
    </Suspense>
  );
}
