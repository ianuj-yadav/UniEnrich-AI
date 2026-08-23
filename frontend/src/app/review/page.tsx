"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Sparkles, 
  AlertTriangle, 
  Save, 
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  Loader2,
  Keyboard
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PopButton } from "@/components/ui/PopButton";
import { 
  getBatchProducts, 
  submitReviewAction, 
  bulkReviewAction, 
  listBatches, 
  localizeProduct,
  BatchItem, 
  EnrichedProduct 
} from "@/lib/api";

export const dynamic = "force-dynamic";

function getConfidenceBadgeProps(score: number) {
  if (score >= 0.85) {
    return {
      label: `${Math.round(score * 100)}% High`,
      bgColor: "bg-[#ecfdf5]",
      textColor: "text-[#065f46]",
      borderColor: "border-[#a7f3d0]",
      dotColor: "bg-[#10b981]"
    };
  } else if (score >= 0.70) {
    return {
      label: `${Math.round(score * 100)}% Pass`,
      bgColor: "bg-[#eff6ff]",
      textColor: "text-[#1e40af]",
      borderColor: "border-[#bfdbfe]",
      dotColor: "bg-[#3b82f6]"
    };
  } else if (score >= 0.50) {
    return {
      label: `${Math.round(score * 100)}% Review`,
      bgColor: "bg-[#fffbeb]",
      textColor: "text-[#92400e]",
      borderColor: "border-[#fde68a]",
      dotColor: "bg-[#f59e0b]"
    };
  } else {
    return {
      label: `${Math.round(score * 100)}% Low`,
      bgColor: "bg-[#fef2f2]",
      textColor: "text-[#991b1b]",
      borderColor: "border-[#fecaca]",
      dotColor: "bg-[#ef4444]"
    };
  }
}

function ReviewContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batch_id");

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchIdFromUrl);
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<EnrichedProduct | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Localization Modal State
  const [localizingProduct, setLocalizingProduct] = useState<EnrichedProduct | null>(null);
  const [targetLang, setTargetLang] = useState<string>("es");
  const [localizedData, setLocalizedData] = useState<any>(null);
  const [loadingLocalization, setLoadingLocalization] = useState<boolean>(false);

  useEffect(() => {
    async function loadBatches() {
      try {
        const list = await listBatches();
        setBatches(list);
        if (!selectedBatchId && list.length > 0) {
          setSelectedBatchId(list[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadBatches();
  }, [selectedBatchId]);

  const loadReviewProducts = async () => {
    if (!selectedBatchId) return;
    setIsLoading(true);
    try {
      const resp = await getBatchProducts(
        selectedBatchId,
        1,
        100,
        "NEEDS_REVIEW"
      );
      setProducts(resp.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviewProducts();
  }, [selectedBatchId]);

  // Keyboard Shortcuts (A: Approve, R: Reject, E: Edit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (editingProduct || localizingProduct) return;

      if (products.length > 0) {
        const firstId = products[0].id;
        if (e.key === "a" || e.key === "A") {
          handleAccept(firstId);
        } else if (e.key === "r" || e.key === "R") {
          handleReject(firstId);
        } else if (e.key === "e" || e.key === "E") {
          handleOpenEdit(products[0]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [products, editingProduct, localizingProduct]);

  const handleAccept = async (productId: string) => {
    try {
      await submitReviewAction(productId, "APPROVE");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setActionMessage("Product approved & certified with 100% confidence.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await submitReviewAction(productId, "REJECT");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setActionMessage("Product rejected from master catalog feed.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkAccept = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkReviewAction(selectedIds, "APPROVE");
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setActionMessage(`Bulk approved ${selectedIds.length} catalog items successfully.`);
      setSelectedIds([]);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkReviewAction(selectedIds, "REJECT");
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setActionMessage(`Bulk rejected ${selectedIds.length} catalog items.`);
      setSelectedIds([]);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (prod: EnrichedProduct) => {
    setEditingProduct(prod);
    setEditFormData({
      product_title: prod.product_title,
      resolved_brand: prod.resolved_brand,
      category: prod.category,
      subcategory: prod.subcategory,
      unspsc_code: prod.unspsc_code,
      attr_Material: prod.extracted_attributes?.["Material"] || "",
      attr_Size: prod.extracted_attributes?.["Size"] || prod.extracted_attributes?.["Diameter"] || "",
      attr_Pressure: prod.extracted_attributes?.["Pressure Rating"] || "",
      attr_Voltage: prod.extracted_attributes?.["Voltage"] || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const updatedAttrs = {
        ...(editingProduct.extracted_attributes || {}),
        ...(editFormData.attr_Material ? { Material: editFormData.attr_Material } : {}),
        ...(editFormData.attr_Size ? { Size: editFormData.attr_Size } : {}),
        ...(editFormData.attr_Pressure ? { "Pressure Rating": editFormData.attr_Pressure } : {}),
        ...(editFormData.attr_Voltage ? { Voltage: editFormData.attr_Voltage } : {}),
      };

      await submitReviewAction(editingProduct.id, "EDIT", {
        product_title: editFormData.product_title,
        resolved_brand: editFormData.resolved_brand,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
        unspsc_code: editFormData.unspsc_code,
        extracted_attributes: updatedAttrs,
      });

      setProducts((prev) => prev.filter((p) => p.id !== editingProduct.id));
      setEditingProduct(null);
      setActionMessage("Custom edits certified & saved to master ledger.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLocalize = async (prod: EnrichedProduct) => {
    setLocalizingProduct(prod);
    setLoadingLocalization(true);
    setLocalizedData(null);
    try {
      const res = await localizeProduct(prod.id, targetLang);
      setLocalizedData(res.localized_data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocalization(false);
    }
  };

  const handleChangeLanguage = async (newLang: string) => {
    if (!localizingProduct) return;
    setTargetLang(newLang);
    setLoadingLocalization(true);
    try {
      const res = await localizeProduct(localizingProduct.id, newLang);
      setLocalizedData(res.localized_data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocalization(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning">Stage 4</Badge>
            <span className="text-xs font-mono font-bold text-[#92400e] uppercase tracking-wider">
              Human-in-the-Loop Quality Review
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2b201a] tracking-tight">
            Human Review &amp; Discrepancy Queue
          </h1>
          <p className="text-xs text-[#5e4d46] max-w-2xl">
            Review edge-case records with confidence &lt; 70%. Use inline editing, multilingual translation preview, or one-touch keyboard shortcuts.
          </p>
        </div>

        {/* Keyboard Shortcut Hints */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#ffffff] border-2 border-[#e8dede] text-[11px] font-mono text-[#5e4d46] shadow-xs">
          <Keyboard className="w-3.5 h-3.5 text-[#b18597]" />
          <span className="font-bold">SHORTCUTS:</span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-[#fff0f0] border border-[#b18597] text-[#382b22] font-bold">A</kbd> Approve
          <kbd className="px-1.5 py-0.5 rounded-md bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] font-bold">R</kbd> Reject
          <kbd className="px-1.5 py-0.5 rounded-md bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] font-bold">E</kbd> Edit
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#065f46] rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Bulk Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#ffffff] border-2 border-[#e8dede] rounded-2xl shadow-[0_4px_16px_rgba(177,133,151,0.06)]">
        <div className="flex items-center gap-3 text-xs text-[#5e4d46]">
          <span className="font-bold text-[#2b201a]">
            Pending Reviews: <strong className="text-[#92400e] font-mono font-extrabold">{products.length}</strong> SKUs
          </span>
          {selectedIds.length > 0 && (
            <Badge variant="pink">{selectedIds.length} Selected</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
              {selectedIds.length === products.length ? "Deselect All" : "Select All"}
            </Button>
          )}
          {selectedIds.length > 0 && (
            <>
              <Button
                variant="success"
                size="sm"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={handleBulkAccept}
              >
                Bulk Approve ({selectedIds.length})
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle className="w-3.5 h-3.5" />}
                onClick={handleBulkReject}
              >
                Bulk Reject ({selectedIds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Interactive Review Table */}
      <div className="rounded-3xl border-2 border-[#e8dede] bg-[#ffffff] shadow-[0_12px_40px_rgba(177,133,151,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-[#8c7770] text-xs font-mono">Loading review queue items...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-[#2b201a]">All Clear! Zero Pending Reviews</h3>
            <p className="text-xs text-[#5e4d46] max-w-sm mx-auto">
              All records in this catalog feed meet the &ge; 70% confidence threshold or have already been certified by a reviewer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf6f6] border-b-2 border-[#e8dede] text-[#8c7770] font-mono uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#e8dede] text-[#b18597] focus:ring-[#b18597]"
                    />
                  </th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Original Supplier String</th>
                  <th className="py-3.5 px-4">AI Standardized Prediction</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4 text-right">Review Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dede]">
                {products.map((prod) => {
                  const badge = getConfidenceBadgeProps(prod.confidence_score);
                  const isSelected = selectedIds.includes(prod.id);

                  return (
                    <tr key={prod.id} className={`hover:bg-[#faf6f6]/80 transition-colors ${isSelected ? 'bg-[#fff0f0]' : ''}`}>
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedIds(selectedIds.filter((id) => id !== prod.id));
                            } else {
                              setSelectedIds([...selectedIds, prod.id]);
                            }
                          }}
                          className="rounded border-[#e8dede] text-[#b18597] focus:ring-[#b18597]"
                        />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#1e40af] font-bold">
                        {prod.canonical_sku || prod.raw_sku}
                      </td>

                      {/* Original Raw Value */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="text-[11px] text-[#5e4d46] font-mono">
                            Brand: {prod.raw_brand || <em className="text-[#92400e]">NULL</em>}
                          </div>
                          <div className="text-[#382b22] font-mono text-xs truncate bg-[#faf6f6] p-2 rounded-xl border border-[#e8dede]">
                            {prod.raw_description}
                          </div>
                        </div>
                      </td>

                      {/* AI Prediction */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="space-y-1">
                          <div className="font-bold text-[#2b201a]">
                            {prod.product_title}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-md text-[10px] text-[#065f46] font-mono font-bold">
                              Brand: {prod.resolved_brand}
                            </span>
                            <span className="px-2 py-0.5 bg-[#f5f3ff] border border-[#ddd6fe] rounded-md text-[10px] text-[#5b21b6] font-mono font-bold">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="sm"
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => handleAccept(prod.id)}
                            className="text-xs"
                          >
                            Accept
                          </Button>

                          <button
                            onClick={() => handleOpenLocalize(prod)}
                            title="Translate / Localize Copy"
                            className="p-2 rounded-xl bg-[#faf6f6] hover:bg-[#fff0f0] text-[#5b21b6] border border-[#e8dede] transition cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </button>

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit3 className="w-3.5 h-3.5" />}
                            onClick={() => handleOpenEdit(prod)}
                            className="text-xs"
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            icon={<XCircle className="w-3.5 h-3.5" />}
                            onClick={() => handleReject(prod.id)}
                            className="text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Multilingual Localization Modal */}
      {localizingProduct && (
        <div className="fixed inset-0 bg-[#2b201a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#b18597] rounded-3xl max-w-xl w-full shadow-[0_24px_64px_rgba(177,133,151,0.25)] p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e8dede] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#b18597]" />
                <h3 className="text-base font-bold text-[#2b201a]">Multilingual Localization Studio</h3>
              </div>
              <button onClick={() => setLocalizingProduct(null)} className="p-1.5 text-[#8c7770] hover:text-[#2b201a] rounded-xl hover:bg-[#fff0f0]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#8c7770]">TARGET LANGUAGE:</span>
              <div className="flex gap-1.5">
                {[
                  { code: "es", name: "Spanish (ES)" },
                  { code: "de", name: "German (DE)" },
                  { code: "fr", name: "French (FR)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleChangeLanguage(l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      targetLang === l.code
                        ? "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_2px_0_0_#b18597]"
                        : "bg-[#faf6f6] text-[#6e5d56] hover:text-[#2b201a] border border-[#e8dede]"
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Preview */}
            <div className="p-4 rounded-2xl bg-[#faf6f6] border border-[#e8dede] space-y-3 text-xs">
              {loadingLocalization ? (
                <div className="py-8 text-center text-[#8c7770] space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#b18597] mx-auto" />
                  <p className="font-mono">Synthesizing localized catalog copy...</p>
                </div>
              ) : localizedData ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8c7770] block mb-0.5">Localized Title:</span>
                    <p className="font-bold text-[#2b201a]">{localizedData.product_title}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8c7770] block mb-0.5">Mobile Snippet:</span>
                    <p className="text-[#5e4d46] leading-relaxed">{localizedData.mobile_description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#8c7770] block mb-0.5">Long Description:</span>
                    <p className="text-[#5e4d46] leading-relaxed">{localizedData.long_description}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setLocalizingProduct(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Editing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-[#2b201a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#b18597] rounded-3xl max-w-2xl w-full shadow-[0_24px_64px_rgba(177,133,151,0.25)] p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e8dede] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2b201a]">Edit Enriched Product Record</h3>
                <p className="text-xs text-[#8c7770] font-mono">SKU: {editingProduct.canonical_sku}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 hover:bg-[#fff0f0] rounded-xl text-[#8c7770] hover:text-[#2b201a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Standardized Product Title</label>
                <input
                  type="text"
                  value={editFormData.product_title || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, product_title: e.target.value })}
                  className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Canonical Brand</label>
                  <input
                    type="text"
                    value={editFormData.resolved_brand || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, resolved_brand: e.target.value })}
                    className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">UNSPSC Code</label>
                  <input
                    type="text"
                    value={editFormData.unspsc_code || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, unspsc_code: e.target.value })}
                    className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Category</label>
                  <input
                    type="text"
                    value={editFormData.category || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#5e4d46] uppercase font-mono text-[10px]">Subcategory</label>
                  <input
                    type="text"
                    value={editFormData.subcategory || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, subcategory: e.target.value })}
                    className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-3 py-2 text-[#2b201a] font-semibold focus:outline-none focus:border-[#b18597]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#e8dede]">
                <span className="font-bold text-[#5e4d46] uppercase font-mono text-[10px] block mb-2">Technical Attributes</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8c7770] font-mono uppercase">Material</label>
                    <input
                      type="text"
                      value={editFormData.attr_Material || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Material: e.target.value })}
                      className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-2.5 py-1.5 text-[#2b201a] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8c7770] font-mono uppercase">Size / Diameter</label>
                    <input
                      type="text"
                      value={editFormData.attr_Size || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Size: e.target.value })}
                      className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-2.5 py-1.5 text-[#2b201a] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8c7770] font-mono uppercase">Pressure Rating</label>
                    <input
                      type="text"
                      value={editFormData.attr_Pressure || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Pressure: e.target.value })}
                      className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-2.5 py-1.5 text-[#2b201a] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8c7770] font-mono uppercase">Voltage</label>
                    <input
                      type="text"
                      value={editFormData.attr_Voltage || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Voltage: e.target.value })}
                      className="w-full bg-[#faf6f6] border border-[#e8dede] rounded-xl px-2.5 py-1.5 text-[#2b201a] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8dede]">
              <Button variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSaveEdit}
                isLoading={isSubmitting}
              >
                Save &amp; Certify Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-[#8c7770]">Loading review queue...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
