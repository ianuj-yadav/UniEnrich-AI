"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Code, 
  CheckCircle2, 
  Layers, 
  ShoppingBag, 
  Database,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { getExportUrl, listBatches, BatchItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function ExportContent() {
  const searchParams = useSearchParams();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(searchParams.get("batch_id") || "");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "shopify" | "magento">("standard");

  useEffect(() => {
    listBatches().then((b) => {
      setBatches(b);
      if (b.length > 0 && !selectedBatchId) {
        setSelectedBatchId(b[0].id);
      }
    }).catch(console.error);
  }, []);

  const handleDownload = (format: "csv" | "xlsx" | "json") => {
    if (!selectedBatchId) return;
    const url = getExportUrl(selectedBatchId, format, selectedStatus, selectedTemplate);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Multi-Channel Export Center</h1>
            <Badge variant="blue" size="sm">Formula Injection Protected</Badge>
          </div>
          <p className="text-xs text-grey-400 mt-1">
            Export sanitized, search-ready product catalogs tailored for Shopify, Magento, Akeneo PIM, or Master MRO schemas.
          </p>
        </div>
      </div>

      {/* Target Batch Selector */}
      <Card title="Export Configuration" subtitle="Select source catalog and approval filter">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-grey-300 block mb-1.5">Catalog Batch Feed:</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-black-950 border border-black-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} ({b.total_records} SKUs) - {b.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-grey-300 block mb-1.5">Approval Status Filter:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-black-950 border border-black-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="ALL">All Enriched Products</option>
              <option value="AUTO_APPROVED">Auto-Approved (&ge;70% Confidence)</option>
              <option value="REVIEWED_APPROVED">Human-Reviewed &amp; Approved (100%)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Channel Profile Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-grey-400 uppercase tracking-wider">Select Channel Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile: Standard MRO */}
          <div 
            onClick={() => setSelectedTemplate("standard")}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedTemplate === "standard" 
                ? "bg-blue-950/30 border-blue-500 ring-1 ring-blue-500/50" 
                : "bg-black-900 border-black-800 hover:border-black-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white text-sm">Standard MRO Schema</span>
              </div>
              {selectedTemplate === "standard" && <Badge variant="blue" size="sm">Active</Badge>}
            </div>
            <p className="text-xs text-grey-400">Master 17-column catalog schema with UNSPSC, canonical brands, and structured attribute keys.</p>
          </div>

          {/* Profile: Shopify */}
          <div 
            onClick={() => setSelectedTemplate("shopify")}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedTemplate === "shopify" 
                ? "bg-green-950/30 border-green-500 ring-1 ring-green-500/50" 
                : "bg-black-900 border-black-800 hover:border-black-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-white text-sm">Shopify Products CSV</span>
              </div>
              {selectedTemplate === "shopify" && <Badge variant="green" size="sm">Active</Badge>}
            </div>
            <p className="text-xs text-grey-400">Formatted with Handles, HTML Descriptions, Vendor mapping, Category tags, and Variant SKUs.</p>
          </div>

          {/* Profile: Magento 2 */}
          <div 
            onClick={() => setSelectedTemplate("magento")}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedTemplate === "magento" 
                ? "bg-orange-950/30 border-orange-500 ring-1 ring-orange-500/50" 
                : "bg-black-900 border-black-800 hover:border-black-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white text-sm">Magento 2 / Adobe</span>
              </div>
              {selectedTemplate === "magento" && <Badge variant="orange" size="sm">Active</Badge>}
            </div>
            <p className="text-xs text-grey-400">Native Magento import schema with attribute sets, short descriptions, and category path mapping.</p>
          </div>
        </div>
      </div>

      {/* Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CSV */}
        <Card title="CSV Format (.csv)" subtitle="Universal spreadsheet & database feed">
          <div className="p-4 space-y-4">
            <div className="p-3 rounded bg-black-950 border border-black-800 text-xs text-grey-400 space-y-1">
              <div>&bull; UTF-8 encoded with standard comma delimiters</div>
              <div>&bull; Formula injection escaping on (=, +, -, @)</div>
            </div>
            <Button
              onClick={() => handleDownload("csv")}
              disabled={!selectedBatchId}
              variant="primary"
              size="sm"
              className="w-full"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download CSV ({selectedTemplate.toUpperCase()})
            </Button>
          </div>
        </Card>

        {/* Excel */}
        <Card title="Excel Workbook (.xlsx)" subtitle="Formatted Microsoft Excel sheet">
          <div className="p-4 space-y-4">
            <div className="p-3 rounded bg-black-950 border border-black-800 text-xs text-grey-400 space-y-1">
              <div>&bull; Multi-column table with freeze panes</div>
              <div>&bull; Auto-width column formatting</div>
            </div>
            <Button
              onClick={() => handleDownload("xlsx")}
              disabled={!selectedBatchId}
              variant="green"
              size="sm"
              className="w-full"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Download Excel (.xlsx)
            </Button>
          </div>
        </Card>

        {/* JSON */}
        <Card title="JSON Feed (.json)" subtitle="REST API & Akeneo PIM Payload">
          <div className="p-4 space-y-4">
            <div className="p-3 rounded bg-black-950 border border-black-800 text-xs text-grey-400 space-y-1">
              <div>&bull; Nested key-value attributes &amp; confidence scores</div>
              <div>&bull; Ready for direct PIM / Headless ingest</div>
            </div>
            <Button
              onClick={() => handleDownload("json")}
              disabled={!selectedBatchId}
              variant="purple"
              size="sm"
              className="w-full"
            >
              <Code className="w-3.5 h-3.5 mr-1.5" /> Download JSON Feed
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-grey-400">Loading Export Center...</div>}>
      <ExportContent />
    </Suspense>
  );
}
