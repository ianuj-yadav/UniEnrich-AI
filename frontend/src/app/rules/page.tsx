"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Search, 
  Trash2, 
  Layers,
  ArrowRight,
  Terminal,
  Cpu,
  ShieldCheck,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { getRuleSummary, addAbbreviationRule, testTextTransformation, RuleSummary } from "@/lib/api";

export default function RulesPage() {
  const [rules, setRules] = useState<RuleSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"scratchpad" | "abbreviations" | "brands">("scratchpad");

  // Scratchpad
  const [scratchText, setScratchText] = useState<string>("3/4 CPLG BRS 150# THD NIBCO PK50");
  const [scratchResult, setScratchResult] = useState<any>(null);
  const [testing, setTesting] = useState<boolean>(false);

  // New Rule Form
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAcronym, setNewAcronym] = useState<string>("");
  const [newExpansion, setNewExpansion] = useState<string>("");
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Filter Search
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    loadRules();
    runScratchpadTest("3/4 CPLG BRS 150# THD NIBCO PK50");
  }, []);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await getRuleSummary();
      setRules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runScratchpadTest = async (text: string) => {
    if (!text.trim()) return;
    setTesting(true);
    try {
      const res = await testTextTransformation(text);
      setScratchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  const handleAddAbbr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcronym || !newExpansion) return;
    try {
      await addAbbreviationRule(newAcronym, newExpansion);
      setAddSuccess(`Rule "${newAcronym}" -> "${newExpansion}" added successfully!`);
      setNewAcronym("");
      setNewExpansion("");
      setShowAddModal(false);
      loadRules();
      setTimeout(() => setAddSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Deterministic Rules</Badge>
            <span className="text-xs font-mono font-bold text-[#b18597] uppercase tracking-wider">
              Abbreviation &amp; Brand Studio
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Visual Rule Builder &amp; Brand Intelligence
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl leading-relaxed">
            Manage custom industrial abbreviation dictionaries, brand aliases, and test live deterministic transformations before catalog enrichment.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#ffffff] p-1.5 rounded-2xl border-2 border-[#e8dede] self-start shadow-xs">
          <button
            onClick={() => setActiveTab("scratchpad")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "scratchpad"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597]"
                : "text-[#6e5d56] hover:text-[#2b201a]"
            }`}
          >
            Live Scratchpad
          </button>
          <button
            onClick={() => setActiveTab("abbreviations")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "abbreviations"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597]"
                : "text-[#6e5d56] hover:text-[#2b201a]"
            }`}
          >
            Abbreviations ({rules?.total_abbreviations || 0})
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "brands"
                ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597]"
                : "text-[#6e5d56] hover:text-[#2b201a]"
            }`}
          >
            Brand Aliases ({rules?.total_brands || 0})
          </button>
        </div>
      </div>

      {addSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10b981]" />
          <span>{addSuccess}</span>
        </div>
      )}

      {/* Tab: Scratchpad */}
      {activeTab === "scratchpad" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Live Transformation Scratchpad</h3>
                <p className="text-xs text-[#8c7770]">Test messy supplier text through the engine in real-time</p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#5e4d46] block mb-1.5">Raw Supplier Input Text:</label>
                <textarea
                  rows={4}
                  value={scratchText}
                  onChange={(e) => {
                    setScratchText(e.target.value);
                    runScratchpadTest(e.target.value);
                  }}
                  placeholder="Enter raw text e.g. 3/4 CPLG BRS 150#..."
                  className="w-full bg-[#faf6f6] border-2 border-[#e8dede] rounded-2xl p-3.5 text-xs text-[#2b201a] font-mono focus:outline-none focus:border-[#b18597]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#8c7770] font-mono pt-1">
                <span>Changes process on keystroke</span>
                <button 
                  onClick={() => runScratchpadTest(scratchText)}
                  className="text-[#b18597] hover:underline font-bold"
                >
                  Re-run Analysis &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border-2 border-[#e8dede] p-6 sm:p-8 bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] space-y-4">
              <div className="border-b border-[#e8dede] pb-3">
                <h3 className="text-sm font-bold text-[#2b201a]">Engine Execution Pipeline</h3>
                <p className="text-xs text-[#8c7770]">Deterministic step-by-step pipeline output</p>
              </div>

              {scratchResult ? (
                <div className="space-y-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8c7770] block">Step 1: HTML &amp; Placeholder Sanitization</span>
                    <div className="font-mono text-[#382b22] font-semibold">{scratchResult.cleaned_text}</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#382b22]">Step 2: Abbreviation Expansion</span>
                      <Badge variant="pink" size="sm">{scratchResult.expansions_triggered} Expansions</Badge>
                    </div>
                    <div className="font-mono text-[#065f46] font-bold">{scratchResult.expanded_text}</div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#065f46] block">Step 3: RapidFuzz Brand Resolution</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[#065f46] font-bold">{scratchResult.resolved_brand} ({scratchResult.resolved_manufacturer})</span>
                      <Badge variant="green" size="sm">{Math.round(scratchResult.brand_confidence * 100)}% Confidence</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#8c7770]">
                  <Terminal className="w-8 h-8 mx-auto opacity-30 text-[#b18597] mb-2" />
                  <p className="text-xs font-mono">Type in the left editor to view live execution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Abbreviations */}
      {activeTab === "abbreviations" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#ffffff] border-2 border-[#e8dede] rounded-2xl shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8c7770]" />
              <input
                type="text"
                placeholder="Search abbreviation or full term..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
              />
            </div>

            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAddModal(true)}>
              Add Abbreviation Rule
            </Button>
          </div>

          <div className="rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6">
              {Object.entries((rules?.abbreviations as Record<string, string>) || {})
                .filter(([acronym, full]) => 
                  acronym.toLowerCase().includes(searchFilter.toLowerCase()) || 
                  String(full).toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map(([acronym, full]) => (
                  <div key={acronym} className="p-3.5 rounded-2xl bg-[#faf6f6] border border-[#e8dede] hover:border-[#b18597] transition flex flex-col justify-between space-y-1">
                    <span className="font-mono font-bold text-xs text-[#1e40af]">{acronym}</span>
                    <span className="text-xs text-[#2b201a] font-semibold">{String(full)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Brands */}
      {activeTab === "brands" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#ffffff] border-2 border-[#e8dede] rounded-2xl shadow-xs">
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8c7770]" />
              <input
                type="text"
                placeholder="Search verified brands..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
              />
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] overflow-hidden p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {((rules?.brands as any[]) || [])
                .filter((b: any) => (b.canonical_name || "").toLowerCase().includes(searchFilter.toLowerCase()) || (b.aliases || []).some((a: any) => String(a).toLowerCase().includes(searchFilter.toLowerCase())))
                .map((brand: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2b201a]">{brand.canonical_name}</span>
                      <Badge variant="green" size="sm">Verified</Badge>
                    </div>
                    <div className="text-[11px] text-[#8c7770] font-mono">
                      Mfr: {brand.manufacturer || "Direct"}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {((brand.aliases as string[]) || []).map((alias: string, aIdx: number) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded-md bg-[#ffffff] border border-[#e8dede] text-[10px] font-mono text-[#5e4d46]">
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2b201a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#b18597] rounded-3xl max-w-md w-full shadow-[0_24px_64px_rgba(177,133,151,0.25)] p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="border-b border-[#e8dede] pb-3">
              <h3 className="text-base font-bold text-[#2b201a]">Add Abbreviation Rule</h3>
              <p className="text-xs text-[#8c7770]">Map industrial acronym to full expanded term</p>
            </div>

            <form onSubmit={handleAddAbbr} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Industrial Acronym / Abbreviation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CPLG"
                  value={newAcronym}
                  onChange={(e) => setNewAcronym(e.target.value.toUpperCase())}
                  className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-mono font-bold focus:outline-none focus:border-[#b18597]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Full Standardized Term</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coupling"
                  value={newExpansion}
                  onChange={(e) => setNewExpansion(e.target.value)}
                  className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e8dede]">
                <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <PopButton type="submit" className="px-5 py-2.5 text-xs">
                  <span>SAVE RULE</span>
                </PopButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
