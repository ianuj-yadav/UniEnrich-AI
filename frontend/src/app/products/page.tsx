"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Layers, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  X,
  FileSpreadsheet,
  Tag,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  getBatchProducts, 
  getProductComparison, 
  listBatches, 
  BatchItem, 
  EnrichedProduct, 
  ComparisonData 
} from "@/lib/api";
import { getConfidenceBadgeProps } from "@/lib/utils";

export const dynamic = "force-dynamic";

function ProductsContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchIdFromUrl);
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState<boolean>(false);

  // Load Batches
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

  // Load Products for selected batch
  useEffect(() => {
    if (!selectedBatchId) return;
    async function fetchProds() {
      setIsLoading(true);
      try {
        const resp = await getBatchProducts(
          selectedBatchId!,
          1,
          50,
          statusFilter,
          searchQuery
        );
        setProducts(resp.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProds();
  }, [selectedBatchId, statusFilter, searchQuery]);

  // Load comparison when a product is clicked
  const handleOpenComparison = async (prod: EnrichedProduct) => {
    setSelectedProduct(prod);
    setIsLoadingComparison(true);
    try {
      const comp = await getProductComparison(prod.id);
      setComparisonData(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingComparison(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="lightblue">Stage 3</Badge>
            <span className="text-xs font-semibold text-grey-300 uppercase tracking-wider">Catalog & Comparison</span>
          </div>
          <h1 className="text-2xl font-bold text-white-50">Enriched Product Catalog</h1>
          <p className="text-sm text-grey-200">
            Browse standardized catalog records and inspect split-screen Before/After comparisons.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black-800 p-3 rounded-lg border border-black-600">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["ALL", "NEEDS_REVIEW", "AUTO_APPROVED", "REVIEWED_APPROVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === st
                  ? "bg-blue-500 text-white-50 border border-blue-600"
                  : "bg-black-700 text-grey-200 hover:text-white-100 border border-black-600"
              }`}
            >
              {st === "ALL" ? "All Products" : st === "NEEDS_REVIEW" ? "Needs Review (<70%)" : st === "AUTO_APPROVED" ? "Auto-Approved" : "Human Approved"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-grey-400" />
          <input
            type="text"
            placeholder="Search SKU, brand, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black-900 border border-black-600 rounded-md pl-8 pr-3 py-1.5 text-xs text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Main Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12 text-grey-300 text-sm">Loading catalog items...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Layers className="w-10 h-10 text-grey-400 mx-auto opacity-60" />
            <p className="text-sm text-grey-200">No products match the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black-900 border-b border-black-600 uppercase text-grey-300 font-semibold">
                <tr>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Resolved Brand</th>
                  <th className="py-3 px-3">Standardized Product Title</th>
                  <th className="py-3 px-3">Category & UNSPSC</th>
                  <th className="py-3 px-3">Extracted Attributes</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black-600">
                {products.map((prod) => {
                  const badge = getConfidenceBadgeProps(prod.confidence_score);
                  return (
                    <tr key={prod.id} className="hover:bg-black-700/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-blue-400 font-medium">
                        {prod.canonical_sku || prod.raw_sku}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-white-100">
                          {prod.resolved_brand || <em className="text-yellow-400">Unbranded</em>}
                        </span>
                        {prod.resolved_manufacturer && (
                          <span className="block text-[10px] text-grey-400">{prod.resolved_manufacturer}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-xs truncate font-medium text-white-100">
                        {prod.product_title || prod.raw_description}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-grey-200">{prod.category || "—"}</span>
                        {prod.unspsc_code && (
                          <span className="block font-mono text-[10px] text-purple-300">UNSPSC: {prod.unspsc_code}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Object.entries(prod.extracted_attributes || {}).slice(0, 3).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 bg-black-700 border border-black-600 rounded text-[10px] text-lime-300 font-mono">
                              {k}: {String(v)}
                            </span>
                          ))}
                          {Object.keys(prod.extracted_attributes || {}).length > 3 && (
                            <span className="text-[10px] text-grey-400">+{Object.keys(prod.extracted_attributes).length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge 
                          variant={
                            prod.review_status === "AUTO_APPROVED" ? "success" : 
                            prod.review_status === "REVIEWED_APPROVED" ? "blue" : 
                            prod.review_status === "NEEDS_REVIEW" ? "warning" : "danger"
                          }
                          size="sm"
                        >
                          {prod.review_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenComparison(prod)}
                        >
                          Compare
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Split-Screen Before/After Comparison Modal / Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black-800 border border-black-600 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-black-600 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white-50">Split-Screen Before / After Comparison</h2>
                  <Badge variant="purple">SKU: {selectedProduct.canonical_sku}</Badge>
                </div>
                <p className="text-xs text-grey-300 mt-0.5">
                  Raw supplier record mapped directly against AI-standardized e-commerce record
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 hover:bg-black-700 rounded-md text-grey-300 hover:text-white-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingComparison ? (
              <div className="py-12 text-center text-sm text-grey-300">Loading comparison details...</div>
            ) : comparisonData ? (
              <div className="space-y-6">
                {/* Changed Fields Highlighting Pills */}
                <div className="p-3 bg-black-900 border border-black-600 rounded-lg space-y-1.5">
                  <span className="text-[11px] font-semibold text-grey-300 uppercase tracking-wider">
                    Enriched / Normalized Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonData.changed_fields.map((f, i) => (
                      <Badge key={i} variant="lime" size="sm">
                        + {f}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Split Comparison Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Original Record */}
                  <div className="bg-black-900 border border-brown-600/60 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-black-700 pb-2">
                      <span className="text-xs font-bold text-brown-200 uppercase tracking-wider">
                        Original Supplier Record (Before)
                      </span>
                      <span className="text-[11px] text-grey-400">Raw Input Feed</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Raw Brand</span>
                        <span className="font-mono text-white-200">
                          {comparisonData.raw_record.brand || <em className="text-yellow-400">Missing / Unbranded</em>}
                        </span>
                      </div>

                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Raw Description</span>
                        <p className="font-mono text-white-100 bg-black-800 p-2 rounded border border-black-700 break-words">
                          {comparisonData.raw_record.description}
                        </p>
                      </div>

                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Raw Category</span>
                        <span className="text-grey-200">{comparisonData.raw_record.category || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Enriched Record */}
                  <div className="bg-black-900 border border-blue-500/60 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-black-700 pb-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                        AI Enriched Record (After)
                      </span>
                      <Badge variant="blue" size="sm">Score: {Math.round(comparisonData.confidence_score * 100)}%</Badge>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Standardized Brand & Mfr</span>
                        <span className="font-bold text-green-300">
                          {comparisonData.enriched_record.brand}
                        </span>
                        {comparisonData.enriched_record.manufacturer && (
                          <span className="text-grey-300 block text-[11px]">
                            Mfr: {comparisonData.enriched_record.manufacturer}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Standardized Product Title</span>
                        <p className="font-semibold text-white-50 bg-black-800 p-2 rounded border border-blue-500/30">
                          {comparisonData.enriched_record.title}
                        </p>
                      </div>

                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Taxonomy & UNSPSC</span>
                        <span className="text-white-100 font-medium">{comparisonData.enriched_record.category} &rarr; {comparisonData.enriched_record.subcategory}</span>
                        <span className="block font-mono text-purple-300 text-[10px]">Code: {comparisonData.enriched_record.unspsc}</span>
                      </div>

                      <div>
                        <span className="text-grey-400 block text-[10px] uppercase">Extracted Attributes</span>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          {Object.entries(comparisonData.enriched_record.attributes || {}).map(([k, v]) => (
                            <div key={k} className="p-1.5 bg-black-800 rounded border border-black-700">
                              <span className="text-[10px] text-grey-400 block">{k}</span>
                              <span className="font-mono text-lime-300 font-medium">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multi-tier Descriptions View */}
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-black-900 border border-black-600 rounded-lg space-y-1">
                    <span className="text-xs font-semibold text-grey-300">Mobile Description (1-2 sentences):</span>
                    <p className="text-xs text-white-100 leading-relaxed">
                      {comparisonData.enriched_record.mobile_description}
                    </p>
                  </div>

                  <div className="p-3 bg-black-900 border border-black-600 rounded-lg space-y-1">
                    <span className="text-xs font-semibold text-grey-300">E-Commerce Long Description:</span>
                    <p className="text-xs text-grey-200 leading-relaxed">
                      {comparisonData.enriched_record.long_description}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-4 border-t border-black-600">
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-grey-300">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
