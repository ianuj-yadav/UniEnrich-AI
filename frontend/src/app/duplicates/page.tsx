"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  GitMerge, 
  Layers, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Sliders,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { 
  listBatches, 
  detectDuplicateClusters, 
  mergeDuplicateCluster, 
  BatchItem, 
  DuplicateCluster 
} from "@/lib/api";

export const dynamic = "force-dynamic";

function DuplicatesContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0.80);
  const [clusters, setClusters] = useState<DuplicateCluster[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mergingId, setMergingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadBatches() {
      try {
        const list = await listBatches();
        setBatches(list);
        if (batchIdFromUrl) {
          setSelectedBatchId(batchIdFromUrl);
        } else if (list.length > 0) {
          setSelectedBatchId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBatches();
  }, [batchIdFromUrl]);

  useEffect(() => {
    if (!selectedBatchId) return;

    async function loadClusters() {
      setLoading(true);
      try {
        const res = await detectDuplicateClusters(selectedBatchId, threshold);
        setClusters(res.clusters || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadClusters();
  }, [selectedBatchId, threshold]);

  const handleMerge = async (cluster: DuplicateCluster) => {
    setMergingId(cluster.cluster_id);
    try {
      const duplicateIds = cluster.duplicate_items.map((d) => d.id);
      await mergeDuplicateCluster(cluster.canonical_candidate.id, duplicateIds);
      setClusters((prev) => prev.filter((c) => c.cluster_id !== cluster.cluster_id));
      setSuccessMsg(`Cluster ${cluster.cluster_id} merged into canonical SKU ${cluster.canonical_candidate.canonical_sku}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setMergingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Intelligence</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Semantic Duplicate Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Vector Similarity &amp; Duplicate Merge Studio
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Detect near-duplicate industrial SKUs across supplier feeds using RapidFuzz string distance and semantic embeddings. Merge messy variants into a single certified master record.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_4px_16px_rgba(177,133,151,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-mono font-bold text-[#8c7770] uppercase">Catalog Feed:</span>
          <select 
            value={selectedBatchId} 
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.filename} ({b.total_records} SKUs)</option>
            ))}
          </select>
        </div>

        {/* Similarity Threshold Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Sliders className="w-4 h-4 text-[#b18597] shrink-0" />
          <span className="text-xs font-mono font-bold text-[#8c7770] uppercase">Match Threshold:</span>
          <input 
            type="range" 
            min="0.60" 
            max="0.95" 
            step="0.05" 
            value={threshold} 
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-32 accent-[#b18597] cursor-pointer"
          />
          <Badge variant="purple" size="sm">{(threshold * 100).toFixed(0)}%</Badge>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10b981]" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center text-[#8c7770] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#b18597] mx-auto" />
          <p className="text-xs font-mono font-bold">Scanning catalog for semantic duplicate clusters...</p>
        </div>
      )}

      {/* Clusters List */}
      {!loading && clusters.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#8c7770] uppercase tracking-wider">
              Found {clusters.length} Duplicate Cluster(s)
            </h3>
          </div>

          <div className="space-y-5">
            {clusters.map((cluster) => (
              <div key={cluster.cluster_id} className="rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#e8dede] pb-4">
                  <div className="flex items-center gap-2.5">
                    <GitMerge className="w-5 h-5 text-[#b18597]" />
                    <span className="font-mono text-xs font-bold text-[#2b201a]">{cluster.cluster_id}</span>
                    <Badge variant="blue" size="sm">Similarity: {Math.round(cluster.highest_similarity * 100)}%</Badge>
                  </div>
                  <Button
                    onClick={() => handleMerge(cluster)}
                    isLoading={mergingId === cluster.cluster_id}
                    variant="primary"
                    size="sm"
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Merge Records
                  </Button>
                </div>

                {/* Split Comparison of Candidate vs Duplicates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Primary Candidate */}
                  <div className="p-4 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#065f46] uppercase">Primary Canonical Master</span>
                      <span className="font-mono text-xs text-[#065f46] font-bold">{cluster.canonical_candidate.canonical_sku}</span>
                    </div>
                    <div className="font-bold text-sm text-[#2b201a]">{cluster.canonical_candidate.product_title}</div>
                    <div className="text-[#5e4d46] text-[11px] font-mono">{cluster.canonical_candidate.resolved_brand} &bull; {cluster.canonical_candidate.category}</div>
                    <div className="p-2.5 rounded-xl bg-[#ffffff] border border-[#a7f3d0] text-[10px] text-[#065f46] font-mono">
                      {JSON.stringify(cluster.canonical_candidate.extracted_attributes || {})}
                    </div>
                  </div>

                  {/* Duplicate Candidates */}
                  <div className="space-y-3">
                    {cluster.duplicate_items.map((dup, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#fffbeb] border-2 border-[#fde68a] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[#92400e] uppercase">Duplicate Match #{idx+1}</span>
                          <span className="font-mono text-xs text-[#92400e] font-bold">{dup.canonical_sku || dup.raw_sku}</span>
                        </div>
                        <div className="font-semibold text-xs text-[#2b201a]">{dup.product_title || dup.raw_description}</div>
                        <div className="text-[#5e4d46] text-[11px] font-mono">{dup.resolved_brand} &bull; Similarity: {Math.round(dup.similarity_score * 100)}%</div>
                        <div className="p-2.5 rounded-xl bg-[#ffffff] border border-[#fde68a] text-[10px] text-[#92400e] font-mono">
                          {JSON.stringify(dup.extracted_attributes || {})}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && clusters.length === 0 && (
        <div className="py-20 text-center space-y-3 rounded-3xl border-2 border-dashed border-[#e8dede] bg-[#ffffff]">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-[#2b201a]">Zero Duplicate Collisions Detected</h3>
          <p className="text-xs text-[#5e4d46] max-w-sm mx-auto">
            All SKUs in this catalog feed are distinct and non-overlapping based on current similarity threshold ({(threshold * 100).toFixed(0)}%).
          </p>
        </div>
      )}
    </div>
  );
}

export default function DuplicatesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading duplicate intelligence...</div>}>
      <DuplicatesContent />
    </Suspense>
  );
}
