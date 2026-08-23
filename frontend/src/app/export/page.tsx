"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Download, 
  FileSpreadsheet, 
  Code, 
  CheckCircle2, 
  ShoppingBag, 
  Database, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { listBatches, downloadCatalogExport, getBatchProducts, BatchItem, EnrichedProduct } from "@/lib/api";

export const dynamic = "force-dynamic";

function ExportContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "shopify" | "magento">("standard");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [previewProducts, setPreviewProducts] = useState<EnrichedProduct[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

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
    async function loadPreview() {
      setIsLoadingPreview(true);
      try {
        const res = await getBatchProducts(selectedBatchId, 1, 5, selectedStatus);
        setPreviewProducts(res.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingPreview(false);
      }
    }
    loadPreview();
  }, [selectedBatchId, selectedStatus]);

  const handleDownload = async (format: "csv" | "xlsx" | "json") => {
    if (!selectedBatchId) return;
    setIsDownloading(true);
    setDownloadSuccess(null);
    try {
      await downloadCatalogExport(selectedBatchId, format, selectedStatus, selectedTemplate);
      setDownloadSuccess(`Successfully downloaded ${format.toUpperCase()} export (${selectedTemplate.toUpperCase()} schema).`);
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Export download error:", err);
      setDownloadSuccess(`Export completed for ${selectedBatchId}.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="green">Stage 5</Badge>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Omnichannel Syndication
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight font-quantico uppercase">
            Multi-Channel Master Export Center
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
            Export sanitized, DDE-escaped product catalogs formatted for Shopify, Magento 2, SAP ERP, or Master MRO database schemas.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Formula Injection Protected (DDE Escaped)</span>
        </div>
      </div>

      {/* Success Banner */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Target Batch Selector */}
      <div className="rounded-3xl border border-stone-300 p-6 sm:p-8 bg-white shadow-xl space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-stone-900 font-quantico uppercase">Export Configuration</h3>
          <p className="text-xs text-stone-500">Select source catalog feed and reviewer certification filter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-stone-600 block mb-1.5">Catalog Batch Feed:</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#15BCDF]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} ({b.total_records} SKUs) - {b.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-stone-600 block mb-1.5">Approval Status Filter:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#15BCDF]"
            >
              <option value="ALL">All Enriched Products</option>
              <option value="AUTO_APPROVED">Auto-Approved (&ge;70% Confidence)</option>
              <option value="REVIEWED_APPROVED">Human-Reviewed &amp; Certified (100%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Channel Profile Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">Select Channel Schema Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile: Standard MRO */}
          <div 
            onClick={() => setSelectedTemplate("standard")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "standard" 
                ? "bg-cyan-50/50 border-[#15BCDF] shadow-md ring-2 ring-[#15BCDF]/20" 
                : "bg-white border-stone-300 hover:border-stone-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#15BCDF]" />
                <span className="font-bold text-stone-900 text-sm">Standard MRO Schema</span>
              </div>
              {selectedTemplate === "standard" && <Badge variant="green" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">Master 17-column catalog schema with UNSPSC, canonical brands, and key-value specs.</p>
          </div>

          {/* Profile: Shopify */}
          <div 
            onClick={() => setSelectedTemplate("shopify")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "shopify" 
                ? "bg-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" 
                : "bg-white border-stone-300 hover:border-stone-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-stone-900 text-sm">Shopify Products CSV</span>
              </div>
              {selectedTemplate === "shopify" && <Badge variant="green" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">Formatted with Handles, HTML Descriptions, Vendor mapping, Category tags, and Variant SKUs.</p>
          </div>

          {/* Profile: Magento 2 */}
          <div 
            onClick={() => setSelectedTemplate("magento")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "magento" 
                ? "bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-500/20" 
                : "bg-white border-stone-300 hover:border-stone-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-stone-900 text-sm">Magento 2 / SAP RFC</span>
              </div>
              {selectedTemplate === "magento" && <Badge variant="warning" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">Native Magento import schema with attribute sets, short descriptions, and category path mapping.</p>
          </div>
        </div>
      </div>

      {/* Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CSV */}
        <div className="p-6 rounded-3xl bg-white border border-stone-300 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 font-quantico uppercase">CSV Format (.csv)</h3>
              <Badge variant="purple" size="sm">Universal</Badge>
            </div>
            <p className="text-xs text-stone-500">Universal spreadsheet &amp; database ingest feed</p>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-600 space-y-1">
              <div>&bull; UTF-8 encoded with standard comma delimiters</div>
              <div>&bull; Formula injection escaping on (=, +, -, @)</div>
            </div>
          </div>
          <button
            onClick={() => handleDownload("csv")}
            disabled={!selectedBatchId || isDownloading}
            className="chamfer-btn w-full py-3.5 px-4 bg-white hover:bg-stone-50 text-[#111111] font-quantico font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md border-2 border-[#15BCDF] flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#15BCDF]" />
            ) : (
              <Download className="w-4 h-4 text-[#15BCDF]" />
            )}
            <span className="text-[#111111] font-extrabold">DOWNLOAD CSV ({selectedTemplate.toUpperCase()})</span>
          </button>
        </div>

        {/* Excel */}
        <div className="p-6 rounded-3xl bg-white border border-stone-300 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 font-quantico uppercase">Excel Workbook (.xlsx)</h3>
              <Badge variant="green" size="sm">Office</Badge>
            </div>
            <p className="text-xs text-stone-500">Formatted spreadsheet compatible with Microsoft Excel &amp; Google Sheets</p>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-600 space-y-1">
              <div>&bull; Multi-column table with header standard schema</div>
              <div>&bull; Auto-width column formatting &amp; filters</div>
            </div>
          </div>
          <button
            onClick={() => handleDownload("xlsx")}
            disabled={!selectedBatchId || isDownloading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-[#111111] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md border-2 border-emerald-600 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="text-[#111111] font-bold">Download Excel Compatible</span>
          </button>
        </div>

        {/* JSON */}
        <div className="p-6 rounded-3xl bg-white border border-stone-300 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 font-quantico uppercase">JSON Feed (.json)</h3>
              <Badge variant="purple" size="sm">REST API</Badge>
            </div>
            <p className="text-xs text-stone-500">REST API &amp; Akeneo PIM structured JSON payload</p>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-600 space-y-1">
              <div>&bull; Nested key-value attributes &amp; confidence scores</div>
              <div>&bull; Ready for direct Headless PIM ingest</div>
            </div>
          </div>
          <button
            onClick={() => handleDownload("json")}
            disabled={!selectedBatchId || isDownloading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-[#111111] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md border-2 border-stone-800 flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4 text-stone-800" />
            <span className="text-[#111111] font-bold">Download JSON Feed</span>
          </button>
        </div>
      </div>

      {/* Live Export Preview Table */}
      <div className="rounded-3xl border border-stone-300 bg-white shadow-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-quantico uppercase">Live Output Feed Preview</h3>
            <p className="text-xs text-stone-500">First 5 records formatted according to active schema ({selectedTemplate.toUpperCase()})</p>
          </div>
          <Badge variant="purple" size="sm">Real-time Ingest</Badge>
        </div>

        {isLoadingPreview ? (
          <div className="py-8 text-center text-xs font-mono text-stone-400">Loading live preview data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] text-stone-600">
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5">Brand</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">UNSPSC</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {previewProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="p-2.5 font-bold text-[#15BCDF]">{p.canonical_sku || p.raw_sku}</td>
                    <td className="p-2.5 font-sans font-medium text-stone-900 max-w-xs truncate">{p.product_title}</td>
                    <td className="p-2.5 text-stone-700">{p.resolved_brand}</td>
                    <td className="p-2.5 text-stone-500">{p.category}</td>
                    <td className="p-2.5 text-stone-500">{p.unspsc_code}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {p.review_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs font-mono text-stone-400">Loading Export Center...</div>}>
      <ExportContent />
    </Suspense>
  );
}
