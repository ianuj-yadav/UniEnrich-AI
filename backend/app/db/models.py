import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    batches = relationship("Batch", back_populates="project", cascade="all, delete-orphan")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    filename = Column(String(255), nullable=False)
    total_records = Column(Integer, default=0)
    processed_records = Column(Integer, default=0)
    error_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    missing_brand_records = Column(Integer, default=0)
    status = Column(String(50), default="PENDING")  # PENDING, PROCESSING, COMPLETED, FAILED
    progress_percentage = Column(Float, default=0.0)
    current_step = Column(String(100), default="Ready")
    logs = Column(JSON, default=list)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="batches")
    raw_products = relationship("RawProduct", back_populates="batch", cascade="all, delete-orphan")
    enriched_products = relationship("EnrichedProduct", back_populates="batch", cascade="all, delete-orphan")

class RawProduct(Base):
    __tablename__ = "raw_products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    batch_id = Column(String(36), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    row_index = Column(Integer, nullable=False)
    raw_sku = Column(String(255), nullable=True)
    raw_brand = Column(String(255), nullable=True)
    raw_description = Column(Text, nullable=True)
    raw_category = Column(String(255), nullable=True)
    raw_data = Column(JSON, default=dict)
    has_error = Column(Boolean, default=False)
    error_message = Column(Text, nullable=True)
    is_duplicate = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="raw_products")
    enriched_product = relationship("EnrichedProduct", back_populates="raw_product", uselist=False, cascade="all, delete-orphan")

class EnrichedProduct(Base):
    __tablename__ = "enriched_products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    raw_product_id = Column(String(36), ForeignKey("raw_products.id", ondelete="CASCADE"), unique=True, nullable=False)
    batch_id = Column(String(36), ForeignKey("batches.id", ondelete="CASCADE"), nullable=False)
    
    # Cleaned and Canonical Fields
    canonical_sku = Column(String(255), nullable=True)
    cleaned_description = Column(Text, nullable=True)
    
    # Brand Resolution
    resolved_brand = Column(String(255), nullable=True)
    resolved_manufacturer = Column(String(255), nullable=True)
    brand_confidence = Column(Float, default=0.0)
    
    # Classification
    category = Column(String(255), nullable=True)
    subcategory = Column(String(255), nullable=True)
    product_family = Column(String(255), nullable=True)
    unspsc_code = Column(String(50), nullable=True)
    category_confidence = Column(Float, default=0.0)
    
    # Extracted Technical Attributes
    extracted_attributes = Column(JSON, default=dict)  # { "Material": "Brass", "Size": "3/4 in", ... }
    attribute_confidence = Column(Float, default=0.0)
    
    # Generated Descriptions
    product_title = Column(String(500), nullable=True)
    mobile_description = Column(Text, nullable=True)
    long_description = Column(Text, nullable=True)
    description_confidence = Column(Float, default=0.0)
    
    # Confidence & Review Flow
    confidence_score = Column(Float, default=0.0)
    confidence_breakdown = Column(JSON, default=dict)
    review_status = Column(String(50), default="AUTO_APPROVED")  # AUTO_APPROVED, NEEDS_REVIEW, REVIEWED_APPROVED, REJECTED
    is_modified_by_human = Column(Boolean, default=False)
    
    enriched_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="enriched_products")
    raw_product = relationship("RawProduct", back_populates="enriched_product")
    review_logs = relationship("ReviewLog", back_populates="enriched_product", cascade="all, delete-orphan")

class ReviewLog(Base):
    __tablename__ = "review_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    enriched_product_id = Column(String(36), ForeignKey("enriched_products.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(100), nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    reviewer = Column(String(100), default="Admin")
    action = Column(String(50), nullable=False)  # ACCEPT, EDIT, REJECT
    reviewed_at = Column(DateTime, default=datetime.utcnow)

    enriched_product = relationship("EnrichedProduct", back_populates="review_logs")
