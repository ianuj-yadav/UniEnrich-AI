"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Database, 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Sparkles,
  ChevronRight,
  Download,
  Layers,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { 
  getEnrichedProducts, 
  listBatches, 
  getComparisonData, 
  downloadCatalogExport,
  BatchItem, 
  EnrichedProduct, 
  ComparisonData 
} from "@/lib/api";

export const dynamic = "force-dynamic";

function getConfidenceBadgeProps(score: number) {
  if (score >= 0.85) {
    return {
      label: `${Math.round(score * 100)}% High`,
      bgColor: "bg-[#ecfdf5]",
      textColor: "text-[#065f46]",
      borderColor: "border-[#a7f3d0]",
      dotColor: "bg-[#10b981]"
    };
  } else if (score >= 0.70) {
    return {
      label: `${Math.round(score * 100)}% Pass`,
      bgColor: "bg-[#eff6ff]",
      textColor: "text-[#1e40af]",
      borderColor: "border-[#bfdbfe]",
      dotColor: "bg-[#3b82f6]"
    };
  } else if (score >= 0.50) {
    return {
      label: `${Math.round(score * 100)}% Review`,
      bgColor: "bg-[#fffbeb]",
      textColor: "text-[#92400e]",
      borderColor: "border-[#fde68a]",
      dotColor: "bg-[#f59e0b]"
    };
  } else {
    return {
      label: `${Math.round(score * 100)}% Low`,
      bgColor: "bg-[#fef2f2]",
      textColor: "text-[#991b1b]",
      borderColor: "border-[#fecaca]",
      dotColor: "bg-[#ef4444]"
    };
  }
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchIdFromUrl);
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");

  // Split-Screen Modal State
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleExportCsv = async () => {
    if (!selectedBatchId) return;
    setIsExporting(true);
    try {
      await downloadCatalogExport(selectedBatchId, "csv", statusFilter, "standard");
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  // Load Batches
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

  // Load Products for selected batch
  useEffect(() => {
    if (!selectedBatchId) return;

    async function loadProducts() {
      setIsLoading(true);
      try {
        const data = await getEnrichedProducts(selectedBatchId!);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [selectedBatchId]);

  // Distinct Brands for filter dropdown
  const distinctBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.resolved_brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Status Filter
      if (statusFilter !== "ALL" && p.review_status !== statusFilter) {
        return false;
      }
      // Brand Filter
      if (selectedBrand !== "ALL" && p.resolved_brand !== selectedBrand) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSku = (p.canonical_sku || p.raw_sku || "").toLowerCase().includes(query);
        const matchBrand = (p.resolved_brand || "").toLowerCase().includes(query);
        const matchTitle = (p.product_title || p.raw_description || "").toLowerCase().includes(query);
        const matchCat = (p.category || "").toLowerCase().includes(query);
        if (!matchSku && !matchBrand && !matchTitle && !matchCat) return false;
      }
      return true;
    });
  }, [products, statusFilter, selectedBrand, searchQuery]);

  const handleOpenComparison = async (product: EnrichedProduct) => {
    setSelectedProduct(product);
    setIsLoadingComparison(true);
    try {
      const comp = await getComparisonData(product.id);
      setComparisonData(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingComparison(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="pink">Stage 3</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Enriched Catalog Hub
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Master Catalog &amp; Split-View Comparison
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl">
            Inspect AI-standardized e-commerce records side-by-side with original supplier feeds, token attributions, and extracted engineering attributes.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-2xl border-2 border-[#e8dede] shadow-[0_4px_16px_rgba(177,133,151,0.06)]">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: "ALL", label: "All Products" },
            { id: "NEEDS_REVIEW", label: "Needs Review (<70%)" },
            { id: "AUTO_APPROVED", label: "Auto-Approved" },
            { id: "REVIEWED_APPROVED", label: "Human Approved" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                statusFilter === st.id
                  ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold"
                  : "bg-[#faf6f6] text-[#6e5d56] hover:text-[#2b201a] border border-[#e8dede]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Brand Filter */}
          {distinctBrands.length > 0 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
            >
              <option value="ALL">All Brands ({distinctBrands.length})</option>
              {distinctBrands.map((b) => (
                <option key={b as string} value={b as string}>{b}</option>
              ))}
            </select>
          )}

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8c7770]" />
            <input
              type="text"
              placeholder="Search SKU, brand, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
            />
          </div>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-stone-800 text-stone-900 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0"
            title="Download current filtered catalog as CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-800" />
            <span className="text-stone-900 font-bold">{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Table */}
      <div className="rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-[#8c7770] text-xs font-mono">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Layers className="w-10 h-10 text-[#b18597] mx-auto opacity-50" />
            <p className="text-xs text-[#5e4d46] font-medium">No products match the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f6] border-b-2 border-[#e8dede] uppercase text-[#8c7770] font-mono font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Resolved Brand</th>
                  <th className="py-3.5 px-4">Standardized Title</th>
                  <th className="py-3.5 px-4">Category &amp; UNSPSC</th>
                  <th className="py-3.5 px-4">Attributes</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dede]">
                {filteredProducts.map((prod) => {
                  const badge = getConfidenceBadgeProps(prod.confidence_score);
                  return (
                    <tr key={prod.id} className="hover:bg-[#faf6f6]/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#1e40af] font-bold">
                        {prod.canonical_sku || prod.raw_sku}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#2b201a]">
                          {prod.resolved_brand || <em className="text-[#92400e]">Unbranded</em>}
                        </span>
                        {prod.resolved_manufacturer && (
                          <span className="block text-[10px] text-[#8c7770]">{prod.resolved_manufacturer}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate font-semibold text-[#2b201a]">
                        {prod.product_title || prod.raw_description}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#5e4d46] font-medium">{prod.category || "—"}</span>
                        {prod.unspsc_code && (
                          <span className="block font-mono text-[10px] text-[#5b21b6]">UNSPSC: {prod.unspsc_code}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Object.entries(prod.extracted_attributes || {}).slice(0, 3).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-md text-[10px] text-[#065f46] font-mono font-semibold">
                              {k}: {String(v)}
                            </span>
                          ))}
                          {Object.keys(prod.extracted_attributes || {}).length > 3 && (
                            <span className="text-[10px] text-[#8c7770]">+{Object.keys(prod.extracted_attributes).length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge 
                          variant={
                            prod.review_status === "AUTO_APPROVED" ? "green" : 
                            prod.review_status === "REVIEWED_APPROVED" ? "pink" : 
                            prod.review_status === "NEEDS_REVIEW" ? "warning" : "danger"
                          }
                          size="sm"
                        >
                          {prod.review_status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(prod, null, 2), prod.id)}
                            title="Copy Enriched JSON"
                            className="p-1.5 rounded-xl bg-[#faf6f6] hover:bg-[#fff0f0] text-[#6e5d56] hover:text-[#2b201a] border border-[#e8dede] transition cursor-pointer"
                          >
                            {copiedId === prod.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => handleOpenComparison(prod)}
                            className="text-xs"
                          >
                            Compare
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Split-Screen Before/After Comparison Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#2b201a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#b18597] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_64px_rgba(177,133,151,0.25)] p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e8dede] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#2b201a]">Split-Screen Before / After Comparison</h2>
                  <Badge variant="purple">SKU: {selectedProduct.canonical_sku}</Badge>
                </div>
                <p className="text-xs text-[#5e4d46] mt-0.5">
                  Raw supplier record mapped directly against AI-standardized e-commerce record
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 hover:bg-[#fff0f0] rounded-xl text-[#8c7770] hover:text-[#2b201a] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingComparison ? (
              <div className="py-12 text-center text-xs font-mono text-[#8c7770]">Loading comparison details...</div>
            ) : comparisonData ? (
              <div className="space-y-6">
                {/* Changed Fields Highlighting Pills */}
                <div className="p-4 bg-[#faf6f6] border border-[#e8dede] rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider">
                    Enriched / Normalized Fields:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonData.changed_fields.map((f, i) => (
                      <Badge key={i} variant="green" size="sm">
                        + {f}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Split Comparison Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Original Record */}
                  <div className="bg-[#faf6f6] border-2 border-[#e8dede] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8dede] pb-2">
                      <span className="text-xs font-bold text-[#8c7770] uppercase tracking-wider font-mono">
                        Original Supplier Record (Before)
                      </span>
                      <span className="text-[10px] text-[#8c7770] font-mono">Raw Input Feed</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Raw Brand</span>
                        <span className="font-mono text-[#5e4d46] font-semibold">
                          {comparisonData.raw_record.brand || <em className="text-[#92400e]">Missing / Unbranded</em>}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Raw Description</span>
                        <p className="font-mono text-[#382b22] bg-[#ffffff] p-3 rounded-xl border border-[#e8dede] break-words">
                          {comparisonData.raw_record.description}
                        </p>
                      </div>

                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Raw Category</span>
                        <span className="text-[#5e4d46]">{comparisonData.raw_record.category || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Enriched Record */}
                  <div className="bg-[#fff0f0] border-2 border-[#b18597] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#b18597]/40 pb-2">
                      <span className="text-xs font-bold text-[#382b22] uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#b18597]" />
                        AI Enriched Record (After)
                      </span>
                      <Badge variant="green" size="sm">Score: {Math.round(comparisonData.confidence_score * 100)}%</Badge>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Standardized Brand &amp; Mfr</span>
                        <span className="font-bold text-[#065f46]">
                          {comparisonData.enriched_record.brand}
                        </span>
                        {comparisonData.enriched_record.manufacturer && (
                          <span className="text-[#5e4d46] block text-[11px]">
                            Mfr: {comparisonData.enriched_record.manufacturer}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Standardized Product Title</span>
                        <p className="font-bold text-[#2b201a] bg-[#ffffff] p-3 rounded-xl border border-[#b18597]">
                          {comparisonData.enriched_record.title}
                        </p>
                      </div>

                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Taxonomy &amp; UNSPSC</span>
                        <span className="text-[#2b201a] font-semibold">{comparisonData.enriched_record.category} &rarr; {comparisonData.enriched_record.subcategory}</span>
                        <span className="block font-mono text-[#5b21b6] text-[10px]">Code: {comparisonData.enriched_record.unspsc}</span>
                      </div>

                      <div>
                        <span className="text-[#8c7770] block text-[10px] uppercase font-mono">Extracted Attributes</span>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          {Object.entries(comparisonData.enriched_record.attributes || {}).map(([k, v]) => (
                            <div key={k} className="p-2 bg-[#ffffff] rounded-xl border border-[#e8dede]">
                              <span className="text-[10px] text-[#8c7770] block font-mono uppercase">{k}</span>
                              <span className="font-mono text-[#065f46] font-bold">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multi-tier Descriptions View */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[#faf6f6] border border-[#e8dede] rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-[#2b201a]">Mobile Description (1-2 sentences):</span>
                    <p className="text-xs text-[#5e4d46] leading-relaxed">
                      {comparisonData.enriched_record.mobile_description}
                    </p>
                  </div>

                  <div className="p-4 bg-[#faf6f6] border border-[#e8dede] rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-[#2b201a]">E-Commerce Long Description:</span>
                    <p className="text-xs text-[#5e4d46] leading-relaxed">
                      {comparisonData.enriched_record.long_description}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-4 border-t border-[#e8dede]">
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
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
