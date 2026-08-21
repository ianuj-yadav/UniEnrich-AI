import pytest
import io
import asyncio
from pathlib import Path
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import init_db

@pytest.mark.asyncio
async def test_full_catalog_lifecycle():
    await init_db()
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        health_resp = await client.get("/health")
        assert health_resp.status_code == 200
        assert health_resp.json()["status"] == "HEALTHY"

        # 2. Upload sample CSV file
        sample_csv_path = Path(__file__).resolve().parent.parent.parent / "datasets" / "sample_messy_catalog.csv"
        with open(sample_csv_path, "rb") as f:
            file_content = f.read()

        files = {"file": ("sample_messy_catalog.csv", file_content, "text/csv")}
        upload_resp = await client.post("/api/v1/upload", files=files)
        assert upload_resp.status_code == 200
        upload_data = upload_resp.json()
        batch_id = upload_data["batch_id"]
        assert upload_data["total_rows"] >= 10
        assert "preview_records" in upload_data

        # 3. Start enrichment
        enrich_resp = await client.post(f"/api/v1/enrich/{batch_id}")
        assert enrich_resp.status_code == 200
        assert enrich_resp.json()["status"] == "STARTED"

        # Wait a moment for background task to finish processing 10 items
        for _ in range(20):
            await asyncio.sleep(0.3)
            prog_resp = await client.get(f"/api/v1/enrich/progress/{batch_id}")
            prog_data = prog_resp.json()
            if prog_data["status"] == "COMPLETED":
                break

        assert prog_data["status"] == "COMPLETED"
        assert prog_data["processed_records"] == upload_data["total_rows"]

        # 4. Fetch enriched products
        prods_resp = await client.get(f"/api/v1/products/{batch_id}")
        assert prods_resp.status_code == 200
        prods_data = prods_resp.json()
        assert len(prods_data["items"]) == upload_data["total_rows"]
        
        # Verify first item (3M 3/4 CPLG BRS 150#)
        first_item = prods_data["items"][0]
        assert first_item["resolved_brand"] == "3M™"
        assert "Coupling" in first_item["product_title"]
        assert first_item["extracted_attributes"].get("Material") == "Brass"

        # 5. Split-Screen Comparison
        compare_resp = await client.get(f"/api/v1/products/{first_item['id']}/compare")
        assert compare_resp.status_code == 200
        compare_data = compare_resp.json()
        assert "raw_record" in compare_data
        assert "enriched_record" in compare_data
        assert len(compare_data["changed_fields"]) > 0

        # 6. Human Review edit test
        review_resp = await client.post(
            "/api/v1/review/submit",
            json={
                "product_id": first_item["id"],
                "action": "EDIT",
                "edits": {"product_title": "3M™ Custom Approved Brass Pipe Coupling 150 PSI"}
            }
        )
        assert review_resp.status_code == 200
        assert review_resp.json()["confidence_score"] == 1.0

        # 7. Analytics overview
        analytics_resp = await client.get(f"/api/v1/analytics/{batch_id}")
        assert analytics_resp.status_code == 200
        analytics_data = analytics_resp.json()
        assert analytics_data["total_products"] == upload_data["total_rows"]
        assert len(analytics_data["brand_distribution"]) > 0

        # 8. Export CSV
        export_resp = await client.get(f"/api/v1/export/{batch_id}?format=csv")
        assert export_resp.status_code == 200
        assert "text/csv" in export_resp.headers["content-type"]
        assert b"3M" in export_resp.content
