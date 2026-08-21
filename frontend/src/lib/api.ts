const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

export interface BatchItem {
  id: string;
  filename: string;
  total_records: number;
  processed_records: number;
  error_records: number;
  duplicate_records: number;
  missing_brand_records: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress_percentage: number;
  current_step: string;
  uploaded_at: string;
  completed_at?: string;
  logs?: string[];
}

export interface UploadResult {
  batch_id: string;
  filename: string;
  total_rows: number;
  error_rows: number;
  duplicate_rows: number;
  missing_brand_rows: number;
  columns_detected: string[];
  preview_records: Array<{
    row_index: number;
    sku?: string;
    brand?: string;
    description?: string;
    category?: string;
    has_error: boolean;
    is_duplicate: boolean;
  }>;
  message: string;
}

export interface EnrichedProduct {
  id: string;
  raw_product_id: string;
  raw_sku?: string;
  raw_brand?: string;
  raw_description?: string;
  canonical_sku?: string;
  resolved_brand?: string;
  resolved_manufacturer?: string;
  category?: string;
  subcategory?: string;
  product_family?: string;
  unspsc_code?: string;
  product_title?: string;
  mobile_description?: string;
  long_description?: string;
  extracted_attributes: Record<string, any>;
  confidence_score: number;
  confidence_breakdown: Record<string, number>;
  review_status: "AUTO_APPROVED" | "NEEDS_REVIEW" | "REVIEWED_APPROVED" | "REJECTED";
  is_modified_by_human: boolean;
  has_error: boolean;
  is_duplicate: boolean;
}

export interface ProductsResponse {
  items: EnrichedProduct[];
  total: number;
  page: number;
  limit: number;
  needs_review_count: number;
  auto_approved_count: number;
  accuracy_rate: number;
}

export interface ComparisonData {
  product_id: string;
  raw_record: {
    sku?: string;
    brand?: string;
    description?: string;
    category?: string;
    raw_attributes?: Record<string, any>;
  };
  enriched_record: {
    sku?: string;
    title?: string;
    brand?: string;
    manufacturer?: string;
    category?: string;
    subcategory?: string;
    unspsc?: string;
    attributes: Record<string, any>;
    mobile_description?: string;
    long_description?: string;
  };
  changed_fields: string[];
  confidence_score: number;
  confidence_breakdown: Record<string, number>;
  review_status: string;
}

export interface AnalyticsData {
  total_products: number;
  processed_products: number;
  accuracy_percentage: number;
  needs_review_count: number;
  auto_approved_count: number;
  duplicate_count: number;
  brand_distribution: Array<{ brand: string; count: number }>;
  category_distribution: Array<{ category: string; count: number }>;
  confidence_histogram: Array<{ range: string; count: number }>;
  completeness_delta: {
    brand_coverage_before: number;
    brand_coverage_after: number;
    category_coverage_before: number;
    category_coverage_after: number;
    title_standardization_gain: number;
  };
  top_extracted_attributes: Array<{ attribute: string; count: number }>;
}

export async function uploadCatalogFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(errorData.detail || "Failed to upload file");
  }

  return res.json();
}

export async function startEnrichment(batchId: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/enrich/${batchId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to start enrichment" }));
    throw new Error(errorData.detail || "Failed to start enrichment");
  }

  return res.json();
}

export async function getEnrichmentProgress(batchId: string): Promise<BatchItem> {
  const res = await fetch(`${API_BASE}/enrich/progress/${batchId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to get progress");
  return res.json();
}

export async function listBatches(): Promise<BatchItem[]> {
  const res = await fetch(`${API_BASE}/batches`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to list batches");
  return res.json();
}

export async function getBatchProducts(
  batchId: string,
  page: number = 1,
  limit: number = 25,
  status: string = "ALL",
  search: string = ""
): Promise<ProductsResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: status,
    search: search,
  });

  const res = await fetch(`${API_BASE}/products/${batchId}?${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductComparison(productId: string): Promise<ComparisonData> {
  const res = await fetch(`${API_BASE}/products/${productId}/compare`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to get comparison data");
  return res.json();
}

export async function submitReviewAction(
  productId: string,
  action: "ACCEPT" | "REJECT" | "EDIT",
  edits?: Record<string, any>
): Promise<any> {
  const res = await fetch(`${API_BASE}/review/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, action, edits }),
  });
  if (!res.ok) throw new Error("Failed to submit review action");
  return res.json();
}

export async function bulkReviewAction(
  productIds: string[],
  action: "ACCEPT_ALL" | "REJECT_ALL"
): Promise<any> {
  const res = await fetch(`${API_BASE}/review/bulk-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds, action }),
  });
  if (!res.ok) throw new Error("Failed to execute bulk review action");
  return res.json();
}

export async function getBatchAnalytics(batchId: string): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics/${batchId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function getExportUrl(batchId: string, format: "csv" | "xlsx" | "json", status: string = "ALL"): string {
  return `${API_BASE}/export/${batchId}?format=${format}&status=${status}`;
}
