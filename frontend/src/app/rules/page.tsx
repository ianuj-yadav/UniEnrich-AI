"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Layers, 
  ArrowRight,
  Shield,
  Tag,
  Search,
  Loader2
} from "lucide-react";
import { getRules, addAbbreviationRule, testTextTransformation } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function RulesStudioPage() {
  const [activeTab, setActiveTab] = useState<"abbreviations" | "brands" | "scratchpad">("scratchpad");
  const [rules, setRules] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // New Abbreviation Form
  const [newAcronym, setNewAcronym] = useState<string>("");
  const [newExpansion, setNewExpansion] = useState<string>("");
  const [addingAbbr, setAddingAbbr] = useState<boolean>(false);
  const [abbrSuccess, setAbbrSuccess] = useState<string>("");

  // Search Filter
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Scratchpad
  const [scratchText, setScratchText] = useState<string>("3/4 CPLG BRS 150# <p>High temp valve</p>");
  const [scratchResult, setScratchResult] = useState<any>(null);
  const [testingScratch, setTestingScratch] = useState<boolean>(false);

  useEffect(() => {
    loadRulesData();
    runScratchpadTest("3/4 CPLG BRS 150# <p>High temp valve</p>");
  }, []);

  const loadRulesData = async () => {
    setLoading(true);
    try {
      const res = await getRules();
      setRules(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAbbreviation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcronym || !newExpansion) return;

    setAddingAbbr(true);
    setAbbrSuccess("");
    try {
      const res = await addAbbreviationRule(newAcronym, newExpansion);
      setAbbrSuccess(`Added rule: ${res.acronym} &rarr; ${res.expansion}`);
      setNewAcronym("");
      setNewExpansion("");
      loadRulesData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setAddingAbbr(false);
    }
  };

  const runScratchpadTest = async (text: string) => {
    if (!text.trim()) return;
    setTestingScratch(true);
    try {
      const res = await testTextTransformation(text);
      setScratchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingScratch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Visual Rule Builder & Brand Studio</h1>
            <Badge variant="purple" size="sm">Deterministic Engine</Badge>
          </div>
          <p className="text-xs text-grey-400 mt-1">
            Manage custom industrial abbreviation dictionaries, brand aliases, and test live transformations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-black-900 p-1 rounded-lg border border-black-800 self-start">
          <button
            onClick={() => setActiveTab("scratchpad")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "scratchpad" ? "bg-purple-900/60 text-purple-300 border border-purple-600" : "text-grey-400 hover:text-white"
            }`}
          >
            Live Scratchpad
          </button>
          <button
            onClick={() => setActiveTab("abbreviations")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "abbreviations" ? "bg-blue-900/60 text-blue-300 border border-blue-600" : "text-grey-400 hover:text-white"
            }`}
          >
            Abbreviations ({rules?.total_abbreviations || 0})
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "brands" ? "bg-green-900/60 text-green-300 border border-green-600" : "text-grey-400 hover:text-white"
            }`}
          >
            Brand Aliases ({rules?.total_brands || 0})
          </button>
        </div>
      </div>

      {/* Tab: Scratchpad */}
      {activeTab === "scratchpad" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <Card title="Live Transformation Scratchpad" subtitle="Test raw supplier text through the engine in real-time">
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-grey-300 block mb-1.5">Raw Supplier Input Text:</label>
                  <textarea
                    rows={4}
                    value={scratchText}
                    onChange={(e) => {
                      setScratchText(e.target.value);
                      runScratchpadTest(e.target.value);
                    }}
                    placeholder="Enter raw text e.g. 3/4 CPLG BRS 150#..."
                    className="w-full bg-black-950 border border-black-700 rounded-lg p-3 text-xs text-white placeholder:text-grey-600 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-grey-500">
                  <span>Changes process on keystroke</span>
                  <button 
                    onClick={() => runScratchpadTest(scratchText)}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Re-run Analysis &rarr;
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <Card title="Engine Execution Pipeline" subtitle="Step-by-step transformation output">
              <div className="p-4 space-y-3">
                {scratchResult ? (
                  <div className="space-y-3 text-xs">
                    {/* Step 1 */}
                    <div className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-grey-500 block">Step 1: HTML & Placeholder Sanitization</span>
                      <div className="font-mono text-grey-300">{scratchResult.cleaned_text}</div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-purple-400">Step 2: Abbreviation Expansion</span>
                        <Badge variant="purple" size="sm">{scratchResult.expansions_triggered} Expansions</Badge>
                      </div>
                      <div className="font-mono text-green-300">{scratchResult.expanded_text}</div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-400 block">Step 3: RapidFuzz Brand Resolution</span>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{scratchResult.resolved_brand} ({scratchResult.resolved_manufacturer})</span>
                        <Badge variant="success" size="sm">{Math.round(scratchResult.brand_confidence * 100)}% Confidence</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-grey-500">
                    <Terminal className="w-8 h-8 mx-auto opacity-30 text-purple-400 mb-2" />
                    <p className="text-xs">Type in the left editor to view live execution</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Abbreviations */}
      {activeTab === "abbreviations" && (
        <div className="space-y-6">
          {/* Add Rule Form */}
          <Card title="Add Custom Abbreviation" subtitle="Define deterministic term expansion for all catalog feeds">
            <form onSubmit={handleAddAbbreviation} className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="text-[11px] text-grey-400 block mb-1">Acronym / Abbreviation:</label>
                <input
                  type="text"
                  placeholder="e.g. SPLC"
                  value={newAcronym}
                  onChange={(e) => setNewAcronym(e.target.value)}
                  className="w-full bg-black-950 border border-black-700 rounded-md px-3 py-1.5 text-xs text-white uppercase font-mono"
                  required
                />
              </div>
              <div className="sm:col-span-6">
                <label className="text-[11px] text-grey-400 block mb-1">Standardized Expansion:</label>
                <input
                  type="text"
                  placeholder="e.g. Splice Connector"
                  value={newExpansion}
                  onChange={(e) => setNewExpansion(e.target.value)}
                  className="w-full bg-black-950 border border-black-700 rounded-md px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="primary" size="sm" loading={addingAbbr} className="w-full">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                </Button>
              </div>
            </form>
          </Card>

          {abbrSuccess && (
            <div className="p-3 rounded-lg bg-green-950/40 border border-green-700 text-green-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{abbrSuccess}</span>
            </div>
          )}

          {/* Dictionary Table */}
          <Card title="Active MRO Abbreviation Dictionary" subtitle="Loaded and applied in real-time">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-grey-500" />
                <input
                  type="text"
                  placeholder="Search acronyms or expansions..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-black-950 border border-black-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-grey-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {rules?.abbreviations && Object.entries(rules.abbreviations)
                  .filter(([k, v]) => 
                    k.toLowerCase().includes(searchFilter.toLowerCase()) || 
                    String(v).toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map(([acronym, expansion]) => (
                    <div key={acronym} className="p-2.5 rounded bg-black-950 border border-black-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-purple-400 font-bold">{acronym}</span>
                      <span className="text-grey-300 truncate max-w-[140px]">{String(expansion)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Brands */}
      {activeTab === "brands" && (
        <div className="space-y-4">
          <Card title="Master Canonical Brand & Alias Registry" subtitle="RapidFuzz fuzzy entity match targets">
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {rules?.brands && rules.brands.map((b: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-black-950 border border-black-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{b.canonical_name}</span>
                      <Badge variant="green" size="sm">{b.manufacturer}</Badge>
                    </div>
                    <div className="text-[11px] text-grey-400">
                      <span className="text-grey-500">Aliases: </span>
                      {b.aliases.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
