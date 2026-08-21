# Technical Stack & Architecture Specification Document
## Project: UniEnrich AI – Intelligent Product Data Enrichment Platform

---

## 1. Executive Technical Overview

**UniEnrich AI** is architected as a modern, decoupled, asynchronous data-processing platform. It combines a high-performance **FastAPI** backend with **PostgreSQL 16**, asynchronous **Pandas / RapidFuzz** data engines, **Google Gemini 2.5 Flash** for structured LLM reasoning, and a **Next.js 15 App Router** frontend.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (Next.js 15)                           │
│   • React 19 / TypeScript        • Tailwind CSS v4 (Custom Palette)         │
│   • AG Grid / TanStack Table     • Recharts Analytics Engine                │
│   • React Query (Server State)   • WebSocket Real-time Pipeline Listener    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / WSS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY & ROUTING TIER                          │
│   • FastAPI (Asynchronous ASGI)  • JWT Bearer Auth & RBAC Security          │
│   • Multi-Part File Streaming    • Rate Limiting & Request Sanitization     │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │                                     │
                    ▼                                     ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│     DATA & RULE PIPELINE TIER        │  │       AI & LLM INFERENCE TIER     │
│  • Pandas / NumPy Processing Engine  │  │  • Google Gemini 2.5 Flash API    │
│  • RapidFuzz C++ Matching (Brands)   │  │  • Structured Pydantic JSON Mode  │
│  • Deterministic Abbreviation Engine │  │  • Confidence Scoring Engine      │
│  • Regex Fallback Attribute Extractor│  │  • Multi-Tier Description Gen     │
└───────────────────┬──────────────────┘  └───────────────────┬───────────────┘
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE & STORAGE                          │
│   • PostgreSQL 16 (Relational Schema & JSONB)                               │
│   • SQLAlchemy 2.0 (AsyncPG Connection Pool) • Alembic DB Migrations        │
│   • Temporary File Buffer / AWS S3 Cloud Storage                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Curated Design System & Color Palette Tokens

The user interface strictly implements the approved 13-palette design system. It eschews generic dark gradients in favor of sharp, high-contrast, enterprise-grade typography and structured borders.

### 2.1 CSS Variables & Tailwind Theme Configuration

```css
/* Custom Curated Palette Tokens - UniEnrich AI */
:root {
  /* Neutral Dark / Black */
  --color-black-900: #161616; /* Primary Canvas Background */
  --color-black-800: #232323; /* Card / Surface Background */
  --color-black-700: #2c2c2c; /* Elevated Card / Dialog */
  --color-black-600: #363636; /* High-contrast Borders */

  /* Neutral Light / White */
  --color-white-50: #ffffff;  /* Pure White */
  --color-white-100: #faf9f7; /* Warm Surface Off-White */
  --color-white-200: #f6f6f6; /* Panel Background Light */
  --color-white-300: #f5f4f2; /* Subtle Light Border */
  --color-white-400: #f2f1ef; /* Muted Background */

  /* Red (Errors & Critical Warnings) */
  --color-red-500: #a52020;
  --color-red-600: #8e0300;
  --color-red-700: #76150c;
  --color-red-800: #5a0e07;

  /* Blue (Primary Actions & Brand) */
  --color-blue-400: #347aea;
  --color-blue-500: #1c47c6;
  --color-blue-600: #1e4ba3;
  --color-blue-800: #041162;

  /* Green (High Confidence & Auto-Approved) */
  --color-green-300: #beddb0;
  --color-green-500: #7aa95d;
  --color-green-700: #395b39;
  --color-green-900: #273f27;

  /* Purple (AI Operations & LLM Reasoning) */
  --color-purple-300: #b084f7;
  --color-purple-500: #8347ed;
  --color-purple-600: #6b31d9;
  --color-purple-800: #582dca;

  /* Orange (Warnings & Moderate Confidence) */
  --color-orange-400: #ec8e39;
  --color-orange-500: #e37830;
  --color-orange-600: #cd5f29;
  --color-orange-700: #b13f21;

  /* Pink (Badges & Highlight Accents) */
  --color-pink-200: #f6cae5;
  --color-pink-300: #f1abd6;
  --color-pink-500: #e978c2;
  --color-pink-600: #da3473;

  /* Light Blue (Secondary Badges & Table Headers) */
  --color-lightblue-200: #cedaee;
  --color-lightblue-300: #b5cee5;
  --color-lightblue-400: #9eb8d2;
  --color-lightblue-600: #6d8cbe;

  /* Lime (Technical Attributes & Engineering Tokens) */
  --color-lime-200: #c3cda0;
  --color-lime-300: #b2c176;
  --color-lime-500: #89994c;
  --color-lime-700: #5c642a;

  /* Brown (Raw Supplier Data & Legacy Values) */
  --color-brown-200: #c4af93;
  --color-brown-400: #83664b;
  --color-brown-600: #5c4134;
  --color-brown-800: #301e14;

  /* Grey (Structural Borders & Inactive States) */
  --color-grey-200: #d4d5d9;
  --color-grey-300: #b3b5ba;
  --color-grey-400: #94969b;
  --color-grey-600: #6b6e71;

  /* Yellow (Human Review Required / Confidence < 70%) */
  --color-yellow-300: #f5e06d;
  --color-yellow-400: #f0cf47;
  --color-yellow-500: #eabe41;
  --color-yellow-600: #e5b23e;
}
```

---

## 3. Frontend Technology Stack

| Layer / Library | Version | Role & Technical Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | React Server Components for fast initial page load; edge routing. |
| **Language** | TypeScript 5.4+ | Strict type safety for complex catalog schemas and API contracts. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS using CSS variables mapping to the 13 approved color palettes. |
| **Data Grid** | AG Grid Community / TanStack Virtual | Virtualized tabular rendering capable of rendering 10,000+ rows at 60 FPS. |
| **State Management** | TanStack React Query v5 + Zustand | Efficient caching of API queries and client UI review state. |
| **Data Visualization** | Recharts 2.12+ | High-performance SVG charts for brand distributions and quality histograms. |
| **Icons** | Lucide React | Clean, crisp, non-distracting industrial UI icons. |
| **HTTP & WS Client** | Axios + Native WebSocket | Multi-part file upload with progress hooks and live stream updates. |

---

## 4. Backend Technology Stack

| Layer / Library | Version | Role & Technical Rationale |
| :--- | :--- | :--- |
| **Framework** | FastAPI 0.111+ | High-throughput asynchronous REST API built on Starlette and Uvicorn. |
| **Language** | Python 3.11+ | Fast execution runtime, robust data science ecosystem. |
| **Data Validation** | Pydantic v2 | High-speed C-based validation of incoming payloads and LLM outputs. |
| **Tabular Processing** | Pandas 2.2+ & openpyxl | Fast streaming ingestion and manipulation of CSV, TSV, and XLSX files. |
| **Fuzzy Matching** | RapidFuzz 3.8+ | C++ powered string comparison (WRLatio, Token Sort) achieving >50,000 matches/sec. |
| **Database ORM** | SQLAlchemy 2.0 (Async) | Async connection pooling with `asyncpg` driver for PostgreSQL 16. |
| **Database Migrations**| Alembic 1.13+ | Version-controlled declarative database schema migrations. |
| **Task Execution** | FastAPI BackgroundTasks / Celery | Non-blocking async worker orchestration for large catalog enrichment batches. |

---

## 5. AI & NLP Architecture

### 5.1 LLM Provider: Google Gemini 2.5 Flash
- **Model**: `gemini-2.5-flash`
- **Inference Mode**: Structured JSON Schema Mode (`response_mime_type="application/json"`).
- **Temperature**: `0.1` (Zero temperature for deterministic attribute extraction; 0.3 for marketing description synthesis).
- **Batching Strategy**: 10 product items per prompt batch to maximize throughput while staying within output token limits.

### 5.2 Deterministic & Fallback Engine
1. **Sanitizer Engine**: Regex patterns removing HTML, control characters, and normalizing casing.
2. **Abbreviation Expander**: Hash-map lookup covering 200+ industrial MRO acronyms (`CPLG` → `Coupling`, `BRS` → `Brass`, `150#` → `150 PSI`).
3. **Fuzzy Brand Matcher**: RapidFuzz comparator cross-referencing supplier names against the canonical brand catalog.
4. **Fallback Regex Extractor**: Standalone rule-based parser that executes if Gemini API returns 429 or 5xx, ensuring zero pipeline halts.

### 5.3 Granular Confidence Scoring Algorithm

The confidence score $C_{\text{SKU}}$ is calculated mathematically per product:

$$C_{\text{SKU}} = w_{\text{brand}} \cdot C_{\text{brand}} + w_{\text{category}} \cdot C_{\text{category}} + w_{\text{attributes}} \cdot \left(\frac{1}{N}\sum_{j=1}^{N} C_{\text{attr}_j}\right) + w_{\text{desc}} \cdot C_{\text{desc}}$$

Where:
- $w_{\text{brand}} = 0.20$
- $w_{\text{category}} = 0.20$
- $w_{\text{attributes}} = 0.35$
- $w_{\text{desc}} = 0.25$
- **Review Threshold**: If $C_{\text{SKU}} < 0.70$ OR $C_{\text{brand}} < 0.60$ OR $C_{\text{category}} < 0.60$, record is routed to the **Human Review Queue**.

---

## 6. Database & Persistence Architecture

### 6.1 PostgreSQL 16 Relational Schema

```sql
-- PostgreSQL 16 Database Schema for UniEnrich AI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Batches Table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    total_records INT NOT NULL DEFAULT 0,
    processed_records INT NOT NULL DEFAULT 0,
    error_records INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Master Brands Canonical Registry
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_name VARCHAR(255) UNIQUE NOT NULL,
    manufacturer VARCHAR(255),
    aliases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Master Taxonomy Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    product_family VARCHAR(255),
    unspsc_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Raw Ingested Products (Immutable Source Data)
CREATE TABLE raw_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    row_index INT NOT NULL,
    raw_sku VARCHAR(255),
    raw_brand VARCHAR(255),
    raw_description TEXT,
    raw_data JSONB NOT NULL,
    has_error BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enriched Products (AI Transformed & Standardized)
CREATE TABLE enriched_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_product_id UUID UNIQUE REFERENCES raw_products(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    canonical_sku VARCHAR(255),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    resolved_brand_name VARCHAR(255),
    resolved_category_name VARCHAR(255),
    resolved_subcategory_name VARCHAR(255),
    unspsc_code VARCHAR(20),
    product_title VARCHAR(500),
    mobile_description TEXT,
    long_description TEXT,
    extracted_attributes JSONB DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0000,
    confidence_breakdown JSONB DEFAULT '{}'::jsonb,
    review_status VARCHAR(50) NOT NULL DEFAULT 'AUTO_APPROVED', -- AUTO_APPROVED, NEEDS_REVIEW, REVIEWED_APPROVED, REJECTED
    is_modified_by_human BOOLEAN DEFAULT FALSE,
    enriched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Human Review Audit Log
CREATE TABLE review_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enriched_product_id UUID REFERENCES enriched_products(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reviewer_user VARCHAR(100) DEFAULT 'admin',
    action VARCHAR(50) NOT NULL, -- ACCEPT, EDIT, REJECT
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Sub-Millisecond Search & Filter
CREATE INDEX idx_raw_products_batch ON raw_products(batch_id);
CREATE INDEX idx_enriched_products_batch ON enriched_products(batch_id);
CREATE INDEX idx_enriched_products_status ON enriched_products(review_status);
CREATE INDEX idx_enriched_products_confidence ON enriched_products(confidence_score);
CREATE INDEX idx_brands_canonical ON brands(canonical_name);
```

---

## 7. REST API Endpoints Specification

| Method | Endpoint | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/upload` | Upload supplier CSV/XLSX file | `multipart/form-data` | Batch ID, stats & raw summary |
| **POST** | `/api/v1/enrich/{batch_id}` | Trigger AI cleaning & enrichment pipeline | `{ "model": "gemini-2.5-flash", "batch_size": 10 }` | `{ "status": "STARTED", "batch_id": "uuid" }` |
| **GET** | `/api/v1/enrich/progress/{batch_id}` | WebSocket/SSE endpoint for real-time progress | None | Stream: `% progress, current step, logs` |
| **GET** | `/api/v1/products/{batch_id}` | Retrieve paginated products with filter | Query params: `page, limit, status, search` | `{ "items": [...], "total": 1000 }` |
| **GET** | `/api/v1/products/{product_id}/compare`| Split-screen comparison (Raw vs. Enriched) | None | `{ "raw": {...}, "enriched": {...} }` |
| **POST** | `/api/v1/review/submit` | Submit human reviewer accept/edit/reject | `{ "product_id": "uuid", "edits": {...} }` | `{ "status": "SAVED", "new_confidence": 1.0 }` |
| **GET** | `/api/v1/analytics/{batch_id}` | Get completeness, confidence & category stats | None | Analytics JSON dataset for charts |
| **GET** | `/api/v1/export/{batch_id}` | Download enriched catalog | Query params: `format=csv\|xlsx\|json` | Streamed file download |

---

## 8. Directory Blueprint & Folder Structure

```
a:/Unihack/
├── docs/
│   ├── 01_PRD.md                  # Product Requirements Document
│   ├── 02_SRS.md                  # Software Requirements Specification
│   └── 03_Tech_Stack.md            # Technical Architecture & Tokens
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Landing / Dashboard Overview
│   │   │   ├── upload/page.tsx    # CSV/XLSX Drag & Drop Upload
│   │   │   ├── process/page.tsx   # Live Pipeline Progress & Logs
│   │   │   ├── review/page.tsx    # Split-Screen HITL Review Queue
│   │   │   ├── analytics/page.tsx # Data Quality & Distribution Charts
│   │   │   └── export/page.tsx    # Multi-Format Export Center
│   │   ├── components/
│   │   │   ├── ui/                # Curated Palette Buttons, Cards, Badges
│   │   │   ├── upload/            # File Dropzone & Validation Scorecard
│   │   │   ├── review/            # Split-Screen Before/After Table & Inline Editor
│   │   │   ├── analytics/         # Recharts Quality Visualizations
│   │   │   └── layout/            # Top Navbar & Sidebar
│   │   ├── hooks/
│   │   └── lib/                   # API Clients & Theme Token Helpers
│   ├── tailwind.config.ts         # Custom Palette Token Mapping
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── upload.py      # Upload & Pre-flight Validator
│   │   │   │   ├── enrich.py      # AI Pipeline Orchestrator
│   │   │   │   ├── review.py      # Human Review Endpoints
│   │   │   │   ├── products.py    # Product Query & Search
│   │   │   │   ├── analytics.py   # Chart Data Aggregations
│   │   │   │   └── export.py      # CSV / XLSX Exporter
│   │   │   └── router.py
│   │   ├── core/
│   │   │   ├── config.py          # Environment Variables & Settings
│   │   │   └── security.py        # Token Auth & Sanitization
│   │   ├── db/
│   │   │   ├── session.py         # SQLAlchemy Async Session
│   │   │   └── base.py
│   │   ├── models/                # SQLAlchemy Table Declarations
│   │   ├── schemas/               # Pydantic Schemas & DTOs
│   │   └── services/
│   │       ├── cleaner.py         # Deterministic Sanitation & Abbreviation Expander
│   │       ├── brand_resolver.py  # RapidFuzz Canonical Matcher
│   │       ├── attribute_extractor.py # Gemini 2.5 Flash Attribute Extractor
│   │       ├── classifier.py      # Taxonomy & UNSPSC Predictor
│   │       ├── description_gen.py # Multi-Format Content Generator
│   │       ├── confidence.py      # Mathematical Scoring Engine
│   │       └── exporter.py        # Formula-Safe File Builder
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
│
├── datasets/
│   ├── sample_messy_catalog.csv   # Real-world MRO Raw Test Feed
│   ├── standard_brands.json       # Master Canonical Brand Seed
│   └── industrial_abbreviations.json # MRO Abbreviation Seed
│
├── deployment/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml
│   └── nginx.conf
│
└── README.md
```

---

## 9. Coding Standards & Engineering Best Practices

1. **Python / FastAPI**:
   - Strictly follow **PEP 8** style conventions.
   - Use asynchronous handlers (`async def`) for all I/O operations.
   - All request/response contracts must be typed via **Pydantic v2** models with field descriptions and example values.
   - Zero hardcoded API keys or database credentials; use `pydantic-settings` with `.env` files.

2. **TypeScript / React**:
   - Strict TypeScript (`"strict": true` in `tsconfig.json`).
   - Use Functional Components with React 19 hooks.
   - Component files must remain modular and single-responsibility ($\le 250$ lines per file).
   - Zero hardcoded magic hex strings in JSX; reference the curated Tailwind tokens (e.g., `bg-black-800 text-white-100 border-grey-400`).

3. **Security & Data Sanitization**:
   - Prepend `'` to all CSV exported strings matching `=|@|\+|-` to block formula injection.
   - Set maximum file upload size to 50MB to prevent memory exhaustion.
   - Escape all user input rendered on the web frontend to eliminate XSS.
