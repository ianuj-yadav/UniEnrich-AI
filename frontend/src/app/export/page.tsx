"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  ArrowDownToLine,
  Filter
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getExportUrl, listBatches, BatchItem } from "@/lib/api";

export const dynamic = "force-dynamic";

function ExportContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchIdFromUrl);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx" | "json">("csv");
  const [exportStatus, setExportStatus] = useState<string>("ALL");

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

  const activeBatch = batches.find((b) => b.id === selectedBatchId);

  const handleDownload = () => {
    if (!selectedBatchId) return;
    const downloadUrl = getExportUrl(selectedBatchId, exportFormat, exportStatus);
    window.location.href = downloadUrl;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="green">Stage 6</Badge>
          <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">
            Standardized Catalog Export
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white-50">Export Center</h1>
        <p className="text-sm text-grey-200">
          Generate clean, normalized, search-ready product catalogs in CSV, Excel, or JSON format.
        </p>
      </div>

      {/* Configuration Card */}
      <Card title="Export Configuration" subtitle="Select target file format and record filtering criteria">
        <div className="space-y-6">
          {/* Feed Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-grey-200 block">Catalog Batch Feed</label>
            <select
              value={selectedBatchId || ""}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-black-900 border border-black-600 rounded-lg p-3 text-sm text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} — {b.total_records} SKUs (Uploaded {new Date(b.uploaded_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Format Selection (CSV, XLSX, JSON) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-grey-200 block">Output Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("csv")}
                className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                  exportFormat === "csv"
                    ? "bg-blue-600/20 border-blue-500 text-white-50"
                    : "bg-black-900 border-black-600 text-grey-300 hover:border-grey-400"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold">Standard CSV</div>
                  <p className="text-xs text-grey-400 mt-0.5">Compatible with Excel, ERP, and database loaders.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("xlsx")}
                className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                  exportFormat === "xlsx"
                    ? "bg-green-600/20 border-green-500 text-white-50"
                    : "bg-black-900 border-black-600 text-grey-300 hover:border-grey-400"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold">Microsoft Excel (.xlsx)</div>
                  <p className="text-xs text-grey-400 mt-0.5">Formatted workbook with structured column headers.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                  exportFormat === "json"
                    ? "bg-purple-600/20 border-purple-500 text-white-50"
                    : "bg-black-900 border-black-600 text-grey-300 hover:border-grey-400"
                }`}
              >
                <FileCode className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold">Structured JSON</div>
                  <p className="text-xs text-grey-400 mt-0.5">Full nested key-value pairs for API ingestion.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-grey-200 block">Record Scope</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "ALL", label: "All Products (100%)" },
                { id: "AUTO_APPROVED", label: "Auto-Approved Only (>=70%)" },
                { id: "REVIEWED_APPROVED", label: "Human Verified Only" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExportStatus(opt.id)}
                  className={`p-2.5 rounded-md border text-xs font-medium transition-colors ${
                    exportStatus === opt.id
                      ? "bg-black-700 border-blue-400 text-blue-400"
                      : "bg-black-900 border-black-600 text-grey-300 hover:text-white-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Security & Injection Protection Notice */}
          <div className="p-4 bg-black-900 border border-black-600 rounded-lg flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-white-100">Formula Injection Protection Active:</span>
              <p className="text-grey-300 text-[11px] mt-0.5">
                All cells starting with <code className="text-lime-300 font-mono">=</code>, <code className="text-lime-300 font-mono">+</code>, <code className="text-lime-300 font-mono">-</code>, or <code className="text-lime-300 font-mono">@</code> are sanitized to prevent Excel DDE execution.
              </p>
            </div>
          </div>

          {/* Download Trigger Button */}
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowDownToLine className="w-5 h-5" />}
            onClick={handleDownload}
            disabled={!selectedBatchId}
            className="w-full"
          >
            Download Enriched Catalog ({exportFormat.toUpperCase()})
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-grey-300">Loading export center...</div>}>
      <ExportContent />
    </Suspense>
  );
}
