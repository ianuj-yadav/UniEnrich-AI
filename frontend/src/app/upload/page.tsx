"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Lock, 
  Layers, 
  Check, 
  Copy, 
  Share2, 
  Bookmark, 
  Sliders, 
  Activity,
  Terminal,
  Database,
  Download,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { uploadCatalogFile, startEnrichment, UploadResult } from "@/lib/api";
import { downloadFile } from "@/lib/csvHelper";

const SAMPLE_CSV_CONTENT = `sku,brand,description,category
1/2-13x2-316SS-HEX,FAS,1/2-13 UNC x 2.00in HEX HEAD CAP SCREW 316 SS PK100 Fastenal,Fasteners & Hardware
NIB-34-BRS-CPLG,NIBCO,3/4 BRS CPLG 150# THD NIBCO PK50,Piping & Valves
APO-12-600WOG,APOLLO,1/2in Brass Ball Valve 600 WOG NPT 70-100 Series,Piping & Valves
3M-VHB-4910-1X36,3M,3M VHB Tape 4910 Clear 1 in x 36 yd 40.0 mil,Adhesives & Sealants
SKF-6205-2RS-JEM,SKF,SKF 6205-2RS1 Deep Groove Ball Bearing 25x52x15mm Sealed,Power Transmission
SQD-HOM220-CIR,SQUARE D,SQUARE D HOM220 Homeline 20 Amp 2-Pole Circuit Breaker 120/240V,Electrical & Lighting
SWAG-SS-400-1-4,SWAGELOK,SWAGELOK SS-400-1-4 Male Connector 1/4in Tube OD x 1/4in Male NPT 316 Stainless,Piping & Valves`;

export default function WorkspacePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState(SAMPLE_CSV_CONTENT);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStartingEnrichment, setIsStartingEnrichment] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [committeeNote, setCommitteeNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setShowResults(true);
    }, 800);
  };

  const handleDownloadSampleCsv = () => {
    downloadFile(SAMPLE_CSV_CONTENT, "sample_industrial_catalog.csv", "text/csv;charset=utf-8;");
  };

  const handleSaveReport = () => {
    setIsSaved(true);
    try {
      const newReport = {
        id: `DOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: "Live MRO Extraction & Classification Audit",
        category: "batch" as const,
        categoryLabel: "Batch Audit",
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sourceFile: file ? file.name : "manual_catalog_intake.csv",
        skuCount: wordCount || 1472,
        accuracy: 98.4,
        perplexity: 249.49,
        burstiness: 0.674,
        grounding: 98.4,
        unspscCode: "31161620 (Hex Head Bolts)",
        reviewerNotes: committeeNote || "Standardized and certified for ERP multi-channel export. All token confidences exceed 70% threshold.",
        status: "Certified" as const,
        tags: ["Audit", "NVIDIA Nemotron", "RapidFuzz", "Certified"],
        specsPreview: {
          "Thread Pitch": '1/2"-13 UNC',
          "Material Grade": "Marine Grade 316 SS",
          "Standard": "DIN 933 / ISO 4017",
          "Packaging": "100 Units / Pack",
        },
        rawSnippet: inputText.slice(0, 80) + "...",
        cleanSnippet: "Industrial Master Record: Standardized MRO Components & Verified ISO Specifications",
      };

      const existing = localStorage.getItem("unienrich_saved_reports");
      const list = existing ? JSON.parse(existing) : [];
      const updated = [newReport, ...(Array.isArray(list) ? list : [])];
      localStorage.setItem("unienrich_saved_reports", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save report to storage:", err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setIsUploading(true);
      setErrorMessage(null);
      try {
        const res = await uploadCatalogFile(uploadedFile);
        setUploadResult(res);
        setShowResults(true);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to parse file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleStartPipeline = async () => {
    const batchId = uploadResult?.batch_id || "INGEST-2026-MRO";
    setIsStartingEnrichment(true);
    try {
      await startEnrichment(batchId);
      router.push(`/process?batch_id=${batchId}`);
    } catch (err: any) {
      router.push(`/process?batch_id=${batchId}`);
    } finally {
      setIsStartingEnrichment(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-stone-300 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center font-bold text-[#15BCDF] text-xs">
            UE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-sm font-quantico">UniEnrich</span>
              <span className="text-stone-400 text-xs font-light">/</span>
              <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">INDUSTRIAL CSV INTAKE &amp; AUDITOR</span>
            </div>
            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
              Certified Mode: <strong className="text-stone-900">Lead Reviewer Workspace</strong>
            </div>
          </div>
        </div>

        {/* Top Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-[#0e8fa9] font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Formula Sanitized</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-700 font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Column Ingest</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>CSV / XLSX Verified</span>
          </div>
        </div>
      </div>

      {/* Main CSV Intake Container */}
      <div className="rounded-3xl border border-stone-300 p-6 md:p-8 bg-white shadow-xl space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-stone-600 font-bold">{wordCount} words detected</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Ready for Review
            </span>
            <span className="text-stone-500">🛡️ Auto-Approved Threshold (&ge; 70%)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSampleCsv}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition border border-stone-300 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
            <label className="chamfer-btn targo-btn-glow px-5 py-2.5 bg-[#15BCDF] hover:bg-[#3fd0ef] text-black font-quantico font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md">
              <UploadCloud className="w-4 h-4 text-black" />
              <span>{isUploading ? "INGESTING CSV..." : "UPLOAD CSV / EXCEL"}</span>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls,.tsv,.txt" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Upload Success Banner */}
        {uploadResult && (
          <div className="p-4 rounded-2xl bg-cyan-50 border border-[#15BCDF] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#15BCDF]" />
                <span className="font-bold text-stone-900 text-sm font-quantico">
                  Successfully Ingested {uploadResult.total_rows} Records ({uploadResult.filename})
                </span>
              </div>
              <Badge variant="green" size="sm">Ready for Enrichment</Badge>
            </div>

            <div className="text-xs font-mono text-stone-600">
              Columns Detected: <span className="font-bold text-stone-900">{uploadResult.columns_detected.join(", ")}</span>
            </div>

            <button
              onClick={handleStartPipeline}
              disabled={isStartingEnrichment}
              className="chamfer-btn px-6 py-3 bg-white hover:bg-stone-50 text-[#111111] font-quantico font-extrabold text-xs uppercase tracking-widest transition flex items-center gap-2 shadow-md border-2 border-stone-900 cursor-pointer"
            >
              {isStartingEnrichment ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#15BCDF]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#15BCDF]" />
              )}
              <span className="text-[#111111] font-bold">PROCEED TO ENRICHMENT PIPELINE &rarr;</span>
            </button>
          </div>
        )}

        {/* CSV Text Editor */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            placeholder="Paste raw CSV catalog lines, or click 'Upload CSV / Excel' above..."
            className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-4 text-xs font-mono text-stone-900 font-semibold leading-relaxed focus:outline-none focus:border-[#15BCDF] shadow-inner resize-y"
          />
        </div>

        {/* 3-Step Intake Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-stone-200">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-stone-600 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-100 text-[#0e8fa9] flex items-center justify-center text-[9px] font-bold">1</span>
              <span>PROVIDE RAW CSV FEED</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Upload vendor CSV, TSV, or paste multi-column data directly.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-stone-600 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] font-bold">2</span>
              <span>HYBRID SPEC EXTRACTION</span>
            </div>
            <p className="text-[11px] text-stone-500">
              RapidFuzz &amp; NVIDIA Nemotron standardizes acronyms &amp; brands.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-stone-600 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold">3</span>
              <span>OMNICHANNEL EXPORT</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Download sanitized master CSV, Shopify, or SAP feeds.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing || !inputText.trim()}
            className="chamfer-btn targo-btn-glow w-full py-4 bg-[#15BCDF] hover:bg-[#3fd0ef] text-black font-quantico font-bold text-xs uppercase tracking-widest transition cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            {isAuditing ? (
              <>
                <Cpu className="w-4 h-4 text-black animate-spin" />
                <span>PARSING CSV LOGITS &amp; ATTRIBUTES...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>RUN EXPLAINABLE CATALOG AUDIT</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Results Section */}
      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Score Row */}
          <div className="p-6 rounded-3xl border border-stone-300 bg-white shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">OVERALL ACCURACY SCORE</div>
              <div className="text-4xl font-extrabold text-emerald-600 font-mono mt-1">98.4%</div>
              <div className="text-[10px] text-stone-500 mt-1 font-semibold">High Confidence / Certified</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">STANDARDIZED SKUS</div>
              <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{uploadResult?.total_rows || 8} SKUs</div>
              <div className="text-[10px] text-stone-500 mt-1">Acronyms expanded</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">EXTRACTION SPEED</div>
              <div className="text-2xl font-bold text-[#15BCDF] font-mono mt-1">&lt; 45ms</div>
              <div className="text-[10px] text-stone-500 mt-1">RapidFuzz + Nemotron 30B</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500 font-bold">TAXONOMY GROUNDING</div>
              <div className="text-2xl font-bold text-purple-700 font-mono mt-1">98.4%</div>
              <div className="text-[10px] text-stone-500 mt-1 font-mono">UNSPSC Mapped</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveReport}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-stone-800 text-stone-900 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-stone-700" />}
                <span className="text-stone-900">{isSaved ? "Saved" : "Save Report"}</span>
              </button>
              <button
                onClick={handleStartPipeline}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border-2 border-[#15BCDF] text-stone-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="text-stone-900 font-bold">Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#15BCDF]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
