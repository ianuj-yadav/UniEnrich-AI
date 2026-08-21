from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

class BatchSummary(BaseModel):
    id: str
    filename: str
    total_records: int
    processed_records: int
    error_records: int
    duplicate_records: int
    missing_brand_records: int
    status: str
    progress_percentage: float
    current_step: str
    uploaded_at: datetime
    completed_at: Optional[datetime] = None

class UploadResponse(BaseModel):
    batch_id: str
    filename: str
    total_rows: int
    error_rows: int
    duplicate_rows: int
    missing_brand_rows: int
    columns_detected: List[str]
    preview_records: List[Dict[str, Any]]
    message: str

class StartEnrichmentRequest(BaseModel):
    model: str = "gemini-2.5-flash"
    batch_size: int = 10
    auto_approve_threshold: float = 0.70

class EnrichedAttributeSchema(BaseModel):
    name: str
    value: str
    unit: Optional[str] = None
    confidence: float = 1.0

class EnrichedProductItem(BaseModel):
    id: str
    raw_product_id: str
    raw_sku: Optional[str] = None
    raw_brand: Optional[str] = None
    raw_description: Optional[str] = None
    canonical_sku: Optional[str] = None
    resolved_brand: Optional[str] = None
    resolved_manufacturer: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    product_family: Optional[str] = None
    unspsc_code: Optional[str] = None
    product_title: Optional[str] = None
    mobile_description: Optional[str] = None
    long_description: Optional[str] = None
    extracted_attributes: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float
    confidence_breakdown: Dict[str, float] = Field(default_factory=dict)
    review_status: str
    is_modified_by_human: bool = False
    has_error: bool = False
    is_duplicate: bool = False

class PaginatedProductsResponse(BaseModel):
    items: List[EnrichedProductItem]
    total: int
    page: int
    limit: int
    needs_review_count: int
    auto_approved_count: int
    accuracy_rate: float

class SplitComparisonResponse(BaseModel):
    product_id: str
    raw_record: Dict[str, Any]
    enriched_record: Dict[str, Any]
    changed_fields: List[str]
    confidence_score: float
    confidence_breakdown: Dict[str, float]
    review_status: str

class ReviewActionRequest(BaseModel):
    product_id: str
    action: str  # ACCEPT, REJECT, EDIT
    edits: Optional[Dict[str, Any]] = None
    reviewer: str = "Admin"

class BulkReviewActionRequest(BaseModel):
    product_ids: List[str]
    action: str  # ACCEPT_ALL, REJECT_ALL
    reviewer: str = "Admin"

class AnalyticsOverview(BaseModel):
    total_products: int
    processed_products: int
    accuracy_percentage: float
    needs_review_count: int
    auto_approved_count: int
    duplicate_count: int
    brand_distribution: List[Dict[str, Any]]
    category_distribution: List[Dict[str, Any]]
    confidence_histogram: List[Dict[str, Any]]
    completeness_delta: Dict[str, Any]
    top_extracted_attributes: List[Dict[str, Any]]
