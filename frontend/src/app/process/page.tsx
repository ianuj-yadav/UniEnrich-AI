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
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Stage 2</Badge>
            <span className="text-xs font-semibold text-grey-300 uppercase tracking-wider">Live Pipeline Orchestration</span>
          </div>
          <h1 className="text-2xl font-bold text-white-50">AI Processing & Pipeline Monitor</h1>
          <p className="text-sm text-grey-200">
            Real-time execution of data cleaning, brand matching, LLM attribute extraction, taxonomy classification, and description generation.
          </p>
        </div>

        {/* Batch Selector */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-grey-300">Feed:</span>
            <select
              value={batchId || ""}
              onChange={(e) => {
                setBatchId(e.target.value);
                setIsPolling(true);
              }}
              className="bg-black-800 border border-black-600 rounded-md px-3 py-1.5 text-xs text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
      <Card title={progressData?.filename || "Enrichment Batch"} subtitle="Pipeline Execution Status">
        <div className="space-y-6">
          {/* Progress Percentage Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-300" />
                {progressData?.current_step || "Initializing..."}
              </span>
              <span className="font-mono font-bold text-lg text-purple-300">
                {Math.round(percentage)}%
              </span>
            </div>

            {/* Custom Palette Progress Bar */}
            <div className="w-full h-3 bg-black-900 border border-black-600 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-grey-300 pt-1">
              <span>
                Processed: <strong className="text-white-100">{progressData?.processed_records || 0}</strong> / {progressData?.total_records || 0} Products
              </span>
              <Badge variant={isComplete ? "success" : "purple"} dot>
                {progressData?.status || "PENDING"}
              </Badge>
            </div>
          </div>

          {/* 6 Stage Status Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-black-600">
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 15 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">1. Cleaning</div>
              <div className="text-[10px] opacity-80">{percentage >= 15 ? "Done" : "Waiting"}</div>
            </div>
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 30 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">2. Brand Match</div>
              <div className="text-[10px] opacity-80">{percentage >= 30 ? "Done" : "Waiting"}</div>
            </div>
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 50 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">3. Attributes</div>
              <div className="text-[10px] opacity-80">{percentage >= 50 ? "Done" : "Waiting"}</div>
            </div>
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 70 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">4. Taxonomy</div>
              <div className="text-[10px] opacity-80">{percentage >= 70 ? "Done" : "Waiting"}</div>
            </div>
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 85 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">5. Copy Gen</div>
              <div className="text-[10px] opacity-80">{percentage >= 85 ? "Done" : "Waiting"}</div>
            </div>
            <div className={`p-2.5 rounded-md border text-center text-xs ${percentage >= 100 ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-black-900 border-black-600 text-grey-400'}`}>
              <div className="font-semibold">6. Scoring</div>
              <div className="text-[10px] opacity-80">{percentage >= 100 ? "Done" : "Waiting"}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Terminal Live Execution Logs */}
      <Card 
        title="Live Pipeline Execution Logs" 
        subtitle="Timestamped audit trail of enrichment tasks"
        icon={<Terminal className="w-4 h-4" />}
      >
        <div className="bg-black-900 border border-black-600 rounded-lg p-4 font-mono text-xs text-grey-200 h-64 overflow-y-auto space-y-1.5">
          {(!progressData?.logs || progressData.logs.length === 0) ? (
            <div className="text-grey-400 italic">Waiting for pipeline task logs...</div>
          ) : (
            progressData.logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-300 shrink-0">&gt;</span>
                <span className={log.includes("finished") ? "text-green-300 font-semibold" : ""}>{log}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Completion Next Steps */}
      {isComplete && (
        <div className="p-6 bg-green-900/20 border border-green-700/50 rounded-xl space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white-50">Enrichment Completed Successfully!</h3>
              <p className="text-xs text-grey-200">
                All {progressData?.total_records} products have been cleaned, classified, attribute-extracted, and confidence scored.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <Link href={`/products?batch_id=${batchId}`}>
              <Button variant="secondary" size="md" icon={<Layers className="w-4 h-4" />} className="w-full">
                View Catalog
              </Button>
            </Link>

            <Link href={`/review?batch_id=${batchId}`}>
              <Button variant="outline" size="md" icon={<CheckSquare className="w-4 h-4" />} className="w-full text-yellow-400 border-yellow-500/40">
                Human Review Queue
              </Button>
            </Link>

            <Link href={`/analytics?batch_id=${batchId}`}>
              <Button variant="secondary" size="md" icon={<BarChart3 className="w-4 h-4" />} className="w-full">
                Quality Analytics
              </Button>
            </Link>

            <Link href={`/export?batch_id=${batchId}`}>
              <Button variant="primary" size="md" icon={<Download className="w-4 h-4" />} className="w-full">
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
    <Suspense fallback={<div className="text-center py-20 text-sm text-grey-300">Loading pipeline monitor...</div>}>
      <ProcessContent />
    </Suspense>
  );
}
