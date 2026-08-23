# UniEnrich AI – Intelligent Product Data Enrichment Platform

> *"Transform messy industrial product catalogs into structured, searchable, AI-enriched product data."*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/LLM-Gemini%202.5%20Flash-blueviolet.svg?logo=google&logoColor=white)](https://ai.google.dev)
[![RapidFuzz](https://img.shields.io/badge/Entity%20Matching-RapidFuzz%20C++-orange.svg)](https://github.com/rapidfuzz/RapidFuzz)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4%2B-blue.svg?logo=typescript&logoColor=white)](https://typescriptlang.org)

---

## 📌 Problem Statement & Overview

Industrial distributors, wholesalers, and B2B platforms ingest product data feeds from hundreds of independent manufacturers. These raw supplier catalogs suffer from critical data quality issues:
- **Abbreviated, cryptic descriptions**: `"3/4 CPLG BRS 150#"` instead of full technical terms.
- **Missing & unstructured attributes**: Material, pressure rating, thread size, voltage buried in unparsed text.
- **Inconsistent brand naming**: `"3 M"`, `"3M INC"`, `"3M Corporation"` instead of canonical `"3M™"`.
- **Placeholder pollutions**: `"-- Unbranded --"`, `"N/A"`, `"UNKNOWN"` stored as valid names.
- **Lack of standardized categories**: No UNSPSC codes or e-commerce taxonomy mapping.
- **Zero customer-facing copy**: Missing search titles, mobile blurbs, and e-commerce descriptions.

**UniEnrich AI** is an enterprise-grade automated catalog enrichment platform that cleans, standardizes, classifies, extracts attributes, generates multi-format copy, and routes low-confidence items to an interactive Human-in-the-Loop review dashboard before exporting clean, search-ready records.

---

## 🏗️ System Architecture

```
                       RAW CATALOG INGESTION
                    CSV / XLSX / TSV (Drag & Drop)
                                 │
                                 ▼
                     DATA VALIDATION LAYER
              Schema Check • Syntax Error Quarantine
                                 │
                                 ▼
                      DATA CLEANING ENGINE
             Whitespace • HTML Stripper • Placeholders
              Deterministic Abbreviation Expansion
                                 │
                                 ▼
                 BRAND & MANUFACTURER RESOLVER
              RapidFuzz Fuzzy Token Matching (85%)
                                 │
                                 ▼
                   AI ATTRIBUTE EXTRACTION
             Gemini 2.5 Flash Structured JSON Mode
              (Material, Size, Pressure, Voltage...)
                                 │
                                 ▼
                  PRODUCT CLASSIFICATION AI
             Taxonomy • UNSPSC 8-Digit Code Mapping
                                 │
                                 ▼
                  AI DESCRIPTION GENERATOR
             SEO Title • Mobile Blurb • Long Desc
                                 │
                                 ▼
                  CONFIDENCE SCORING ENGINE
                  $C_{agg} = \sum (W_i \times C_i)$
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       Score < 70% (Review)             Score >= 70% (Approved)
      HUMAN REVIEW WORKSPACE              CATALOG EXPORT ENGINE
     Split-Screen Inline Editor          CSV • Excel • JSON (Sanitized)
```

---

## 🎨 Curated 13-Color Design System

The platform strictly adheres to clean, high-contrast typography and borders, eliminating sloppy AI dark gradients:

| Palette Group | Hex Tokens | UI Semantic Role |
| :--- | :--- | :--- |
| **Black / Dark Canvas** | `#161616`, `#232323`, `#2c2c2c`, `#363636` | Background canvas, cards, high-contrast borders |
| **White / Light Surfaces**| `#f6f6f6`, `#f5f4f2`, `#faf9f7`, `#f2f1ef` | Typography, active card panels |
| **Red** | `#a52020`, `#8e0300`, `#76150c`, `#5a0e07` | Error flags, duplicate alerts, rejected rows |
| **Blue** | `#347aea`, `#1c47c6`, `#1e4ba3`, `#041162` | Primary buttons, active tabs, brand accents |
| **Green** | `#beddb0`, `#7aa95d`, `#395b39`, `#273f27` | Auto-approved badges (>85%), success alerts |
| **Purple** | `#b084f7`, `#8347ed`, `#6b31d9`, `#582dca` | AI LLM inference indicators, pipeline monitor |
| **Orange** | `#ec8e39`, `#e37830`, `#cd5f29`, `#b13f21` | Warnings, moderate confidence indicators |
| **Pink** | `#f6cae5`, `#f1abd6`, `#e978c2`, `#da3473` | Taxonomy pills, attribute badges |
| **Light Blue** | `#cedaee`, `#b5cee5`, `#9eb8d2`, `#6d8cbe` | Secondary stat badges, table headers |
| **Lime** | `#c3cda0`, `#b2c176`, `#89994c`, `#5c642a` | Technical dimension & unit tokens |
| **Brown** | `#c4af93`, `#83664b`, `#5c4134`, `#301e14` | Raw legacy supplier string indicators |
| **Grey** | `#d4d5d9`, `#b3b5ba`, `#94969b`, `#6b6e71` | Structural dividers, subtle borders |
| **Yellow** | `#f5e06d`, `#f0cf47`, `#eabe41`, `#e5b23e` | Human Review Required badges (<70%) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** / npm 10+
- (Optional) **Google Gemini API Key** for LLM generation (system includes an automatic high-speed deterministic regex fallback extractor if no key is provided).

### 1. Clone & Set Up Backend
```bash
# In the root repository directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Add your Gemini API Key in .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run FastAPI Server
python main.py
# Server runs at http://localhost:8000
# OpenAPI Docs at http://localhost:8000/docs
```

### 2. Set Up & Run Frontend
```bash
# In another terminal window
cd frontend

# Install Node dependencies
npm install

# Start Next.js Development Server
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 🧪 Running Automated Test

```bash
# Run unit & integration test suite
cd backend
python -m pytest tests/ -v
```

---

## 📦 Docker Deployment

```bash
# Build and run multi-container stack with Docker Compose
cd deployment
docker-compose up --build -d
```

---

## 📑 Complete Documentation Links

- **[Product Requirements Document (PRD)](file:///a:/Unihack/docs/01_PRD.md)**
- **[Software Requirements Specification (IEEE 29148 SRS)](file:///a:/Unihack/docs/02_SRS.md)**
- **[Tech Stack & Architecture Specification](file:///a:/Unihack/docs/03_Tech_Stack.md)**
- **[Sample Messy Catalog Dataset](file:///a:/Unihack/datasets/sample_messy_catalog.csv)**

---

## 🏆 Hackathon Submission Checklist

- [x] Pre-flight file validation scorecard (Total, Errors, Duplicates, Missing Brand)
- [x] Deterministic cleaning engine with placeholder neutralization
- [x] Industrial abbreviation expander (`CPLG` &rarr; `Coupling`, `150#` &rarr; `150 PSI`)
- [x] RapidFuzz brand canonicalization (`3 M` &rarr; `3M™`, `DEWALT` &rarr; `DEWALT®`)
- [x] AI technical attribute extraction (Material, Size, Pressure, Voltage, Connection)
- [x] Taxonomy classification with standard 8-digit UNSPSC codes
- [x] Tri-tier description synthesis (SEO Title, Mobile summary, E-Commerce paragraph)
- [x] Mathematical confidence scoring with 70% threshold review routing
- [x] Human-in-the-loop split-screen review dashboard with inline editing
- [x] Data completeness & quality analytics charts
- [x] Multi-format exporter (CSV, Excel, JSON) with CSV formula injection protection
- [x] IEEE 29148 SRS, PRD, and Tech Stack documentation suite
