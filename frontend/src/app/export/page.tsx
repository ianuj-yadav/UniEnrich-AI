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
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { listBatches, exportCatalogUrl, BatchItem } from "@/lib/api";

export const dynamic = "force-dynamic";

function ExportContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "shopify" | "magento">("standard");

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

  const handleDownload = (format: "csv" | "xlsx" | "json") => {
    if (!selectedBatchId) return;
    const url = exportCatalogUrl(selectedBatchId, format, selectedStatus, selectedTemplate);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="green">Stage 5</Badge>
            <span className="text-xs font-mono font-bold text-[#065f46] uppercase tracking-wider">
              Omnichannel Syndication
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Multi-Channel Master Export Center
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Export sanitized, DDE-escaped product catalogs formatted for Shopify, Magento 2, Akeneo PIM, or Master MRO database schemas.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] text-xs font-mono font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <span>Formula Injection Protected</span>
        </div>
      </div>

      {/* Target Batch Selector */}
      <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
        <div className="border-b border-[#e8dede] pb-3">
          <h3 className="text-sm font-bold text-[#2b201a]">Export Configuration</h3>
          <p className="text-xs text-[#8c7770]">Select source catalog feed and reviewer certification filter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-[#5e4d46] block mb-1.5">Catalog Batch Feed:</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} ({b.total_records} SKUs) - {b.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-[#5e4d46] block mb-1.5">Approval Status Filter:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-xs font-semibold text-[#2b201a] focus:outline-none focus:border-[#b18597]"
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
        <h3 className="text-xs font-mono font-bold text-[#8c7770] uppercase tracking-wider">Select Channel Schema Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile: Standard MRO */}
          <div 
            onClick={() => setSelectedTemplate("standard")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "standard" 
                ? "bg-[#fff0f0] border-[#b18597] shadow-[0_8px_24px_rgba(177,133,151,0.15)]" 
                : "bg-[#ffffff] border-[#e8dede] hover:border-[#b18597]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1e40af]" />
                <span className="font-bold text-[#2b201a] text-sm">Standard MRO Schema</span>
              </div>
              {selectedTemplate === "standard" && <Badge variant="pink" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-[#5e4d46] leading-relaxed">Master 17-column catalog schema with UNSPSC, canonical brands, and key-value specs.</p>
          </div>

          {/* Profile: Shopify */}
          <div 
            onClick={() => setSelectedTemplate("shopify")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "shopify" 
                ? "bg-[#ecfdf5] border-[#a7f3d0] shadow-[0_8px_24px_rgba(16,185,129,0.15)]" 
                : "bg-[#ffffff] border-[#e8dede] hover:border-[#a7f3d0]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#065f46]" />
                <span className="font-bold text-[#2b201a] text-sm">Shopify Products CSV</span>
              </div>
              {selectedTemplate === "shopify" && <Badge variant="green" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-[#5e4d46] leading-relaxed">Formatted with Handles, HTML Descriptions, Vendor mapping, Category tags, and Variant SKUs.</p>
          </div>

          {/* Profile: Magento 2 */}
          <div 
            onClick={() => setSelectedTemplate("magento")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedTemplate === "magento" 
                ? "bg-[#fffbeb] border-[#fde68a] shadow-[0_8px_24px_rgba(245,158,11,0.15)]" 
                : "bg-[#ffffff] border-[#e8dede] hover:border-[#fde68a]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-[#92400e]" />
                <span className="font-bold text-[#2b201a] text-sm">Magento 2 / SAP RFC</span>
              </div>
              {selectedTemplate === "magento" && <Badge variant="warning" size="sm">Selected</Badge>}
            </div>
            <p className="text-xs text-[#5e4d46] leading-relaxed">Native Magento import schema with attribute sets, short descriptions, and category path mapping.</p>
          </div>
        </div>
      </div>

      {/* Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CSV */}
        <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2b201a]">CSV Format (.csv)</h3>
              <Badge variant="pink" size="sm">Universal</Badge>
            </div>
            <p className="text-xs text-[#8c7770]">Universal spreadsheet &amp; database ingest feed</p>
            <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede] text-[11px] font-mono text-[#5e4d46] space-y-1">
              <div>&bull; UTF-8 encoded with standard comma delimiters</div>
              <div>&bull; Formula injection escaping on (=, +, -, @)</div>
            </div>
          </div>
          <PopButton
            onClick={() => handleDownload("csv")}
            disabled={!selectedBatchId}
            className="w-full py-3.5 text-xs justify-center cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD CSV ({selectedTemplate.toUpperCase()})</span>
            </span>
          </PopButton>
        </div>

        {/* Excel */}
        <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2b201a]">Excel Workbook (.xlsx)</h3>
              <Badge variant="green" size="sm">Office</Badge>
            </div>
            <p className="text-xs text-[#8c7770]">Formatted Microsoft Excel workbook with freeze panes</p>
            <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede] text-[11px] font-mono text-[#5e4d46] space-y-1">
              <div>&bull; Multi-column table with header freeze panes</div>
              <div>&bull; Auto-width column formatting &amp; filters</div>
            </div>
          </div>
          <Button
            onClick={() => handleDownload("xlsx")}
            disabled={!selectedBatchId}
            variant="success"
            size="md"
            className="w-full justify-center text-xs py-3"
            icon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Download Excel (.xlsx)
          </Button>
        </div>

        {/* JSON */}
        <div className="p-6 rounded-3xl bg-[#ffffff] border-2 border-[#e8dede] shadow-[0_8px_32px_rgba(177,133,151,0.06)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2b201a]">JSON Feed (.json)</h3>
              <Badge variant="purple" size="sm">REST API</Badge>
            </div>
            <p className="text-xs text-[#8c7770]">REST API &amp; Akeneo PIM structured payload</p>
            <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede] text-[11px] font-mono text-[#5e4d46] space-y-1">
              <div>&bull; Nested key-value attributes &amp; confidence scores</div>
              <div>&bull; Ready for direct Headless PIM ingest</div>
            </div>
          </div>
          <Button
            onClick={() => handleDownload("json")}
            disabled={!selectedBatchId}
            variant="secondary"
            size="md"
            className="w-full justify-center text-xs py-3"
            icon={<Code className="w-4 h-4" />}
          >
            Download JSON Feed
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs font-mono text-[#8c7770]">Loading Export Center...</div>}>
      <ExportContent />
    </Suspense>
  );
}
