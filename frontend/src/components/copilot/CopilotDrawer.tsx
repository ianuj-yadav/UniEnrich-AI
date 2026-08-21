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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-black-900 border-l border-black-700 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-black-700 flex items-center justify-between bg-black-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-600 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Catalog AI Copilot</h3>
                <Badge variant="purple" size="sm">Gemini 2.5</Badge>
              </div>
              <p className="text-xs text-grey-400">Natural language catalog manager & bulk actions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-grey-400 hover:text-white p-1 rounded-md hover:bg-black-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Batch Selector */}
        <div className="p-3 bg-black-900 border-b border-black-800 flex items-center gap-2">
          <span className="text-xs text-grey-400 shrink-0">Target Feed:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full bg-black-950 border border-black-700 rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.filename} ({b.total_records} SKUs) - {b.status}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-black-950/60 border-b border-black-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-grey-500 flex items-center gap-1 shrink-0"><Sparkles className="w-3 h-3 text-purple-400" /> Prompts:</span>
          <button
            onClick={() => { setPrompt("Find brand mismatches"); handleQuery("Find brand mismatches"); }}
            className="px-2.5 py-1 bg-black-800 hover:bg-black-700 text-grey-300 rounded border border-black-700 whitespace-nowrap"
          >
            Brand Mismatches
          </button>
          <button
            onClick={() => { setPrompt("Find missing pressure"); handleQuery("Find missing pressure"); }}
            className="px-2.5 py-1 bg-black-800 hover:bg-black-700 text-grey-300 rounded border border-black-700 whitespace-nowrap"
          >
            Missing Pressure
          </button>
          <button
            onClick={() => { setPrompt("Show low confidence items"); handleQuery("Show low confidence items"); }}
            className="px-2.5 py-1 bg-black-800 hover:bg-black-700 text-grey-300 rounded border border-black-700 whitespace-nowrap"
          >
            Review Queue (&lt;70%)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {editSuccessMsg && (
            <div className="p-3 rounded-lg bg-green-950/40 border border-green-700/50 flex items-start gap-2.5 text-green-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{editSuccessMsg}</span>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-grey-400">
              <Loader2 className="w-7 h-7 animate-spin text-purple-400" />
              <p className="text-sm">Copilot is analyzing catalog records...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-in fade-in">
              {/* Summary Card */}
              <div className="p-3.5 rounded-lg bg-black-800 border border-black-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> {result.intent}
                  </span>
                  {result.matched_count !== undefined && (
                    <Badge variant="blue" size="sm">{result.matched_count} Matched</Badge>
                  )}
                </div>
                <p className="text-sm text-grey-200">{result.summary}</p>
              </div>

              {/* Bulk Edit Proposal Action */}
              {result.intent === "BULK_EDIT_PROPOSAL" && (
                <div className="p-4 rounded-lg bg-purple-950/30 border border-purple-600/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Bulk Update Action</span>
                    <Badge variant="warning" size="sm">Confirmation Required</Badge>
                  </div>
                  <div className="text-xs space-y-1 text-grey-300 bg-black-900/80 p-2.5 rounded border border-black-700">
                    <div><strong>Target Attribute:</strong> {result.target_attribute}</div>
                    <div><strong>Proposed Value:</strong> {result.proposed_value}</div>
                    <div><strong>Affected SKUs:</strong> {result.affected_count} records</div>
                  </div>
                  <Button 
                    onClick={handleApplyBulk} 
                    loading={applyingEdit}
                    variant="purple" 
                    size="sm" 
                    className="w-full"
                  >
                    Apply Bulk Edit Across {result.affected_count} Products
                  </Button>
                </div>
              )}

              {/* Data Table / List */}
              {result.data && result.data.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-grey-400 uppercase tracking-wider">Matched Records</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {result.data.map((item: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded bg-black-950 border border-black-800 text-xs flex items-center justify-between">
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="font-mono text-blue-400 font-medium">{item.sku}</div>
                          <div className="text-grey-300 truncate">{item.title || item.raw_desc}</div>
                          {item.raw_brand && (
                            <div className="text-grey-500 text-[11px]">
                              Raw: <span className="text-red-400">{item.raw_brand}</span> &rarr; Resolved: <span className="text-green-400">{item.resolved_brand}</span>
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
            <div className="py-16 text-center text-grey-500 space-y-2">
              <Bot className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
              <p className="text-sm font-medium text-grey-400">Ask Copilot to audit or bulk-edit your catalog</p>
              <p className="text-xs text-grey-600 max-w-sm mx-auto">
                Try typing commands like <span className="text-grey-400 font-mono">"Set Pressure Rating to 150 PSI"</span> or <span className="text-grey-400 font-mono">"Find all brand mismatches"</span>.
              </p>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-black-800 bg-black-950">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleQuery(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Copilot or give a bulk catalog command..."
              className="flex-1 bg-black-900 border border-black-700 rounded-md px-3 py-2 text-xs text-white placeholder:text-grey-500 focus:outline-none focus:border-purple-500"
            />
            <Button 
              type="submit" 
              variant="purple" 
              size="sm"
              disabled={!prompt.trim() || loading}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
