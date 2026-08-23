"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Filter, 
  Layers, 
  Tag, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { executeCopilotQuery, applyCopilotBulkEdit, listBatches, BatchItem } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PopButton } from "@/components/ui/PopButton";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [applyingEdit, setApplyingEdit] = useState<boolean>(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      listBatches().then((b) => {
        setBatches(b);
        if (b.length > 0 && !selectedBatchId) {
          setSelectedBatchId(b[0].id);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleQuery = async (customPrompt?: string) => {
    const q = customPrompt || prompt;
    if (!q || !selectedBatchId) return;

    setLoading(true);
    setResult(null);
    setEditSuccessMsg("");

    try {
      const res = await executeCopilotQuery(selectedBatchId, q);
      setResult(res);
    } catch (err: any) {
      setResult({ error: err.message || "Failed to execute query" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBulk = async () => {
    if (!result || !result.product_ids || !result.target_attribute || !result.proposed_value) return;

    setApplyingEdit(true);
    try {
      const res = await applyCopilotBulkEdit(result.product_ids, result.target_attribute, result.proposed_value);
      setEditSuccessMsg(res.message);
      setResult(null);
    } catch (err: any) {
      alert("Failed to apply bulk edit: " + err.message);
    } finally {
      setApplyingEdit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2b201a]/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#ffffff] border-l-2 border-[#b18597] h-full flex flex-col shadow-[0_24px_64px_rgba(177,133,151,0.3)]">
        {/* Header */}
        <div className="p-5 border-b border-[#e8dede] flex items-center justify-between bg-[#faf6f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597] flex items-center justify-center text-[#382b22]">
              <Bot className="w-5 h-5 text-[#b18597]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#2b201a] text-base">Catalog AI Copilot</h3>
                <Badge variant="pink" size="sm">Gemini 2.5</Badge>
              </div>
              <p className="text-xs text-[#5e4d46]">Natural language catalog manager &amp; bulk transformations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8c7770] hover:text-[#2b201a] p-1.5 rounded-xl hover:bg-[#fff0f0] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Batch Selector */}
        <div className="p-3 bg-[#ffffff] border-b border-[#e8dede] flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#8c7770] shrink-0 uppercase">Target Feed:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-1.5 text-xs text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.filename} ({b.total_records} SKUs) - {b.status}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#faf6f6] border-b border-[#e8dede] flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[#8c7770] font-mono font-bold flex items-center gap-1 shrink-0 text-[10px] uppercase">
            <Sparkles className="w-3 h-3 text-[#b18597]" /> Prompts:
          </span>
          <button
            onClick={() => { setPrompt("Find brand mismatches"); handleQuery("Find brand mismatches"); }}
            className="px-3 py-1 bg-[#ffffff] hover:bg-[#fff0f0] text-[#5e4d46] hover:text-[#2b201a] rounded-xl border border-[#e8dede] hover:border-[#b18597] whitespace-nowrap text-xs font-semibold transition cursor-pointer"
          >
            Brand Mismatches
          </button>
          <button
            onClick={() => { setPrompt("Find missing pressure"); handleQuery("Find missing pressure"); }}
            className="px-3 py-1 bg-[#ffffff] hover:bg-[#fff0f0] text-[#5e4d46] hover:text-[#2b201a] rounded-xl border border-[#e8dede] hover:border-[#b18597] whitespace-nowrap text-xs font-semibold transition cursor-pointer"
          >
            Missing Pressure
          </button>
          <button
            onClick={() => { setPrompt("Show low confidence items"); handleQuery("Show low confidence items"); }}
            className="px-3 py-1 bg-[#ffffff] hover:bg-[#fff0f0] text-[#5e4d46] hover:text-[#2b201a] rounded-xl border border-[#e8dede] hover:border-[#b18597] whitespace-nowrap text-xs font-semibold transition cursor-pointer"
          >
            Review Queue (&lt;70%)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {editSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border-2 border-[#a7f3d0] flex items-start gap-2.5 text-[#065f46] text-xs font-semibold shadow-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#10b981]" />
              <span>{editSuccessMsg}</span>
            </div>
          )}

          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#8c7770]">
              <Loader2 className="w-8 h-8 animate-spin text-[#b18597]" />
              <p className="text-xs font-mono font-bold">Copilot is analyzing catalog records...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-in fade-in">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#b18597] flex items-center gap-1.5 font-mono uppercase">
                    <Zap className="w-3.5 h-3.5" /> {result.intent}
                  </span>
                  {result.matched_count !== undefined && (
                    <Badge variant="blue" size="sm">{result.matched_count} Matched</Badge>
                  )}
                </div>
                <p className="text-xs text-[#2b201a] font-medium leading-relaxed">{result.summary}</p>
              </div>

              {/* Bulk Edit Proposal Action */}
              {result.intent === "BULK_EDIT_PROPOSAL" && (
                <div className="p-4 rounded-2xl bg-[#fff0f0] border-2 border-[#b18597] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#382b22] font-mono font-bold uppercase tracking-wider">Bulk Update Action</span>
                    <Badge variant="warning" size="sm">Confirmation Required</Badge>
                  </div>
                  <div className="text-xs space-y-1 text-[#5e4d46] bg-[#ffffff] p-3 rounded-xl border border-[#e8dede]">
                    <div><strong>Target Attribute:</strong> {result.target_attribute}</div>
                    <div><strong>Proposed Value:</strong> {result.proposed_value}</div>
                    <div><strong>Affected SKUs:</strong> {result.affected_count} records</div>
                  </div>
                  <Button 
                    onClick={handleApplyBulk} 
                    isLoading={applyingEdit}
                    variant="primary" 
                    size="sm" 
                    className="w-full justify-center"
                  >
                    Apply Bulk Edit Across {result.affected_count} Products
                  </Button>
                </div>
              )}

              {/* Data Table / List */}
              {result.data && result.data.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-[#8c7770] uppercase tracking-wider">Matched Records</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {result.data.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#faf6f6] border border-[#e8dede] text-xs flex items-center justify-between">
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="font-mono text-[#1e40af] font-bold">{item.sku}</div>
                          <div className="text-[#2b201a] font-semibold truncate">{item.title || item.raw_desc}</div>
                          {item.raw_brand && (
                            <div className="text-[#8c7770] text-[10px] font-mono">
                              Raw: <span className="text-[#991b1b]">{item.raw_brand}</span> &rarr; Resolved: <span className="text-[#065f46] font-bold">{item.resolved_brand}</span>
                            </div>
                          )}
                        </div>
                        {item.score && <Badge variant="warning" size="sm">{item.score}</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="py-16 text-center text-[#8c7770] space-y-2">
              <Bot className="w-10 h-10 mx-auto opacity-30 text-[#b18597]" />
              <p className="text-xs font-bold text-[#2b201a]">Ask Copilot to audit or bulk-edit your catalog</p>
              <p className="text-[11px] text-[#5e4d46] max-w-sm mx-auto">
                Try typing commands like <span className="font-mono text-[#2b201a] font-semibold">"Set Pressure Rating to 150 PSI"</span> or <span className="font-mono text-[#2b201a] font-semibold">"Find all brand mismatches"</span>.
              </p>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-[#e8dede] bg-[#faf6f6]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleQuery(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Copilot or give a bulk catalog command..."
              className="flex-1 bg-[#ffffff] border border-[#e8dede] rounded-xl px-3.5 py-2.5 text-xs text-[#2b201a] font-semibold placeholder:text-[#8c7770] focus:outline-none focus:border-[#b18597]"
            />
            <PopButton 
              type="submit" 
              disabled={!prompt.trim() || loading}
              className="p-2.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </PopButton>
          </form>
        </div>
      </div>
    </div>
  );
};
