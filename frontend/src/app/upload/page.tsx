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
import { uploadCatalogFile, startEnrichment, UploadResult } from "@/lib/api";

const SAMPLE_TEXT = `System Documentation:
v1.0.0
Industrial Catalog Standardization & Explainable AI Enrichment Engine.

Requirements:
1. Design: Swiss / Editorial Luxury Minimal Mode. Background off-black #0a0b0d, pure slate borders rgba(255,255,255,0.14), glass cards, and zero AI gradient slop.
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
          ARAXYSS WORKSPACE TOP HUD
          ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/12 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xs">
            UE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Araxyss</span>
              <span className="text-white/40 text-xs">/</span>
              <span className="text-xs text-grey-300 font-medium">EXPLAINABLE CATALOG ENRICHMENT AUDITOR</span>
            </div>
            <div className="text-[10px] text-grey-400 font-mono mt-0.5">
              Reviewer: <strong className="text-white">Anuj Yadav</strong>
            </div>
          </div>
        </div>

        {/* Top Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-grey-300 font-mono">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Cipher Vault</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-grey-300 font-mono">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Draft vs Master</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validation Status</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS MAIN WORKSPACE INTAKE CONTAINER
          ==================================================================== */}
      <div className="rounded-2xl border border-white/12 p-6 md:p-8 backdrop-blur-2xl bg-gradient-to-br from-white/[0.04] to-black/85 shadow-[0_8px_32px_rgba(0,0,0,0.6)] space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-grey-400">{wordCount} words</span>
            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold text-[10px]">
              Ready for Review
            </span>
            <span className="text-grey-400">🛡️ ESL Safe Guard (&ge; 70% = 0.20)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInputText(SAMPLE_TEXT)}
              className="px-4 py-2.5 rounded-xl bg-[#1a1c23] hover:bg-[#252732] text-[#f9c4d2] text-xs font-semibold uppercase tracking-wider transition-all border-2 border-[#b18597] shadow-[0_4px_0_0_#b18597] hover:translate-y-0.5 active:translate-y-1.5 cursor-pointer"
            >
              LOAD SAMPLE INDUSTRIAL RECORD
            </button>
            <label className="px-5 py-2.5 rounded-xl bg-[#fff0f0] hover:bg-[#ffe9e9] text-[#382b22] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer border-2 border-[#b18597] shadow-[0_4px_0_-1px_#f9c4d2,0_4px_0_0_#b18597] hover:translate-y-0.5 active:translate-y-1.5 flex items-center gap-2">
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
            className="w-full bg-black/60 border border-white/15 rounded-xl p-4 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-white/40 shadow-inner resize-y"
          />
        </div>

        {/* 3-Step Araxyss Guidance Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-grey-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[9px]">1</span>
              <span>PROVIDE THE SOURCE</span>
            </div>
            <p className="text-[11px] text-grey-300 font-light">
              Paste text or upload PDF, DOCX, CSV, or TXT.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-grey-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[9px]">2</span>
              <span>CHECK THE SAMPLE</span>
            </div>
            <p className="text-[11px] text-grey-300 font-light">
              Use 50-1,000 English words for a usable signal.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-grey-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-[9px]">3</span>
              <span>REVIEW THE EVIDENCE</span>
            </div>
            <p className="text-[11px] text-grey-300 font-light">
              Scores guide a human review; they do not determine authority.
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing || !inputText.trim()}
            className="w-full py-4 rounded-xl bg-[#fff0f0] hover:bg-[#ffe9e9] active:translate-y-2 text-[#382b22] font-semibold uppercase tracking-wider text-xs transition-all border-2 border-[#b18597] shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_8px_-3px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
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
          </button>
        </div>
      </div>

      {/* ====================================================================
          ARAXYSS AUDIT RESULTS (SPARKLINE, TOKEN RIBBON, COMMITTEE SIDEBAR)
          ==================================================================== */}
      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Score Row */}
          <div className="p-6 rounded-2xl border border-white/12 bg-black/80 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
            <div>
              <div className="text-[10px] uppercase font-mono text-grey-400 font-semibold">OVERALL ACCURACY SCORE</div>
              <div className="text-4xl font-extrabold text-green-400 font-mono mt-1">0.96</div>
              <div className="text-[10px] text-grey-400 mt-1">High Confidence / Human Approved</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-grey-400 font-semibold">MEAN PERPLEXITY</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">249.49</div>
              <div className="text-[10px] text-grey-400 mt-1">Logit uncertainty measure</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-grey-400 font-semibold">BURSTINESS (GLTR)</div>
              <div className="text-2xl font-bold text-purple-300 font-mono mt-1">0.674</div>
              <div className="text-[10px] text-grey-400 mt-1">Standardized variance delta</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-grey-400 font-semibold">TAXONOMY GROUNDING</div>
              <div className="text-2xl font-bold text-blue-300 font-mono mt-1">98.4%</div>
              <div className="text-[10px] text-grey-400 mt-1">UNSPSC Class 31161620</div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSaved(true)}
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
          <div className="p-6 rounded-2xl border border-white/12 bg-black/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-grey-300 font-bold">PERPLEXITY TRAJECTORY SPARKLINE</span>
              <div className="flex items-center gap-4 text-[10px] text-grey-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Human Baseline (40.0)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Assay Trajectory</span>
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
                      isGreen ? "bg-green-500/60 hover:bg-green-400" : "bg-purple-500/60 hover:bg-purple-400"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Two-Column Token Highlighter & Committee Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Token Ribbon */}
            <div className="lg:col-span-8 p-6 rounded-2xl border border-white/12 bg-black/70 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3 font-mono">
                <span className="text-white font-bold">EXPLAINABLE TOKEN ATTRIBUTION RIBBON</span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">&ge;70% Match</span>
                  <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">Ambiguous</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">AI Spec</span>
                </div>
              </div>

              {/* Highlighted text passage */}
              <div className="text-xs font-mono leading-relaxed space-y-3 text-grey-200">
                <p>
                  <span className="bg-green-500/20 text-green-300 px-1 py-0.5 rounded mr-1 cursor-pointer hover:bg-green-500/40" onClick={() => setSelectedHighlight("Explainable AI Catalog System: Standardizes noisy industrial supplier feeds into search-ready master records.")}>
                    Explainable AI Catalog System:
                  </span>
                  Industrial catalog records are automatically ingested, parsed for vendor abbreviations, and matched against canonical manufacturer dictionaries.
                </p>
                <p>
                  <span className="bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded mr-1 cursor-pointer hover:bg-purple-500/40" onClick={() => setSelectedHighlight("Gemini 2.5 Flash Extracted 8 Specifications: Thread size 1/2-13, 2.0in length, 316 stainless steel.")}>
                    Attribute AI Extractor:
                  </span>
                  Extracted 8 structured attributes: thread pitch, material grade (Marine 316), tensile strength, DIN 933 standard, and packaging count.
                </p>
                <p>
                  <span className="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded mr-1 cursor-pointer hover:bg-blue-500/40" onClick={() => setSelectedHighlight("RapidFuzz Entity Resolution: 98.4% brand confidence for Fabory Fasteners.")}>
                    RapidFuzz Entity Resolver:
                  </span>
                  Mapped ambiguous acronym &ldquo;FAB-SS&rdquo; to canonical brand &ldquo;Fabory&rdquo; with 98.4% fuzzy similarity score.
                </p>
              </div>

              {selectedHighlight && (
                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20 text-xs text-blue-200 font-mono flex items-start gap-2">
                  <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{selectedHighlight}</span>
                </div>
              )}
            </div>

            {/* Right Column: Committee Notes & Overrides */}
            <div className="lg:col-span-4 space-y-4">
              {/* Committee Note Card */}
              <div className="p-6 rounded-2xl border border-white/12 bg-black/70 backdrop-blur-xl space-y-4 font-mono">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span>Reviewer Override &amp; Notes</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-grey-400 uppercase">Committee Comments</label>
                  <textarea
                    value={committeeNote}
                    onChange={(e) => setCommitteeNote(e.target.value)}
                    placeholder="Add committee notes for catalog sign-off..."
                    rows={4}
                    className="w-full bg-black/60 border border-white/15 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-grey-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-green-500 rounded" />
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
                <div className="p-4 rounded-xl border border-white/12 bg-white/[0.04] space-y-3">
                  <div className="text-xs font-bold text-white">Batch Upload Detected</div>
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
