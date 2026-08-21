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
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  getBatchProducts, 
  submitReviewAction, 
  bulkReviewAction, 
  listBatches, 
  BatchItem, 
  EnrichedProduct 
} from "@/lib/api";
import { getConfidenceBadgeProps } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const handleAccept = async (prodId: string) => {
    try {
      await submitReviewAction(prodId, "ACCEPT");
      setActionMessage("Product approved into catalog.");
      setTimeout(() => setActionMessage(null), 3000);
      loadReviewProducts();
    } catch (err: any) {
      alert(err.message || "Failed to approve product");
    }
  };

  const handleReject = async (prodId: string) => {
    try {
      await submitReviewAction(prodId, "REJECT");
      setActionMessage("Product marked as rejected.");
      setTimeout(() => setActionMessage(null), 3000);
      loadReviewProducts();
    } catch (err: any) {
      alert(err.message || "Failed to reject product");
    }
  };

  const handleOpenEdit = (prod: EnrichedProduct) => {
    setEditingProduct(prod);
    setEditFormData({
      product_title: prod.product_title || "",
      resolved_brand: prod.resolved_brand || "",
      category: prod.category || "",
      subcategory: prod.subcategory || "",
      unspsc_code: prod.unspsc_code || "",
      attr_Material: prod.extracted_attributes?.Material || "",
      attr_Size: prod.extracted_attributes?.Size || "",
      attr_Pressure: prod.extracted_attributes?.["Pressure Rating"] || "",
      attr_Voltage: prod.extracted_attributes?.Voltage || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      await submitReviewAction(editingProduct.id, "EDIT", editFormData);
      setEditingProduct(null);
      setActionMessage("Edits saved and product verified with 100% confidence.");
      setTimeout(() => setActionMessage(null), 3000);
      loadReviewProducts();
    } catch (err: any) {
      alert(err.message || "Failed to save edits");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAccept = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkReviewAction(selectedIds, "ACCEPT_ALL");
      setSelectedIds([]);
      setActionMessage(`Approved ${selectedIds.length} products successfully.`);
      setTimeout(() => setActionMessage(null), 3000);
      loadReviewProducts();
    } catch (err: any) {
      alert(err.message || "Bulk action failed");
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning">Stage 4</Badge>
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Human-in-the-Loop Quality Review
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white-50">Human Review & Discrepancy Queue</h1>
          <p className="text-sm text-grey-200">
            Review items with confidence &lt; 70% or missing brand/category data. Accept, reject, or edit values directly.
          </p>
        </div>

        {/* Batch Selector */}
        {batches.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-grey-300">Active Feed:</span>
            <select
              value={selectedBatchId || ""}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-black-800 border border-black-600 rounded-md px-3 py-1.5 text-xs text-white-100 focus:outline-none"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.filename} ({b.total_records} SKUs)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="p-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Bulk Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black-800 border border-black-600 rounded-lg">
        <div className="flex items-center gap-3 text-xs text-grey-200">
          <span className="font-semibold text-white-100">
            Pending Reviews: <strong className="text-yellow-400 font-mono">{products.length}</strong> SKUs
          </span>
          {selectedIds.length > 0 && (
            <Badge variant="blue">{selectedIds.length} Selected</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
              {selectedIds.length === products.length ? "Deselect All" : "Select All"}
            </Button>
          )}
          {selectedIds.length > 0 && (
            <Button
              variant="success"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleBulkAccept}
            >
              Bulk Approve ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Review Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12 text-grey-300 text-sm">Loading review items...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-base font-bold text-white-50">All Clear! Zero Pending Reviews</h3>
            <p className="text-xs text-grey-300 max-w-sm mx-auto">
              All records in this catalog feed meet the &ge; 70% confidence threshold or have already been verified by a reviewer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black-900 border-b border-black-600 text-grey-300 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded bg-black-800 border-black-600 text-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Original Supplier String</th>
                  <th className="py-3 px-3">AI Standardized Prediction</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3 text-right">Review Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black-600">
                {products.map((prod) => {
                  const badge = getConfidenceBadgeProps(prod.confidence_score);
                  const isSelected = selectedIds.includes(prod.id);

                  return (
                    <tr key={prod.id} className={`hover:bg-black-700/50 transition-colors ${isSelected ? 'bg-blue-600/10' : ''}`}>
                      <td className="py-3 px-3">
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
                          className="rounded bg-black-800 border-black-600 text-blue-500"
                        />
                      </td>

                      <td className="py-3 px-3 font-mono text-blue-400 font-semibold">
                        {prod.canonical_sku || prod.raw_sku}
                      </td>

                      {/* Original Raw Value */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="space-y-1">
                          <div className="text-[11px] text-brown-200 font-mono">
                            Brand: {prod.raw_brand || <em className="text-yellow-400">NULL</em>}
                          </div>
                          <div className="text-grey-300 font-mono truncate bg-black-900 p-1.5 rounded border border-black-700">
                            {prod.raw_description}
                          </div>
                        </div>
                      </td>

                      {/* AI Prediction */}
                      <td className="py-3 px-3 max-w-sm">
                        <div className="space-y-1">
                          <div className="font-semibold text-white-50">
                            {prod.product_title}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-black-700 rounded text-[10px] text-green-300">
                              Brand: {prod.resolved_brand}
                            </span>
                            <span className="px-1.5 py-0.5 bg-black-700 rounded text-[10px] text-purple-300">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Action Buttons: Accept / Reject / Edit */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="sm"
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => handleAccept(prod.id)}
                          >
                            Accept
                          </Button>

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit3 className="w-3.5 h-3.5" />}
                            onClick={() => handleOpenEdit(prod)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            icon={<XCircle className="w-3.5 h-3.5" />}
                            onClick={() => handleReject(prod.id)}
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
      </Card>

      {/* Inline Editing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black-800 border border-black-600 rounded-xl max-w-2xl w-full shadow-2xl p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-black-600 pb-3">
              <div>
                <h3 className="text-base font-bold text-white-50">Edit Enriched Product Record</h3>
                <p className="text-xs text-grey-300">SKU: {editingProduct.canonical_sku}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 hover:bg-black-700 rounded-md text-grey-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-grey-200">Standardized Product Title</label>
                <input
                  type="text"
                  value={editFormData.product_title || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, product_title: e.target.value })}
                  className="w-full bg-black-900 border border-black-600 rounded-md px-3 py-2 text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-grey-200">Canonical Brand</label>
                  <input
                    type="text"
                    value={editFormData.resolved_brand || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, resolved_brand: e.target.value })}
                    className="w-full bg-black-900 border border-black-600 rounded-md px-3 py-2 text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-grey-200">UNSPSC Code</label>
                  <input
                    type="text"
                    value={editFormData.unspsc_code || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, unspsc_code: e.target.value })}
                    className="w-full bg-black-900 border border-black-600 rounded-md px-3 py-2 text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-grey-200">Category</label>
                  <input
                    type="text"
                    value={editFormData.category || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-black-900 border border-black-600 rounded-md px-3 py-2 text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-grey-200">Subcategory</label>
                  <input
                    type="text"
                    value={editFormData.subcategory || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, subcategory: e.target.value })}
                    className="w-full bg-black-900 border border-black-600 rounded-md px-3 py-2 text-white-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-black-600">
                <span className="font-semibold text-grey-200 block mb-2">Technical Attributes</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-grey-300">Material</label>
                    <input
                      type="text"
                      value={editFormData.attr_Material || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Material: e.target.value })}
                      className="w-full bg-black-900 border border-black-600 rounded px-2.5 py-1.5 text-white-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-grey-300">Size / Diameter</label>
                    <input
                      type="text"
                      value={editFormData.attr_Size || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Size: e.target.value })}
                      className="w-full bg-black-900 border border-black-600 rounded px-2.5 py-1.5 text-white-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-grey-300">Pressure Rating</label>
                    <input
                      type="text"
                      value={editFormData.attr_Pressure || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Pressure: e.target.value })}
                      className="w-full bg-black-900 border border-black-600 rounded px-2.5 py-1.5 text-white-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-grey-300">Voltage</label>
                    <input
                      type="text"
                      value={editFormData.attr_Voltage || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, attr_Voltage: e.target.value })}
                      className="w-full bg-black-900 border border-black-600 rounded px-2.5 py-1.5 text-white-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black-600">
              <Button variant="secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSaveEdit}
                isLoading={isSubmitting}
              >
                Save & Set 100% Verified
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
    <Suspense fallback={<div className="text-center py-20 text-sm text-grey-300">Loading review queue...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
