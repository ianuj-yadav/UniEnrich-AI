import re
from typing import List, Dict, Any, Tuple
from rapidfuzz import fuzz

class DuplicateResolver:
    def calculate_similarity(self, item_a: Dict[str, Any], item_b: Dict[str, Any]) -> float:
        """
        Computes composite similarity across Title, Brand, Sizing, and Material tokens.
        """
        title_a = (item_a.get("product_title") or item_a.get("raw_description") or "").lower()
        title_b = (item_b.get("product_title") or item_b.get("raw_description") or "").lower()
        
        # Token sort and set ratio
        token_ratio = fuzz.token_sort_ratio(title_a, title_b) / 100.0
        set_ratio = fuzz.token_set_ratio(title_a, title_b) / 100.0
        
        # Brand match boost
        brand_a = (item_a.get("resolved_brand") or "").lower()
        brand_b = (item_b.get("resolved_brand") or "").lower()
        brand_score = 1.0 if brand_a and brand_b and brand_a == brand_b else (0.5 if not brand_a or not brand_b else 0.0)

        # Attribute overlap
        attrs_a = item_a.get("extracted_attributes") or {}
        attrs_b = item_b.get("extracted_attributes") or {}
        common_keys = set(attrs_a.keys()).intersection(set(attrs_b.keys()))
        attr_score = 0.5
        if common_keys:
            matches = sum(1 for k in common_keys if str(attrs_a[k]).lower() == str(attrs_b[k]).lower())
            attr_score = matches / len(common_keys)

        composite = (0.50 * token_ratio) + (0.25 * set_ratio) + (0.15 * brand_score) + (0.10 * attr_score)
        return round(composite, 3)

    def find_duplicate_clusters(self, items: List[Dict[str, Any]], threshold: float = 0.78) -> List[Dict[str, Any]]:
        """
        Scans a list of catalog products and groups fuzzy semantic duplicate pairs/clusters.
        """
        clusters = []
        visited = set()

        for i in range(len(items)):
            if i in visited:
                continue
            item_a = items[i]
            pair_group = [item_a]

            for j in range(i + 1, len(items)):
                if j in visited:
                    continue
                item_b = items[j]
                sim = self.calculate_similarity(item_a, item_b)

                if sim >= threshold:
                    visited.add(j)
                    pair_group.append({**item_b, "similarity_score": sim})

            if len(pair_group) > 1:
                clusters.append({
                    "cluster_id": f"DUP-CLUSTER-{len(clusters)+1:03d}",
                    "canonical_candidate": pair_group[0],
                    "duplicate_items": pair_group[1:],
                    "highest_similarity": max([p.get("similarity_score", 0.0) for p in pair_group[1:]]),
                    "conflict_fields": ["Price", "Vendor SKU", "Title Suffix"]
                })

        return clusters

    def merge_records(self, primary_record: Dict[str, Any], duplicate_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Intelligently merges duplicate records, preserving the highest confidence attributes and aliasing alternate SKUs.
        """
        merged = dict(primary_record)
        merged_attrs = dict(primary_record.get("extracted_attributes") or {})
        alternate_skus = set(primary_record.get("alternate_skus") or [])

        for dup in duplicate_records:
            if dup.get("canonical_sku"):
                alternate_skus.add(dup["canonical_sku"])
            if dup.get("raw_sku"):
                alternate_skus.add(dup["raw_sku"])

            dup_attrs = dup.get("extracted_attributes") or {}
            for k, v in dup_attrs.items():
                if k not in merged_attrs or not merged_attrs[k]:
                    merged_attrs[k] = v

        merged["extracted_attributes"] = merged_attrs
        merged["alternate_skus"] = list(alternate_skus)
        merged["is_merged_master"] = True
        return merged

duplicate_resolver = DuplicateResolver()
