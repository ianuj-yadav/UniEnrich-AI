"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  Loader2,
  Cpu,
  FileCheck
} from "lucide-react";
import { parseDatasheetFile, importDatasheetToBatch, listBatches, BatchItem, ParsedDatasheetResult } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function DatasheetLabPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<ParsedDatasheetResult | null>(null);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [targetBatchId, setTargetBatchId] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    listBatches().then((b) => {
      setBatches(b);
      if (b.length > 0) setTargetBatchId(b[0].id);
    }).catch(console.error);
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setErrorMsg("");
    setParsedResult(null);
    setImportSuccess("");

    try {
      const res = await parseDatasheetFile(uploadedFile);
      setParsedResult(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse datasheet");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!parsedResult || !targetBatchId) return;

    setImporting(true);
    setImportSuccess("");
    setErrorMsg("");

    try {
      const res = await importDatasheetToBatch(targetBatchId, parsedResult);
      setImportSuccess(res.message);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to import into batch");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Datasheet & Spec Sheet OCR Lab</h1>
            <Badge variant="purple" size="sm">Multi-Modal Vision AI</Badge>
          </div>
          <p className="text-xs text-grey-400 mt-1">
            Extract CAD dimensions, material specs, electrical ratings, and certifications from technical PDF datasheets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Dropzone */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="Upload Engineering Datasheet" subtitle="Supports PDF, PNG, JPG spec sheets">
            <div className="p-4 space-y-4">
              <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-black-700 hover:border-purple-500 rounded-xl bg-black-950/60 transition cursor-pointer group"
              >
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg,.txt" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }} 
                />
                <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-600/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-white">Click or drag & drop datasheet</span>
                  <p className="text-[11px] text-grey-500 mt-0.5">PDF spec sheets, blueprint schematics, dimension tables</p>
                </div>
              </label>

              {file && (
                <div className="p-3 rounded bg-black-800 border border-black-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-white truncate">{file.name}</span>
                  </div>
                  <Badge variant="blue" size="sm">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}

              {/* Demo Sample Button */}
              <button
                onClick={() => {
                  const demoContent = "MODEL: HYD-SS-3000\\nMANUFACTURER: Parker Hannifin\\nSIZE: 1/2 IN\\nMATERIAL: Stainless Steel 316\\nMAX PRESSURE: 3000 PSI\\nTEMP: -40F to 450F\\nSTANDARDS: ANSI B16.5, ASME Section VIII";
                  const dummyFile = new File([demoContent], "Parker_Hydraulic_Fitting_Datasheet.pdf", { type: "application/pdf" });
                  handleFileUpload(dummyFile);
                }}
                className="w-full py-2 bg-black-800 hover:bg-black-700 text-purple-300 border border-purple-900/50 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Demo Hydraulic Datasheet
              </button>
            </div>
          </Card>
        </div>

        {/* Extraction Preview & Batch Ingestion */}
        <div className="lg:col-span-7 space-y-4">
          <Card title="Extracted Technical Specifications" subtitle="Vision AI parsed attributes & compliance">
            <div className="p-4 space-y-4">
              {loading && (
                <div className="py-16 text-center text-grey-400 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                  <p className="text-sm font-medium">Analyzing document structure & technical tables...</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 rounded-lg bg-green-950/40 border border-green-700 text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              {parsedResult && !loading && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-black-950 border border-black-800">
                      <div className="text-grey-500 text-[10px] uppercase">Detected SKU</div>
                      <div className="font-mono text-blue-400 font-medium truncate">{parsedResult.detected_sku}</div>
                    </div>
                    <div className="p-2.5 rounded bg-black-950 border border-black-800">
                      <div className="text-grey-500 text-[10px] uppercase">Brand</div>
                      <div className="text-green-400 font-medium truncate">{parsedResult.detected_brand}</div>
                    </div>
                    <div className="p-2.5 rounded bg-black-950 border border-black-800">
                      <div className="text-grey-500 text-[10px] uppercase">Category</div>
                      <div className="text-white font-medium truncate">{parsedResult.category}</div>
                    </div>
                    <div className="p-2.5 rounded bg-black-950 border border-black-800">
                      <div className="text-grey-500 text-[10px] uppercase">Confidence</div>
                      <div className="text-purple-400 font-medium">{intConf(parsedResult.confidence_score)}%</div>
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-2">
                    <span className="text-xs font-semibold text-grey-400 uppercase tracking-wider">Engineering Attributes</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(parsedResult.technical_specs).map(([key, val]) => (
                        <div key={key} className="p-2 rounded bg-black-900 border border-black-700/60">
                          <span className="text-grey-500 text-[11px] block">{key}:</span>
                          <span className="text-grey-200 font-medium">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance & Standards */}
                  <div className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-lime-400 font-semibold">
                      <ShieldCheck className="w-4 h-4" /> Compliance & Certifications
                    </div>
                    <p className="text-grey-300">{parsedResult.compliance}</p>
                  </div>

                  {/* Import to Feed Action */}
                  <div className="p-4 rounded-lg bg-black-900 border border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="w-full sm:w-auto flex-1">
                      <label className="text-[11px] text-grey-400 block mb-1">Target Catalog Batch:</label>
                      <select 
                        value={targetBatchId} 
                        onChange={(e) => setTargetBatchId(e.target.value)}
                        className="w-full bg-black-950 border border-black-700 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>{b.filename} ({b.total_records} SKUs)</option>
                        ))}
                      </select>
                    </div>
                    <Button 
                      onClick={handleImport}
                      loading={importing}
                      variant="purple" 
                      size="sm"
                      className="w-full sm:w-auto shrink-0 mt-3 sm:mt-0"
                    >
                      <Database className="w-3.5 h-3.5 mr-1.5" /> Import to Catalog
                    </Button>
                  </div>
                </div>
              )}

              {!parsedResult && !loading && (
                <div className="py-16 text-center text-grey-500 space-y-2">
                  <Cpu className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
                  <p className="text-sm font-medium text-grey-400">No datasheet uploaded yet</p>
                  <p className="text-xs text-grey-600 max-w-sm mx-auto">
                    Upload an engineering spec sheet or load the sample above to extract CAD tables and technical limits.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function intConf(val: number): number {
  return Math.round(val * 100);
}
