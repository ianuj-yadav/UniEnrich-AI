from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.services.rules_service import rules_service

router = APIRouter()

class AddAbbrRequest(BaseModel):
    acronym: str
    expansion: str

class AddBrandRequest(BaseModel):
    canonical_name: str
    manufacturer: str
    aliases: List[str]

class TestTextRequest(BaseModel):
    raw_text: str

@router.get("/rules")
async def get_rules():
    return rules_service.get_all_rules()

@router.post("/rules/abbreviation")
async def add_abbreviation_rule(req: AddAbbrRequest):
    if not req.acronym or not req.expansion:
        raise HTTPException(status_code=400, detail="Acronym and expansion cannot be empty.")
    return rules_service.add_abbreviation(req.acronym, req.expansion)

@router.post("/rules/brand")
async def add_brand_rule(req: AddBrandRequest):
    if not req.canonical_name:
        raise HTTPException(status_code=400, detail="Canonical brand name cannot be empty.")
    return rules_service.add_brand_rule(req.canonical_name, req.manufacturer, req.aliases)

@router.post("/rules/test-text")
async def test_text_scratchpad(req: TestTextRequest):
    if not req.raw_text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    return rules_service.test_transformation(req.raw_text)
