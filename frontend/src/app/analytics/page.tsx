"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Percent,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAnalyticsData, listBatches, AnalyticsData, BatchItem } from "@/lib/api";

export const dynamic = "force-dynamic";

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchIdFromUrl);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBatches() {
      try {
        const list = await listBatches();
        setBatches(list);
        if (!selectedBatchId && list.length > 0) {
          setSelectedBatchId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBatches();
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedBatchId) return;

    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const data = await getAnalyticsData(selectedBatchId!);
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [selectedBatchId]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Telemetry</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Catalog Quality Analytics
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Data Quality &amp; Distribution Dashboard
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Audit coverage improvements, confidence score distribution, brand frequency, and UNSPSC taxonomy categorization.
          </p>
        </div>

        {/* Batch Selector */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2 bg-[#ffffff] p-2 rounded-2xl border-2 border-[#e8dede] shadow-xs">
            <span className="text-xs font-mono font-bold text-[#8c7770] pl-2">FEED:</span>
            <select
              value={selectedBatchId || ""}
              onChange={(e) => setSelectedBatchId(e.target.value)}
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

      {isLoading || !analytics ? (
        <div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading quality metrics...</div>
      ) : (
        <div className="space-y-6">
          {/* Completeness Delta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8c7770] uppercase">Brand Coverage Gain</span>
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm line-through text-[#8c7770] font-mono">
                  {analytics.completeness_delta.brand_coverage_before}%
                </span>
                <span className="text-3xl font-extrabold text-[#065f46] font-mono">
                  {analytics.completeness_delta.brand_coverage_after}%
                </span>
              </div>
              <p className="text-[11px] text-[#065f46] font-medium mt-1">
                +{(analytics.completeness_delta.brand_coverage_after - analytics.completeness_delta.brand_coverage_before).toFixed(1)}% via RapidFuzz &amp; AI
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8c7770] uppercase">Category Classification</span>
                <Layers className="w-5 h-5 text-[#5b21b6]" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm line-through text-[#8c7770] font-mono">
                  {analytics.completeness_delta.category_coverage_before}%
                </span>
                <span className="text-3xl font-extrabold text-[#5b21b6] font-mono">
                  {analytics.completeness_delta.category_coverage_after}%
                </span>
              </div>
              <p className="text-[11px] text-[#5b21b6] font-medium mt-1">UNSPSC codes assigned</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8c7770] uppercase">Title Standardization</span>
                <Sparkles className="w-5 h-5 text-[#b18597]" />
              </div>
              <div className="text-3xl font-extrabold text-[#2b201a] font-mono mt-2">
                {analytics.completeness_delta.title_standardization_gain}%
              </div>
              <p className="text-[11px] text-[#b18597] font-medium mt-1">SEO formatted e-commerce titles</p>
            </div>
          </div>

          {/* Confidence Histogram & Top Attributes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confidence Histogram */}
            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-5">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Confidence Score Distribution</h3>
                <p className="text-xs text-[#8c7770]">Granular quality routing histogram</p>
              </div>

              <div className="space-y-4 pt-1">
                {analytics.confidence_histogram.map((bin) => {
                  const total = analytics.total_products || 1;
                  const pct = Math.round((bin.count / total) * 100);
                  const isReview = bin.range.includes("Review");
                  const isHigh = bin.range.includes("85-100%");

                  return (
                    <div key={bin.range} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold font-mono ${isReview ? 'text-[#92400e]' : isHigh ? 'text-[#065f46]' : 'text-[#2b201a]'}`}>
                          {bin.range}
                        </span>
                        <span className="text-[#5e4d46] font-mono font-bold">
                          {bin.count} SKUs ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#faf6f6] rounded-full overflow-hidden border border-[#e8dede] p-0.5">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isReview ? 'bg-[#f59e0b]' : isHigh ? 'bg-[#10b981]' : 'bg-[#b18597]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Extracted Attributes */}
            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-5">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Top Technical Attributes Extracted</h3>
                <p className="text-xs text-[#8c7770]">Key-value engineering specifications populated by AI</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {analytics.top_extracted_attributes.map((attr) => {
                  const total = analytics.total_products || 1;
                  const pct = Math.round((attr.count / total) * 100);

                  return (
                    <div key={attr.attribute} className="flex items-center justify-between p-3 bg-[#faf6f6] border border-[#e8dede] rounded-2xl text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#b18597]" />
                        <span className="font-bold text-[#2b201a] font-mono">{attr.attribute}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[#065f46] font-extrabold">{attr.count} records</span>
                        <span className="text-[#8c7770]">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Brand Distribution & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Brand Distribution</h3>
                <p className="text-xs text-[#8c7770]">Top resolved manufacturers and verified brands</p>
              </div>

              <div className="space-y-2 pt-1">
                {analytics.brand_distribution.map((b) => (
                  <div key={b.brand} className="flex items-center justify-between p-3 bg-[#faf6f6] border border-[#e8dede] rounded-2xl text-xs">
                    <span className="font-bold text-[#2b201a]">{b.brand}</span>
                    <span className="font-mono font-bold text-[#1e40af]">{b.count} SKUs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Category Breakdown</h3>
                <p className="text-xs text-[#8c7770]">Classified hierarchy shares</p>
              </div>

              <div className="space-y-2 pt-1">
                {analytics.category_distribution.map((c) => (
                  <div key={c.category} className="flex items-center justify-between p-3 bg-[#faf6f6] border border-[#e8dede] rounded-2xl text-xs">
                    <span className="font-bold text-[#2b201a]">{c.category}</span>
                    <span className="font-mono font-bold text-[#5b21b6]">{c.count} SKUs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
