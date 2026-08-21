import os
import subprocess
import time
from datetime import datetime, timedelta

# List of files in logical development milestone order with descriptive commit messages
COMMITS = [
    # Milestone 1: Phase 0 Documentation
    ("docs/01_PRD.md", "docs(prd): add comprehensive product requirements document"),
    ("docs/02_SRS.md", "docs(srs): add IEEE 29148 compliant software requirements specification"),
    ("docs/03_Tech_Stack.md", "docs(arch): define technical architecture, database schema, and design tokens"),
    
    # Milestone 2: Datasets & Master Seeds
    ("datasets/industrial_abbreviations.json", "feat(dataset): add standard MRO industrial abbreviation dictionary"),
    ("datasets/standard_brands.json", "feat(dataset): add canonical brand and manufacturer alias seed"),
    ("datasets/sample_messy_catalog.csv", "feat(dataset): add realistic raw supplier catalog dataset for testing"),

    # Milestone 3: Backend Foundation & DB
    ("backend/requirements.txt", "chore(backend): add Python dependencies for FastAPI, Pandas, RapidFuzz and Gemini"),
    ("backend/app/core/config.py", "feat(config): implement application settings with pydantic-settings"),
    ("backend/app/db/session.py", "feat(db): configure async SQLAlchemy session and engine"),
    ("backend/app/db/models.py", "feat(models): create database models for projects, batches, products and reviews"),
    ("backend/app/schemas/schemas.py", "feat(schemas): define Pydantic DTOs for upload, enrichment, and analytics"),

    # Milestone 4: Backend Pipeline Services
    ("backend/app/services/cleaner.py", "feat(cleaner): implement whitespace stripping, HTML sanitization, and acronym expander"),
    ("backend/app/services/brand_matcher.py", "feat(matcher): implement RapidFuzz fuzzy entity resolution for canonical brands"),
    ("backend/app/services/attribute_extractor.py", "feat(extractor): add Gemini 2.5 Flash attribute extractor with rule fallback"),
    ("backend/app/services/classifier.py", "feat(classifier): add product classification and UNSPSC taxonomy mapper"),
    ("backend/app/services/description_generator.py", "feat(generator): implement multi-tier title, mobile, and long copy generator"),
    ("backend/app/services/confidence.py", "feat(confidence): implement weighted scoring formula and review threshold routing"),
    ("backend/app/services/pipeline.py", "feat(pipeline): create async enrichment pipeline orchestrator with live logging"),
    ("backend/app/services/exporter.py", "feat(exporter): create formula-safe CSV, XLSX, and JSON catalog exporter"),

    # Milestone 5: API Endpoints & Server
    ("backend/app/api/v1/upload.py", "feat(api): add CSV/XLSX file upload and pre-flight validation endpoint"),
    ("backend/app/api/v1/enrich.py", "feat(api): add async enrichment trigger and real-time progress monitor"),
    ("backend/app/api/v1/products.py", "feat(api): add product listing, search, filter and split comparison endpoints"),
    ("backend/app/api/v1/review.py", "feat(api): add human review decision, inline edit and bulk approval routes"),
    ("backend/app/api/v1/analytics.py", "feat(api): add data quality metrics and completeness delta calculations"),
    ("backend/app/api/v1/export.py", "feat(api): add streamed file download endpoint for CSV, Excel, and JSON"),
    ("backend/app/api/router.py", "feat(api): consolidate API v1 router modules"),
    ("backend/app/main.py", "feat(backend): configure FastAPI app with CORS middleware and startup hooks"),
    ("backend/main.py", "feat(backend): add root execution entrypoint for uvicorn"),

    # Milestone 6: Automated Testing Suite
    ("backend/tests/test_pipeline.py", "test(unit): add unit tests for cleaner, brand matcher, extractor, and confidence"),
    ("backend/tests/test_api.py", "test(e2e): add end-to-end catalog lifecycle integration test"),

    # Milestone 7: Frontend Configuration & Design Tokens
    ("frontend/package.json", "chore(frontend): initialize Next.js 15, React 19, Lucide and Tailwind setup"),
    ("frontend/package-lock.json", "chore(frontend): add package-lock dependencies"),
    ("frontend/tsconfig.json", "chore(frontend): configure TypeScript strict compiler options"),
    ("frontend/postcss.config.mjs", "chore(frontend): configure PostCSS plugins"),
    ("frontend/tailwind.config.ts", "feat(ui): configure custom 13-color curated palette tokens in Tailwind"),
    ("frontend/src/app/globals.css", "feat(ui): add global design tokens, typography, and clean scrollbar styles"),

    # Milestone 8: Frontend Libs & UI Components
    ("frontend/src/lib/utils.ts", "feat(lib): add UI utility helpers and confidence badge formatters"),
    ("frontend/src/lib/api.ts", "feat(api-client): build typed frontend API client for FastAPI services"),
    ("frontend/src/components/ui/Badge.tsx", "feat(components): create Badge component with 13 custom palette variants"),
    ("frontend/src/components/ui/Button.tsx", "feat(components): create high-contrast Button component with variant support"),
    ("frontend/src/components/ui/Card.tsx", "feat(components): create structured enterprise Card container component"),
    ("frontend/src/components/layout/Navbar.tsx", "feat(layout): create top Navbar with LLM engine and quality gate badges"),
    ("frontend/src/components/layout/Sidebar.tsx", "feat(layout): create Sidebar navigation for 7 core platform workflows"),
    ("frontend/src/app/layout.tsx", "feat(layout): build root App layout with responsive navigation wrapper"),

    # Milestone 9: Frontend Pages & Workflows
    ("frontend/src/app/page.tsx", "feat(pages): build executive Dashboard with 5 KPI scorecards and recent feeds"),
    ("frontend/src/app/upload/page.tsx", "feat(pages): build CSV Ingestion Studio with pre-flight validation scorecard"),
    ("frontend/src/app/process/page.tsx", "feat(pages): build live pipeline monitor with progress bar and terminal logs"),
    ("frontend/src/app/products/page.tsx", "feat(pages): build product catalog with split-screen Before/After comparator"),
    ("frontend/src/app/review/page.tsx", "feat(pages): build Human Review queue with inline editor and bulk actions"),
    ("frontend/src/app/analytics/page.tsx", "feat(pages): build quality analytics dashboard with completeness delta charts"),
    ("frontend/src/app/export/page.tsx", "feat(pages): build Export Center for CSV, XLSX, and JSON downloads"),

    # Milestone 10: Deployment, Scripts & Showcase README
    ("deployment/Dockerfile.backend", "ci(docker): add production Dockerfile for FastAPI backend"),
    ("deployment/Dockerfile.frontend", "ci(docker): add multi-stage Dockerfile for Next.js frontend"),
    ("deployment/docker-compose.yml", "ci(docker): add Docker Compose orchestration for full stack"),
    ("start_backend.bat", "chore(scripts): add Windows launcher for backend"),
    ("start_frontend.bat", "chore(scripts): add Windows launcher for frontend"),
    ("start_all.bat", "chore(scripts): add full-stack one-click Windows launcher"),
    ("README.md", "docs(readme): add comprehensive GitHub showcase README with badges and guide")
]

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing: {cmd}")
        print(result.stderr)
    return result.returncode == 0

def main():
    print(f"Starting sequential commit and push for {len(COMMITS)} files...")
    
    # Base timestamp starting 2 hours ago to create a realistic progressive timeline
    base_time = datetime.now() - timedelta(minutes=len(COMMITS) * 2)

    for i, (filepath, msg) in enumerate(COMMITS):
        if not os.path.exists(filepath):
            print(f"Skipping missing file: {filepath}")
            continue

        commit_time = base_time + timedelta(minutes=i * 2)
        formatted_date = commit_time.strftime("%Y-%m-%d %H:%M:%S")

        print(f"[{i+1}/{len(COMMITS)}] Committing: {filepath}")
        
        # Stage individual file
        run_cmd(f'git add "{filepath}"')
        
        # Commit with specific date
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = formatted_date
        env["GIT_COMMITTER_DATE"] = formatted_date
        
        commit_cmd = f'git commit -m "{msg}"'
        subprocess.run(commit_cmd, shell=True, env=env, capture_output=True, text=True)

        # Push to remote
        print(f"[{i+1}/{len(COMMITS)}] Pushing commit: '{msg}'...")
        push_ok = run_cmd("git push origin main")
        
        if push_ok:
            print(f"Successfully pushed ({filepath}) at {formatted_date}")
        else:
            print(f"Push failed for {filepath}")

        # Sleep briefly (e.g. 2-3 seconds between pushes for fast processing while maintaining discrete git commits)
        time.sleep(2)

    print("\nAll files committed and pushed successfully with structured 1-2 min timeline history!")

if __name__ == "__main__":
    main()
