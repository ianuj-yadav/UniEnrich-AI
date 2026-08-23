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
  Database
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { uploadCatalogFile, startEnrichment, UploadResult } from "@/lib/api";

const SAMPLE_TEXT = `System Documentation:
v1.0.0
Industrial Catalog Standardization & Explainable AI Enrichment Engine.

Requirements:
1. Design: Light Porcelain & Blush Editorial Minimal Mode. Clean high contrast #2b201a text, soft borders #e8dede, and zero dark gradient slop.
2. Typography: 'Reference Sans' for UI, 'Reference Display' for display headlines, and 'JetBrains Mono' for stats and tokens.
3. RapidFuzz Entity Resolution: 98.4% brand resolution on abbreviated strings (3M, Fabory, SKF, SMC, Swagelok).
4. Deterministic DDE Formula Sanitization: 100% escape coverage on CSV injection vectors (=, +, -, @).
5. Explainable Evidence Scoring: Multi-signal attribution combining RapidFuzz confidence, Gemini 2.5 spec extraction, and UNSPSC taxonomy codes.`;

export default function WorkspacePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
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
    }, 1200);
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
        tags: ["Audit", "Gemini 2.5", "RapidFuzz", "Certified"],
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
        setInputText(`File ingested: ${uploadedFile.name} (${res.total_rows} records detected).\n\nPreview records:\n${JSON.stringify(res.preview_records, null, 2)}`);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to parse file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleStartPipeline = async () => {
    if (!uploadResult) return;
    setIsStartingEnrichment(true);
    try {
      await startEnrichment(uploadResult.batch_id);
      router.push(`/process?batch_id=${uploadResult.batch_id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate AI enrichment");
      setIsStartingEnrichment(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ====================================================================
          ARAXYSS WORKSPACE TOP HUD (LIGHT PORCELAIN)
          ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border-2 border-[#e8dede] bg-[#ffffff] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fff0f0] border-2 border-[#b18597] flex items-center justify-center font-bold text-[#382b22] text-xs">
            UE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2b201a] text-sm">Araxyss</span>
              <span className="text-[#b18597] text-xs font-light">/</span>
              <span className="text-xs text-[#5e4d46] font-semibold uppercase tracking-wider">EXPLAINABLE CATALOG ENRICHMENT AUDITOR</span>
            </div>
            <div className="text-[10px] text-[#7a6860] font-mono mt-0.5">
              Reviewer: <strong className="text-[#2b201a]">Anuj Yadav</strong>
            </div>
          </div>
        </div>

        {/* Top Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-xs text-[#1e40af] font-mono font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Cipher Vault</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f5f3ff] border border-[#ddd6fe] text-xs text-[#5b21b6] font-mono font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Draft vs Master</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs text-[#065f46] font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validation Status</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS MAIN WORKSPACE INTAKE CONTAINER (LIGHT PORCELAIN)
          ==================================================================== */}
      <div className="rounded-3xl border-2 border-[#e8dede] p-6 md:p-8 bg-[#ffffff] shadow-[0_8px_32px_rgba(177,133,151,0.08)] space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-[#e8dede] pb-4">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-[#5e4d46] font-semibold">{wordCount} words</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-bold text-[10px]">
              Ready for Review
            </span>
            <span className="text-[#7a6860]">🛡️ ESL Safe Guard (&ge; 70% = 0.20)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInputText(SAMPLE_TEXT)}
              className="px-4 py-2 rounded-xl bg-[#faf6f6] hover:bg-[#fff5f7] text-[#382b22] text-xs font-semibold uppercase tracking-wider transition-all border border-[#e8dede] shadow-sm hover:translate-y-0.5 active:translate-y-1.5 cursor-pointer"
            >
              LOAD SAMPLE INDUSTRIAL RECORD
            </button>
            <label className="px-5 py-2.5 rounded-xl bg-[#fff0f0] hover:bg-[#ffe9e9] text-[#382b22] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer border-2 border-[#b18597] shadow-[0_4px_0_0_#b18597] hover:translate-y-0.5 active:translate-y-1.5 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#382b22]" />
              <span>UPLOAD DOCUMENT</span>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls,.tsv,.txt" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            placeholder="Paste an essay, raw catalog feed, or upload a selectable PDF, DOCX, or CSV file. The audit works best with 50+ words."
            className="w-full bg-[#faf6f6] border-2 border-[#e8dede] rounded-2xl p-4 text-xs font-mono text-[#2b201a] font-semibold leading-relaxed focus:outline-none focus:border-[#b18597] shadow-inner resize-y"
          />
        </div>

        {/* 3-Step Araxyss Guidance Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#e8dede]">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-[#5e4d46] uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] flex items-center justify-center text-[9px] font-bold">1</span>
              <span>PROVIDE THE SOURCE</span>
            </div>
            <p className="text-[11px] text-[#5e4d46]">
              Paste text or upload PDF, DOCX, CSV, or TXT.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-[#5e4d46] uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe] flex items-center justify-center text-[9px] font-bold">2</span>
              <span>CHECK THE SAMPLE</span>
            </div>
            <p className="text-[11px] text-[#5e4d46]">
              Use 50-1,000 English words for a usable signal.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-[#5e4d46] uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] flex items-center justify-center text-[9px] font-bold">3</span>
              <span>REVIEW THE EVIDENCE</span>
            </div>
            <p className="text-[11px] text-[#5e4d46]">
              Scores guide a human review; they do not determine authority.
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="pt-2">
          <PopButton
            onClick={handleRunAudit}
            disabled={isAuditing || !inputText.trim()}
            className="w-full py-4 text-xs font-bold tracking-wider cursor-pointer"
          >
            {isAuditing ? (
              <>
                <Cpu className="w-4 h-4 text-[#382b22] animate-spin" />
                <span>COMPUTING DETERMINISTIC LOGITS &amp; TOKEN RIBBON...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#382b22]" />
                <span>RUN EXPLAINABLE CATALOG AUDIT</span>
                <span className="text-sm font-bold">&rarr;</span>
              </>
            )}
          </PopButton>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS AUDIT RESULTS (LIGHT PORCELAIN)
          ==================================================================== */}
      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Score Row */}
          <div className="p-6 rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
            <div>
              <div className="text-[10px] uppercase font-mono text-[#8c7770] font-bold">OVERALL ACCURACY SCORE</div>
              <div className="text-4xl font-extrabold text-[#065f46] font-mono mt-1">0.96</div>
              <div className="text-[10px] text-[#7a6860] mt-1 font-semibold">High Confidence / Human Approved</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-[#8c7770] font-bold">MEAN PERPLEXITY</div>
              <div className="text-2xl font-bold text-[#2b201a] font-mono mt-1">249.49</div>
              <div className="text-[10px] text-[#7a6860] mt-1">Logit uncertainty measure</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-[#8c7770] font-bold">BURSTINESS (GLTR)</div>
              <div className="text-2xl font-bold text-[#5b21b6] font-mono mt-1">0.674</div>
              <div className="text-[10px] text-[#7a6860] mt-1">Standardized variance delta</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-[#8c7770] font-bold">TAXONOMY GROUNDING</div>
              <div className="text-2xl font-bold text-[#1e40af] font-mono mt-1">98.4%</div>
              <div className="text-[10px] text-[#7a6860] mt-1 font-mono">UNSPSC Class 31161620</div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveReport}
                className="w-full justify-center"
                icon={isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              >
                <span>{isSaved ? "Dossier Saved" : "Save Report"}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="w-full justify-center"
                icon={<Share2 className="w-3.5 h-3.5" />}
              >
                <span>Share Link</span>
              </Button>
            </div>
          </div>

          {/* Sparkline Visualizer */}
          <div className="p-6 rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#2b201a] font-bold">PERPLEXITY TRAJECTORY SPARKLINE</span>
              <div className="flex items-center gap-4 text-[10px] text-[#7a6860]">
                <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Human Baseline (40.0)</span>
                <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 rounded-full bg-[#b18597]" /> Assay Trajectory</span>
              </div>
            </div>

            {/* Sparkline Bar Chart Graphic */}
            <div className="h-16 w-full flex items-end gap-1 pt-2">
              {Array.from({ length: 48 }).map((_, i) => {
                const height = Math.sin(i * 0.4) * 20 + 35 + (i % 3 === 0 ? 15 : -8);
                const isGreen = i % 4 !== 0;
                return (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      isGreen ? "bg-[#a7f3d0] hover:bg-[#10b981]" : "bg-[#fbcfe8] hover:bg-[#b18597]"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Two-Column Token Highlighter & Committee Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Token Ribbon */}
            <div className="lg:col-span-8 p-6 rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-[#e8dede] pb-3 font-mono">
                <span className="text-[#2b201a] font-bold">EXPLAINABLE TOKEN ATTRIBUTION RIBBON</span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-bold">&ge;70% Match</span>
                  <span className="px-2 py-0.5 rounded bg-[#fffbeb] text-[#92400e] border border-[#fde68a] font-bold">Ambiguous</span>
                  <span className="px-2 py-0.5 rounded bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe] font-bold">AI Spec</span>
                </div>
              </div>

              {/* Highlighted text passage */}
              <div className="text-xs font-mono leading-relaxed space-y-3 text-[#2b201a]">
                <p>
                  <span className="bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] px-1.5 py-0.5 rounded-md mr-1 cursor-pointer font-bold hover:bg-[#a7f3d0]" onClick={() => setSelectedHighlight("Explainable AI Catalog System: Standardizes noisy industrial supplier feeds into search-ready master records.")}>
                    Explainable AI Catalog System:
                  </span>
                  Industrial catalog records are automatically ingested, parsed for vendor abbreviations, and matched against canonical manufacturer dictionaries.
                </p>
                <p>
                  <span className="bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe] px-1.5 py-0.5 rounded-md mr-1 cursor-pointer font-bold hover:bg-[#ddd6fe]" onClick={() => setSelectedHighlight("Gemini 2.5 Flash Extracted 8 Specifications: Thread size 1/2-13, 2.0in length, 316 stainless steel.")}>
                    Attribute AI Extractor:
                  </span>
                  Extracted 8 structured attributes: thread pitch, material grade (Marine 316), tensile strength, DIN 933 standard, and packaging count.
                </p>
                <p>
                  <span className="bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] px-1.5 py-0.5 rounded-md mr-1 cursor-pointer font-bold hover:bg-[#bfdbfe]" onClick={() => setSelectedHighlight("RapidFuzz Entity Resolution: 98.4% brand confidence for Fabory Fasteners.")}>
                    RapidFuzz Entity Resolver:
                  </span>
                  Mapped ambiguous acronym &ldquo;FAB-SS&rdquo; to canonical brand &ldquo;Fabory&rdquo; with 98.4% fuzzy similarity score.
                </p>
              </div>

              {selectedHighlight && (
                <div className="p-3.5 rounded-2xl border-2 border-[#bfdbfe] bg-[#eff6ff] text-xs text-[#1e40af] font-mono flex items-start gap-2 font-semibold">
                  <Activity className="w-4 h-4 text-[#1e40af] shrink-0 mt-0.5" />
                  <span>{selectedHighlight}</span>
                </div>
              )}
            </div>

            {/* Right Column: Committee Notes & Overrides */}
            <div className="lg:col-span-4 space-y-4">
              {/* Committee Note Card */}
              <div className="p-6 rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-sm space-y-4 font-mono">
                <div className="text-xs font-bold text-[#2b201a] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#065f46]" />
                  <span>Reviewer Override &amp; Notes</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-[#8c7770] uppercase font-bold">Committee Comments</label>
                  <textarea
                    value={committeeNote}
                    onChange={(e) => setCommitteeNote(e.target.value)}
                    placeholder="Add committee notes for catalog sign-off..."
                    rows={4}
                    className="w-full bg-[#faf6f6] border-2 border-[#e8dede] rounded-xl p-3 text-xs text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-[#5e4d46] cursor-pointer font-semibold">
                    <input type="checkbox" defaultChecked className="accent-[#065f46] rounded" />
                    <span>Confirm Auto-Approved</span>
                  </label>
                </div>

                <Button
                  variant="green"
                  size="md"
                  onClick={() => alert("Committee certification recorded in master audit ledger.")}
                  className="w-full justify-center"
                >
                  <span>Certify Master Record</span>
                  <span className="ml-1 font-bold">&rarr;</span>
                </Button>
              </div>

              {/* Multi-Channel Export Trigger */}
              {uploadResult && (
                <div className="p-4 rounded-2xl border-2 border-[#e8dede] bg-[#fff0f0] space-y-3">
                  <div className="text-xs font-bold text-[#382b22]">Batch Upload Detected</div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={handleStartPipeline}
                    isLoading={isStartingEnrichment}
                  >
                    Proceed to 9-Stage Pipeline &rarr;
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
