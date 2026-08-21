import pytest
from app.services.duplicate_resolver import duplicate_resolver
from app.services.rules_service import rules_service
from app.services.localization import localization_service
from app.services.datasheet_parser import datasheet_parser
from app.services.exporter import catalog_exporter

def test_duplicate_resolver_similarity():
    item_a = {
        "product_title": "3M 3/4 in Brass Pipe Coupling, 150 PSI",
        "resolved_brand": "3M™",
        "extracted_attributes": {"Material": "Brass", "Size": "3/4 in"}
    }
    item_b = {
        "product_title": "3M 3/4 in Brass Coupling 150 LB",
        "resolved_brand": "3M™",
        "extracted_attributes": {"Material": "Brass", "Size": "3/4 in"}
    }
    sim = duplicate_resolver.calculate_similarity(item_a, item_b)
    assert sim >= 0.75

def test_rules_scratchpad():
    result = rules_service.test_transformation("3/4 CPLG BRS 150#")
    assert "Coupling" in result["expanded_text"]
    assert "Brass" in result["expanded_text"]
    assert "150 PSI" in result["expanded_text"]

def test_localization():
    result = localization_service.translate_templated(
        title="3M 3/4 in Brass Coupling",
        mobile_desc="Heavy duty brass coupling",
        long_desc="Industrial pipe fitting.",
        target_lang="es"
    )
    assert result["language"] == "es"
    assert "(ES)" in result["product_title"]

def test_datasheet_rule_parser():
    sample_text = """
    MODEL NO: PK-9042
    MANUFACTURER: Parker Hannifin
    SIZE: 1/2 IN
    MATERIAL: Stainless Steel 316
    MAX PRESSURE: 5000 PSI
    """
    res = datasheet_parser.rule_based_spec_parse("sample_valve.pdf", sample_text)
    assert res["detected_sku"] == "PK-9042"
    assert "Parker" in res["detected_brand"]
    assert "5000" in res["technical_specs"].get("Pressure Rating", "")

def test_shopify_and_magento_export():
    items = [{
        "canonical_sku": "SKU-999",
        "product_title": "DeWalt 20V Cordless Drill",
        "resolved_brand": "DEWALT®",
        "category": "Tools",
        "subcategory": "Drills",
        "extracted_attributes": {"Voltage": "20V", "Chuck": "1/2 in"}
    }]
    shopify_buf = catalog_exporter.export_csv(items, template="shopify")
    content = shopify_buf.getvalue().decode("utf-8")
    assert "Handle" in content
    assert "DeWalt" in content
    assert "active" in content
