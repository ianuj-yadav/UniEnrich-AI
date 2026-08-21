"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  GitMerge, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Loader2,
  Trash2,
  Check
} from "lucide-react";
import { getDuplicateClusters, mergeDuplicateRecords, listBatches, BatchItem, DuplicateCluster } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function DuplicateContent() {
  const searchParams = useSearchParams();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(searchParams.get("batch_id") || "");
  const [threshold, setThreshold] = useState<number>(0.75);
  const [loading, setLoading] = useState<boolean>(false);
  const [clusters, setClusters] = useState<DuplicateCluster[]>([]);
  const [mergingId, setMergingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    listBatches().then((b) => {
      setBatches(b);
      if (b.length > 0 && !selectedBatchId) {
        setSelectedBatchId(b[0].id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      loadDuplicates();
    }
  }, [selectedBatchId, threshold]);

  const loadDuplicates = async () => {
    if (!selectedBatchId) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await getDuplicateClusters(selectedBatchId, threshold);
      setClusters(res.clusters || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (cluster: DuplicateCluster) => {
    const primaryId = cluster.canonical_candidate.id;
    const dupIds = cluster.duplicate_items.map((d) => d.id);
    
    setMergingId(cluster.cluster_id);
    try {
      const res = await mergeDuplicateRecords(selectedBatchId, primaryId, dupIds);
      setSuccessMsg(res.message);
      // Remove merged cluster from state
      setClusters((prev) => prev.filter((c) => c.cluster_id !== cluster.cluster_id));
    } catch (err: any) {
      alert("Merge error: " + err.message);
    } finally {
      setMergingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Semantic Duplicate Intelligence & Merge</h1>
            <Badge variant="blue" size="sm">Vector n-gram Cosine Engine</Badge>
          </div>
          <p className="text-xs text-grey-400 mt-1">
            Detect cross-vendor duplicate SKUs, resolve conflicting technical attributes, and merge into canonical master records.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-black-900 border border-black-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-grey-400 shrink-0">Catalog Feed:</span>
          <select 
            value={selectedBatchId} 
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-black-950 border border-black-700 rounded-md px-3 py-1.5 text-xs text-white"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.filename} ({b.total_records} SKUs)</option>
            ))}
          </select>
        </div>

        {/* Similarity Threshold Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-xs text-grey-400">Match Threshold:</span>
          <input 
            type="range" 
            min="0.60" 
            max="0.95" 
            step="0.05" 
            value={threshold} 
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-28 accent-purple-500 cursor-pointer"
          />
          <Badge variant="purple" size="sm">{(threshold * 100).toFixed(0)}%</Badge>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-green-950/40 border border-green-700 text-green-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center text-grey-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm font-medium">Scanning catalog for semantic duplicate clusters...</p>
        </div>
      )}

      {/* Clusters List */}
      {!loading && clusters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-grey-400 uppercase tracking-wider">
              Found {clusters.length} Duplicate Cluster(s)
            </h3>
          </div>

          <div className="space-y-4">
            {clusters.map((cluster) => (
              <Card key={cluster.cluster_id} className="overflow-hidden border-black-700">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-black-800 pb-3">
                    <div className="flex items-center gap-2">
                      <GitMerge className="w-4 h-4 text-blue-400" />
                      <span className="font-mono text-xs font-bold text-white">{cluster.cluster_id}</span>
                      <Badge variant="blue" size="sm">Similarity: {Math.round(cluster.highest_similarity * 100)}%</Badge>
                    </div>
                    <Button
                      onClick={() => handleMerge(cluster)}
                      loading={mergingId === cluster.cluster_id}
                      variant="primary"
                      size="sm"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Merge Records
                    </Button>
                  </div>

                  {/* Split Comparison of Candidate vs Duplicates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Primary Candidate */}
                    <div className="p-3 rounded-lg bg-black-950 border border-green-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-green-400 uppercase">Primary Canonical Master</span>
                        <span className="font-mono text-grey-400">{cluster.canonical_candidate.canonical_sku}</span>
                      </div>
                      <div className="font-medium text-white">{cluster.canonical_candidate.product_title}</div>
                      <div className="text-grey-400 text-[11px]">{cluster.canonical_candidate.resolved_brand} &bull; {cluster.canonical_candidate.category}</div>
                      <div className="p-2 rounded bg-black-900 border border-black-800 text-[11px] text-grey-300">
                        {JSON.stringify(cluster.canonical_candidate.extracted_attributes || {})}
                      </div>
                    </div>

                    {/* Duplicate Candidates */}
                    <div className="space-y-3">
                      {cluster.duplicate_items.map((dup, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-black-950 border border-yellow-900/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-yellow-400 uppercase">Duplicate Match #{idx+1}</span>
                            <span className="font-mono text-grey-400">{dup.canonical_sku || dup.raw_sku}</span>
                          </div>
                          <div className="font-medium text-grey-200">{dup.product_title || dup.raw_description}</div>
                          <div className="text-grey-400 text-[11px]">{dup.resolved_brand} &bull; Similarity: {Math.round(dup.similarity_score * 100)}%</div>
                          <div className="p-2 rounded bg-black-900 border border-black-800 text-[11px] text-grey-400">
                            {JSON.stringify(dup.extracted_attributes || {})}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && clusters.length === 0 && (
        <div className="py-20 text-center text-grey-500 space-y-2 bg-black-900 rounded-xl border border-black-800">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto opacity-70" />
          <p className="text-sm font-semibold text-white">No Duplicate Conflicts Detected</p>
          <p className="text-xs text-grey-400 max-w-sm mx-auto">
            All records in this catalog feed have distinct semantic vectors above the {Math.round(threshold*100)}% threshold.
          </p>
        </div>
      )}
    </div>
  );
}

export default function DuplicatesPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-grey-400">Loading Duplicate Intelligence...</div>}>
      <DuplicateContent />
    </Suspense>
  );
}
