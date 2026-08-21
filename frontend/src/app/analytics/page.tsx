"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  CheckCircle2,
  PieChart as PieIcon,
  Layers
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getBatchAnalytics, listBatches, BatchItem, AnalyticsData } from "@/lib/api";

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
      } catch (e) {
        console.error(e);
      }
    }
    loadBatches();
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedBatchId) return;
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        const data = await getBatchAnalytics(selectedBatchId!);
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedBatchId]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="blue">Stage 5</Badge>
            <span className="text-xs font-semibold text-grey-300 uppercase tracking-wider">
              Quality & Completeness Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white-50">Data Quality & Distribution Dashboard</h1>
          <p className="text-sm text-grey-200">
            Audit coverage improvements, confidence distribution, brand frequency, and taxonomy categorization.
          </p>
        </div>

        {/* Batch Selector */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-grey-300">Active Feed:</span>
            <select
              value={selectedBatchId || ""}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-black-800 border border-black-600 rounded-md px-3 py-1.5 text-xs text-white-100 focus:outline-none"
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
        <div className="text-center py-20 text-sm text-grey-300">Loading quality metrics...</div>
      ) : (
        <div className="space-y-6">
          {/* Completeness Delta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-black-800 border-black-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-grey-300">Brand Coverage Gain</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm line-through text-grey-400">
                  {analytics.completeness_delta.brand_coverage_before}%
                </span>
                <span className="text-2xl font-bold text-green-300">
                  {analytics.completeness_delta.brand_coverage_after}%
                </span>
              </div>
              <p className="text-[11px] text-green-500 mt-1">
                +{(analytics.completeness_delta.brand_coverage_after - analytics.completeness_delta.brand_coverage_before).toFixed(1)}% via RapidFuzz & AI
              </p>
            </Card>

            <Card className="p-4 bg-black-800 border-black-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-grey-300">Category Classification</span>
                <Layers className="w-4 h-4 text-purple-300" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm line-through text-grey-400">
                  {analytics.completeness_delta.category_coverage_before}%
                </span>
                <span className="text-2xl font-bold text-purple-300">
                  {analytics.completeness_delta.category_coverage_after}%
                </span>
              </div>
              <p className="text-[11px] text-purple-300 mt-1">UNSPSC codes assigned</p>
            </Card>

            <Card className="p-4 bg-black-800 border-black-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-grey-300">Title Standardization</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white-50 mt-2">
                {analytics.completeness_delta.title_standardization_gain}%
              </div>
              <p className="text-[11px] text-blue-400 mt-1">SEO formatted e-commerce titles</p>
            </Card>
          </div>

          {/* Confidence Histogram & Top Attributes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confidence Histogram */}
            <Card title="Confidence Score Distribution" subtitle="Granular quality routing histogram">
              <div className="space-y-4 pt-2">
                {analytics.confidence_histogram.map((bin) => {
                  const total = analytics.total_products || 1;
                  const pct = Math.round((bin.count / total) * 100);
                  const isReview = bin.range.includes("Review");
                  const isHigh = bin.range.includes("85-100%");

                  return (
                    <div key={bin.range} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isReview ? 'text-yellow-400' : isHigh ? 'text-green-300' : 'text-grey-200'}`}>
                          {bin.range}
                        </span>
                        <span className="text-grey-300 font-mono">
                          {bin.count} SKUs ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-black-900 rounded-full overflow-hidden border border-black-600">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isReview ? 'bg-yellow-400' : isHigh ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Top Extracted Attributes */}
            <Card title="Top Technical Attributes Extracted" subtitle="Key-value specifications populated by AI">
              <div className="space-y-3 pt-2">
                {analytics.top_extracted_attributes.map((attr) => {
                  const total = analytics.total_products || 1;
                  const pct = Math.round((attr.count / total) * 100);

                  return (
                    <div key={attr.attribute} className="flex items-center justify-between p-2.5 bg-black-900 border border-black-600 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-lime-300" />
                        <span className="font-semibold text-white-100">{attr.attribute}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-lime-300 font-bold">{attr.count} records</span>
                        <span className="text-grey-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Brand Distribution & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Brand Distribution" subtitle="Top resolved manufacturers and brands">
              <div className="space-y-2 pt-2">
                {analytics.brand_distribution.map((b) => (
                  <div key={b.brand} className="flex items-center justify-between p-2.5 bg-black-900 border border-black-600 rounded-lg text-xs">
                    <span className="font-semibold text-white-100">{b.brand}</span>
                    <span className="font-mono text-blue-400">{b.count} SKUs</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Category Breakdown" subtitle="Classified hierarchy shares">
              <div className="space-y-2 pt-2">
                {analytics.category_distribution.map((c) => (
                  <div key={c.category} className="flex items-center justify-between p-2.5 bg-black-900 border border-black-600 rounded-lg text-xs">
                    <span className="font-semibold text-white-100">{c.category}</span>
                    <span className="font-mono text-purple-300">{c.count} SKUs</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-grey-300">Loading analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
