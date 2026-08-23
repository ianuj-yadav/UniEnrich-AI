"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { parseDatasheetOcr, listBatches, appendProductToBatch, BatchItem, DatasheetOcrResult } from "@/lib/api";

function intConf(score: number) {
  return Math.round(score * 100);
}

export default function DatasheetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<DatasheetOcrResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadBatches() {
      try {
        const list = await listBatches();
        setBatches(list);
        if (list.length > 0) {
          setSelectedBatchId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBatches();
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setErrorMsg(null);
    setParsedResult(null);
    setImportSuccess(null);

    try {
      const res = await parseDatasheetOcr(uploadedFile);
      setParsedResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to extract OCR specs from datasheet");
    } finally {
      setLoading(false);
    }
  };

  const handleImportToBatch = async () => {
    if (!parsedResult || !selectedBatchId) return;
    setImporting(true);
    try {
      await appendProductToBatch(selectedBatchId, {
        raw_sku: parsedResult.detected_sku,
        raw_brand: parsedResult.detected_brand,
        raw_description: `${parsedResult.detected_brand} ${parsedResult.category} with extracted specifications`,
        raw_category: parsedResult.category,
        product_title: `${parsedResult.detected_brand} ${parsedResult.category} (${parsedResult.detected_sku})`,
        resolved_brand: parsedResult.detected_brand,
        category: parsedResult.category,
        extracted_attributes: parsedResult.technical_specs,
        confidence_score: parsedResult.confidence_score,
        review_status: "AUTO_APPROVED"
      });
      setImportSuccess(`Successfully appended SKU ${parsedResult.detected_sku} to catalog feed.`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to import product into selected batch.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Vision AI</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Multimodal Document Lab
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Datasheet &amp; Blueprint OCR Extraction Lab
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Upload manufacturer PDF specification sheets, engineering drawings, and CAD diagrams. Vision AI parses dimension tables, pressure ratings, and compliance certifications directly into structured catalog records.
          </p>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Dropzone */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border-2 border-[#e8dede] p-6 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
            <div className="border-b border-[#e8dede] pb-3">
              <h3 className="text-sm font-bold text-[#2b201a]">Upload Spec Sheet</h3>
              <p className="text-xs text-[#8c7770]">PDF, PNG, JPG diagrams or CAD specification sheets</p>
            </div>

            <label 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#e8dede] hover:border-[#b18597] rounded-2xl bg-[#faf6f6] transition cursor-pointer group"
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
              <div className="w-12 h-12 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] flex items-center justify-center text-[#382b22] group-hover:scale-105 transition mb-3">
                <UploadCloud className="w-6 h-6 text-[#b18597]" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-[#2b201a]">Click or drag &amp; drop datasheet</span>
                <p className="text-[11px] text-[#8c7770] mt-0.5 font-mono">PDF spec sheets, blueprint schematics, dimension tables</p>
              </div>
            </label>

            {file && (
              <div className="p-3 rounded-2xl bg-[#fff0f0] border border-[#b18597] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#b18597] shrink-0" />
                  <span className="text-[#382b22] font-semibold truncate">{file.name}</span>
                </div>
                <Badge variant="pink" size="sm">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}

            {/* Demo Sample Button */}
            <button
              onClick={() => {
                const demoContent = "MODEL: HYD-SS-3000\nMANUFACTURER: Parker Hannifin\nSIZE: 1/2 IN\nMATERIAL: Stainless Steel 316\nMAX PRESSURE: 3000 PSI\nTEMP: -40F to 450F\nSTANDARDS: ANSI B16.5, ASME Section VIII";
                const dummyFile = new File([demoContent], "Parker_Hydraulic_Fitting_Datasheet.pdf", { type: "application/pdf" });
                handleFileUpload(dummyFile);
              }}
              className="w-full py-3 bg-[#faf6f6] hover:bg-[#fff0f0] text-[#382b22] border-2 border-[#e8dede] hover:border-[#b18597] rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b18597]" /> Load Demo Hydraulic Datasheet
            </button>
          </div>
        </div>

        {/* Extraction Preview & Batch Ingestion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-5">
            <div className="border-b border-[#e8dede] pb-3">
              <h3 className="text-sm font-bold text-[#2b201a]">Extracted Technical Specifications</h3>
              <p className="text-xs text-[#8c7770]">Vision AI parsed attributes, tolerances &amp; ISO compliance</p>
            </div>

            {loading && (
              <div className="py-16 text-center text-[#8c7770] space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#b18597] mx-auto" />
                <p className="text-xs font-mono font-bold">Analyzing document structure &amp; CAD dimension tables...</p>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#fef2f2] border-2 border-[#fecaca] text-[#991b1b] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {importSuccess && (
              <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10b981]" />
                <span>{importSuccess}</span>
              </div>
            )}

            {parsedResult && !loading && (
              <div className="space-y-5 animate-in fade-in">
                {/* Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                    <div className="text-[#8c7770] text-[10px] uppercase font-mono font-bold">Detected SKU</div>
                    <div className="font-mono text-[#1e40af] font-bold truncate mt-0.5">{parsedResult.detected_sku}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                    <div className="text-[#8c7770] text-[10px] uppercase font-mono font-bold">Brand</div>
                    <div className="text-[#065f46] font-bold truncate mt-0.5">{parsedResult.detected_brand}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                    <div className="text-[#8c7770] text-[10px] uppercase font-mono font-bold">Category</div>
                    <div className="text-[#2b201a] font-semibold truncate mt-0.5">{parsedResult.category}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                    <div className="text-[#8c7770] text-[10px] uppercase font-mono font-bold">Confidence</div>
                    <div className="text-[#5b21b6] font-mono font-bold mt-0.5">{intConf(parsedResult.confidence_score)}%</div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-2.5">
                  <span className="text-xs font-mono font-bold text-[#8c7770] uppercase tracking-wider">Engineering Attributes</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(parsedResult.technical_specs).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl bg-[#ffffff] border border-[#e8dede]">
                        <span className="text-[#8c7770] text-[10px] font-mono uppercase font-bold block">{key}:</span>
                        <span className="text-[#065f46] font-mono font-bold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance & Standards */}
                <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#065f46] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Compliance &amp; Certifications
                  </div>
                  <p className="text-[#065f46]/90 font-medium">{parsedResult.compliance}</p>
                </div>

                {/* Import to Feed Action */}
                <div className="p-4 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto flex-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-[#5e4d46] block mb-1">Target Catalog Batch:</label>
                    <select 
                      value={selectedBatchId} 
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#b18597] rounded-xl px-3 py-1.5 text-xs text-[#2b201a] font-semibold focus:outline-none"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.filename} ({b.total_records} SKUs)</option>
                      ))}
                    </select>
                  </div>

                  <PopButton
                    onClick={handleImportToBatch}
                    disabled={importing}
                    className="w-full sm:w-auto px-5 py-3 text-xs justify-center shrink-0 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>{importing ? "APPENDING..." : "APPEND TO MASTER CATALOG"}</span>
                    </span>
                  </PopButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
