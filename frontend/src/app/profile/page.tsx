"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Bookmark, 
  FileText, 
  ShieldCheck, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Clock, 
  Activity, 
  Lock, 
  ExternalLink,
  Filter,
  Check,
  X,
  Copy,
  Building2,
  Key,
  Shield,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useAuth } from "@/context/AuthContext";

export interface SavedReport {
  id: string;
  title: string;
  category: "batch" | "ocr" | "signoff";
  categoryLabel: string;
  date: string;
  sourceFile: string;
  skuCount: number;
  accuracy: number;
  perplexity: number;
  burstiness: number;
  grounding: number;
  unspscCode: string;
  reviewerNotes: string;
  status: "Certified" | "Auto-Approved" | "Audited";
  tags: string[];
  specsPreview: Record<string, string>;
  rawSnippet: string;
  cleanSnippet: string;
}

const DEFAULT_SAVED_REPORTS: SavedReport[] = [
  {
    id: "DOS-2026-9281",
    title: "Fasteners & ISO Industrial Hardware Audit",
    category: "batch",
    categoryLabel: "Batch Audit",
    date: "14 July 2026 • 09:47 PM",
    sourceFile: "mro_fasteners_supplier_q3.csv",
    skuCount: 1472,
    accuracy: 98.4,
    perplexity: 249.49,
    burstiness: 0.674,
    grounding: 98.4,
    unspscCode: "31161620 (Hex Head Bolts)",
    reviewerNotes: "Cross-referenced with datasheet CAD OCR; dimensions normalized to DIN 933 / ISO 4017 full-thread standard.",
    status: "Certified",
    tags: ["DIN 933", "Marine 316", "Fabory", "UNC Thread"],
    specsPreview: {
      "Thread Pitch": '1/2"-13 UNC',
      "Material Grade": "Marine Grade 316 SS",
      "Standard": "DIN 933 / ISO 4017",
      "Packaging": "100 Units / Box",
    },
    rawSnippet: "HEX BLT 1/2-13x2 SS316 DIN933 PK100",
    cleanSnippet: 'Hex Head Bolt 1/2"-13 x 2" Grade 316 Stainless Steel (DIN 933, Pack of 100)',
  },
  {
    id: "DOS-2026-8814",
    title: "SKF & FAG Precision Ball Bearing Catalog",
    category: "batch",
    categoryLabel: "Batch Audit",
    date: "12 July 2026 • 04:15 PM",
    sourceFile: "skf_bearings_master_feed.xlsx",
    skuCount: 890,
    accuracy: 99.2,
    perplexity: 182.15,
    burstiness: 0.712,
    grounding: 99.1,
    unspscCode: "31171504 (Ball bearings)",
    reviewerNotes: "Radial clearance verified as C3. Dual rubber contact seals validated across all 890 rows with 0 duplicate collisions.",
    status: "Certified",
    tags: ["SKF", "Deep Groove", "C3 Clearance", "Rubber Seals"],
    specsPreview: {
      "Bore Size": "25 mm ID",
      "Outer Diameter": "52 mm OD",
      "Radial Clearance": "C3 Radial Internal",
      "Seal Type": "Dual Contact Rubber (2RSH)",
    },
    rawSnippet: "BRG BALL DGRV 6205 2RSH C3 SKF ID25 OD52 W15",
    cleanSnippet: "Deep Groove Ball Bearing 6205-2RSH/C3 Rubber Contact Seals (25x52x15mm, SKF)",
  },
  {
    id: "DOS-2026-7732",
    title: "Swagelok 40G Instrumentation Valves OCR Lab",
    category: "ocr",
    categoryLabel: "Datasheet OCR",
    date: "10 July 2026 • 11:30 AM",
    sourceFile: "swagelok_40g_technical_datasheet.pdf",
    skuCount: 320,
    accuracy: 97.8,
    perplexity: 215.30,
    burstiness: 0.655,
    grounding: 97.5,
    unspscCode: "40141607 (Ball valves)",
    reviewerNotes: "Vision OCR extracted CAD pressure tolerances up to 2500 psig at 148°C. Virgin PTFE seat specifications approved.",
    status: "Auto-Approved",
    tags: ["Swagelok", "PTFE Seats", "2500 psig", "Fractional Tube"],
    specsPreview: {
      "End Connection": '1/4" Swagelok Fractional Tube',
      "Body Material": "Forged 316 Stainless Steel",
      "Pressure Rating": "2500 psig (172 bar)",
      "Seat Material": "Virgin PTFE",
    },
    rawSnippet: "SS-43GS4 SWAGELOK 1/4IN 1-PC 40G BALL VLV PTFE",
    cleanSnippet: 'One-Piece 40G Series Ball Valve 1/4" Fractional Tube Fitting 316 SS PTFE Seats',
  },
  {
    id: "DOS-2026-6519",
    title: "Fluke Industrial Electrical Testing Gear",
    category: "signoff",
    categoryLabel: "Human Sign-Off",
    date: "08 July 2026 • 02:45 PM",
    sourceFile: "fluke_industrial_meters_export.csv",
    skuCount: 154,
    accuracy: 98.9,
    perplexity: 198.40,
    burstiness: 0.690,
    grounding: 98.6,
    unspscCode: "41113608 (Multimeters)",
    reviewerNotes: "Safety certifications verified for CAT IV 600V / CAT III 1000V. True-RMS AC/DC measurement parameters validated.",
    status: "Certified",
    tags: ["Fluke", "CAT IV", "True-RMS", "Industrial Meter"],
    specsPreview: {
      "Safety Rating": "CAT IV 600V / CAT III 1000V",
      "Max Voltage": "1000 V AC/DC",
      "Resolution": "20,000 Counts High Res",
      "Measurement": "True-RMS AC/DC Current & Voltage",
    },
    rawSnippet: "FLUKE 87-V IND MULTIMETER TRMS 1000V AC/DC CAT IV",
    cleanSnippet: "Fluke 87V Industrial True-RMS Digital Multimeter 1000V AC/DC CAT IV 600V / CAT III",
  }
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "batch" | "ocr" | "signoff">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userName = user?.name || "Anuj Yadav";
  const userEmail = user?.email || "anuj.yadav@unienrich.ai";
  const userOrg = user?.organization || "Araxyss / UniEnrich Industrial AI";
  const userRole = user?.role || "Lead Catalog Reviewer";
  const userTier = user?.tier || "Enterprise Vault";
  const userProvider = user?.provider === "google" ? "Google OAuth" : "Email & Password";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Load from LocalStorage or default mock
  useEffect(() => {
    try {
      const stored = localStorage.getItem("unienrich_saved_reports");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setReports(DEFAULT_SAVED_REPORTS);
  }, []);

  const handleDeleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    try {
      localStorage.setItem("unienrich_saved_reports", JSON.stringify(updated));
    } catch {}
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/profile?report=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === "all" || r.category === activeTab;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const totalSKUs = reports.reduce((acc, r) => acc + r.skuCount, 0);
  const avgAccuracy = reports.length > 0 
    ? (reports.reduce((acc, r) => acc + r.accuracy, 0) / reports.length).toFixed(1)
    : "98.4";

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      {/* ====================================================================
          1. ANALYST PROFILE & CREDENTIALS HEADER
          ==================================================================== */}
      <div className="relative rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] overflow-hidden">
        {/* Subtle top ambient radial blush */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#fff0f0] rounded-full blur-3xl pointer-events-none opacity-80" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Avatar & User Information */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Disc */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[#fff0f0] border-2 border-[#b18597] shadow-[0_4px_0_0_#b18597] flex items-center justify-center text-2xl font-bold text-[#382b22]">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#ffffff]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2b201a] tracking-tight">
                  {userName}
                </h1>
                <Badge variant="pink" size="sm">{userRole}</Badge>
                <Badge variant="success" size="sm" dot>Active Session</Badge>
              </div>

              <p className="text-xs text-[#5e4d46] font-medium flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#b18597]" />
                <span>{userOrg}</span>
                <span>•</span>
                <span className="text-[#8c7770] font-mono">{userEmail}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#8c7770]">
                <span>Auth: <strong className="text-[#382b22]">{userProvider}</strong></span>
                <span>•</span>
                <span>Tier: <strong>{userTier}</strong></span>
                <span>•</span>
                <span>ID: <strong>AY-2026-STD</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
            <Link href="/upload">
              <PopButton className="px-5 py-3 text-xs">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NEW CATALOG AUDIT</span>
                </span>
              </PopButton>
            </Link>
            <Button 
              variant="secondary" 
              size="md" 
              onClick={logout}
              className="px-4 py-3 text-xs"
            >
              <span>SIGN OUT</span>
            </Button>
          </div>
        </div>

        {/* Profile Metric Summary Strip */}
        <div className="mt-8 pt-6 border-t border-[#e8dede] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8c7770] font-semibold">
              <span>Saved Dossiers</span>
              <Bookmark className="w-4 h-4 text-[#b18597]" />
            </div>
            <div className="text-2xl font-extrabold text-[#2b201a] font-mono">
              <AnimatedCounter value={reports.length} suffix=" Reports" />
            </div>
            <p className="text-[10px] text-[#5e4d46]">Certified Master Ledgers</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8c7770] font-semibold">
              <span>Audited SKUs</span>
              <Layers className="w-4 h-4 text-[#1e40af]" />
            </div>
            <div className="text-2xl font-extrabold text-[#1e40af] font-mono">
              <AnimatedCounter value={totalSKUs} />
            </div>
            <p className="text-[10px] text-[#5e4d46]">Across 4 Supplier Feeds</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8c7770] font-semibold">
              <span>Average Precision</span>
              <TrendingUp className="w-4 h-4 text-[#065f46]" />
            </div>
            <div className="text-2xl font-extrabold text-[#065f46] font-mono">
              <AnimatedCounter value={Number(avgAccuracy)} decimals={1} suffix="%" />
            </div>
            <p className="text-[10px] text-[#5e4d46]">Confidence Gate Pass</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8c7770] font-semibold">
              <span>Connected ERPs</span>
              <ShieldCheck className="w-4 h-4 text-[#5b21b6]" />
            </div>
            <div className="text-2xl font-extrabold text-[#5b21b6] font-mono">
              4 Channels
            </div>
            <p className="text-[10px] text-[#5e4d46]">Shopify, SAP, Magento</p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. SAVED REPORTS & AUDIT DOSSIERS SECTION
          ==================================================================== */}
      <div className="space-y-6">
        {/* Section Title & Search/Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#b18597] uppercase tracking-wider font-mono">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Dossier Archive</span>
            </div>
            <h2 className="text-2xl font-bold text-[#2b201a] tracking-tight mt-0.5">
              Saved Catalog Audit Reports
            </h2>
            <p className="text-xs text-[#5e4d46]">
              Certified master records, OCR extraction outputs, and historical catalog sign-offs.
            </p>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8c7770] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border-2 border-[#e8dede] bg-[#ffffff] text-xs text-[#2b201a] placeholder:text-[#8c7770] focus:outline-none focus:border-[#b18597] w-60 shadow-2xs font-medium"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: `All (${reports.length})` },
                { id: "batch", label: "Batches" },
                { id: "ocr", label: "Datasheet OCR" },
                { id: "signoff", label: "Sign-Offs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] font-bold"
                      : "bg-[#ffffff] hover:bg-[#faf6f6] text-[#6e5d56] border border-[#e8dede]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-[#e8dede] bg-[#ffffff] space-y-4">
            <Bookmark className="w-12 h-12 text-[#b18597] mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2b201a]">No Saved Reports Found</h3>
              <p className="text-xs text-[#7a6860] max-w-sm mx-auto">
                {searchQuery ? "No reports matched your search query." : "You have not saved any catalog dossiers yet."}
              </p>
            </div>
            <Link href="/upload">
              <Button variant="primary" size="sm">
                Go to Workspace &amp; Run Audit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl border-2 border-[#e8dede] p-6 bg-[#ffffff] hover:border-[#b18597] hover:shadow-[0_12px_32px_rgba(177,133,151,0.12)] transition-all flex flex-col justify-between space-y-5 group"
              >
                {/* Card Header & Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b18597]" />
                      <span>{report.id}</span>
                      <span>•</span>
                      <span>{report.categoryLabel}</span>
                    </span>

                    <Badge 
                      variant={report.status === "Certified" ? "green" : report.status === "Auto-Approved" ? "purple" : "pink"} 
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#2b201a] tracking-tight group-hover:text-[#b18597] transition-colors">
                      {report.title}
                    </h3>
                    <div className="text-[11px] text-[#8c7770] font-mono mt-0.5 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[#8c7770]" />
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.skuCount} SKUs</span>
                    </div>
                  </div>

                  {/* Clean Sample Output Preview */}
                  <div className="p-3 rounded-2xl border border-[#e8dede] bg-[#faf6f6] space-y-1">
                    <div className="text-[9px] font-mono uppercase font-bold text-[#8c7770]">Certified Title</div>
                    <div className="text-xs font-bold text-[#2b201a] leading-snug">
                      {report.cleanSnippet}
                    </div>
                  </div>

                  {/* 4 Extracted Specs Chips */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(report.specsPreview).slice(0, 4).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2 rounded-xl border border-[#e8dede] bg-[#ffffff] flex flex-col justify-between text-[10px]"
                      >
                        <span className="text-[#8c7770] font-mono font-bold uppercase">{key}</span>
                        <span className="font-mono font-bold text-[#065f46] truncate mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reviewer Note */}
                  <p className="text-[11px] text-[#5e4d46] italic line-clamp-2 leading-relaxed">
                    &ldquo;{report.reviewerNotes}&rdquo;
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#e8dede] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                      className="px-3 text-xs"
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                    <button
                      onClick={() => handleCopyLink(report.id)}
                      className="p-2 rounded-xl bg-[#faf6f6] hover:bg-[#fff0f0] border border-[#e8dede] text-[#6e5d56] hover:text-[#2b201a] transition cursor-pointer"
                      title="Copy Link"
                    >
                      {copiedId === report.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 rounded-xl bg-[#faf6f6] hover:bg-[#fef2f2] border border-[#e8dede] text-[#991b1b] transition cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#065f46]">
                    <span className="text-[10px] text-[#8c7770] uppercase">Acc:</span>
                    <span>{report.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====================================================================
          3. FULL DOSSIER INSPECTOR MODAL
          ==================================================================== */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b201a]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#ffffff] rounded-3xl border-2 border-[#b18597] shadow-[0_24px_64px_rgba(177,133,151,0.25)] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#e8dede] pb-4">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider flex items-center gap-2">
                  <span>{selectedReport.id}</span>
                  <span>•</span>
                  <span>{selectedReport.categoryLabel}</span>
                  <Badge variant="green" size="sm">{selectedReport.status}</Badge>
                </div>
                <h3 className="text-xl font-bold text-[#2b201a] mt-1">
                  {selectedReport.title}
                </h3>
                <div className="text-xs text-[#8c7770] font-mono mt-0.5">
                  Source: {selectedReport.sourceFile} ({selectedReport.skuCount} SKUs)
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-xl bg-[#faf6f6] hover:bg-[#fff0f0] border border-[#e8dede] text-[#6e5d56] hover:text-[#2b201a] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-[10px] font-mono text-[#8c7770] uppercase">ACCURACY</div>
                <div className="text-xl font-extrabold text-[#065f46] font-mono mt-0.5">
                  {selectedReport.accuracy}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-[10px] font-mono text-[#8c7770] uppercase">PERPLEXITY</div>
                <div className="text-xl font-extrabold text-[#2b201a] font-mono mt-0.5">
                  {selectedReport.perplexity}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-[10px] font-mono text-[#8c7770] uppercase">BURSTINESS</div>
                <div className="text-xl font-extrabold text-[#5b21b6] font-mono mt-0.5">
                  {selectedReport.burstiness}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="text-[10px] font-mono text-[#8c7770] uppercase">GROUNDING</div>
                <div className="text-xl font-extrabold text-[#1e40af] font-mono mt-0.5">
                  {selectedReport.grounding}%
                </div>
              </div>
            </div>

            {/* Raw vs Clean Comparison */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#8c7770] block mb-1">
                  1. Raw Supplier Feed
                </label>
                <div className="p-3 rounded-xl border border-[#e8dede] bg-[#faf6f6] font-mono text-xs text-[#5e4d46]">
                  {selectedReport.rawSnippet}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#8c7770] block mb-1">
                  2. Certified Master Record Title
                </label>
                <div className="p-3.5 rounded-2xl border-2 border-[#b18597] bg-[#fff0f0] text-xs font-bold text-[#2b201a] leading-snug">
                  {selectedReport.cleanSnippet}
                </div>
              </div>
            </div>

            {/* Extracted Specifications Table */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-[#8c7770] block">
                Extracted Engineering Specifications
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selectedReport.specsPreview).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl border border-[#e8dede] bg-[#ffffff] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#8c7770] font-mono font-bold uppercase text-[10px]">{key}</span>
                    <span className="font-mono font-bold text-[#065f46]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviewer Note */}
            <div className="p-4 rounded-2xl border border-[#e8dede] bg-[#faf6f6] space-y-1">
              <div className="text-[10px] font-mono font-bold text-[#8c7770] uppercase">
                Reviewer Committee Certification Ledger
              </div>
              <p className="text-xs text-[#2b201a] leading-relaxed">
                {selectedReport.reviewerNotes}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#e8dede] flex flex-wrap items-center justify-between gap-3">
              <Link href="/export">
                <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                  Export for Shopify / SAP
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
