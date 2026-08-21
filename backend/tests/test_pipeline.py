import pytest
import asyncio
from app.services.cleaner import cleaner_engine
from app.services.brand_matcher import brand_resolver
from app.services.attribute_extractor import attribute_extractor
from app.services.classifier import product_classifier
from app.services.description_generator import description_generator
from app.services.confidence import confidence_engine

def test_cleaner_placeholders():
    assert cleaner_engine.clean_placeholder("-- Unbranded --") is None
    assert cleaner_engine.clean_placeholder("N/A") is None
    assert cleaner_engine.clean_placeholder("3M") == "3M"

def test_cleaner_abbreviation_expansion():
    raw = "3/4 CPLG BRS 150#"
    expanded, count = cleaner_engine.expand_abbreviations(raw)
    assert "Coupling" in expanded
    assert "Brass" in expanded
    assert "150 PSI" in expanded
    assert count >= 3

def test_brand_resolver_aliases():
    # 3 M -> 3M™
    brand, mfr, conf = brand_resolver.resolve_brand("3 M")
    assert brand == "3M™"
    assert "3M" in mfr
    assert conf >= 0.85

    # DEWALT -> DEWALT®
    brand2, mfr2, conf2 = brand_resolver.resolve_brand("De Walt")
    assert brand2 == "DEWALT®"
    assert conf2 >= 0.85

def test_brand_resolver_from_description():
    desc = "MILWAUKEE M18 FUEL 1/2 IN IMPACT WRENCH"
    brand, mfr, conf = brand_resolver.resolve_brand(None, desc)
    assert brand == "Milwaukee®"
    assert conf >= 0.80

def test_attribute_extractor():
    text = "3/4 IN Brass Pipe Coupling 150 PSI Female NPT"
    attrs, conf = attribute_extractor.rule_based_extract(text)
    assert attrs.get("Material") == "Brass"
    assert "3/4" in attrs.get("Size", "")
    assert "150" in attrs.get("Pressure Rating", "")
    assert attrs.get("Thread Type") == "NPT"
    assert conf >= 0.80

def test_classifier():
    cat, subcat, family, unspsc, conf = product_classifier.classify("3/4 Coupling Brass Pipe Fitting")
    assert "Plumbing" in cat
    assert "Fittings" in subcat
    assert unspsc == "40141700"

def test_confidence_scoring():
    # High confidence test
    score, breakdown, status = confidence_engine.calculate_score(
        brand_conf=0.98,
        cat_conf=0.94,
        attr_conf=0.90,
        desc_conf=0.95
    )
    assert score >= 0.70
    assert status == "AUTO_APPROVED"

    # Low confidence test (< 70% threshold routing)
    score_low, _, status_low = confidence_engine.calculate_score(
        brand_conf=0.40,
        cat_conf=0.50,
        attr_conf=0.40,
        desc_conf=0.60
    )
    assert score_low < 0.70
    assert status_low == "NEEDS_REVIEW"
