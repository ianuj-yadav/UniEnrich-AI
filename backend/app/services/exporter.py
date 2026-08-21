import io
import json
import re
import pandas as pd
from typing import List, Dict, Any

class CatalogExporter:
    def sanitize_for_csv(self, value: Any) -> Any:
        """
        Prevents CSV Formula Injection attacks by prepending single quote to dangerous symbols.
        """
        if isinstance(value, str) and len(value) > 0:
            if value[0] in ("=", "+", "-", "@", "\t", "\r"):
                return f"'{value}"
        return value

    def format_records_standard(self, enriched_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        flat_records = []
        for item in enriched_items:
            attrs = item.get("extracted_attributes") or {}
            attr_str = "; ".join([f"{k}: {v}" for k, v in attrs.items()])
            
            rec = {
                "SKU": self.sanitize_for_csv(item.get("canonical_sku") or item.get("raw_sku")),
                "Product_Title": self.sanitize_for_csv(item.get("product_title")),
                "Resolved_Brand": self.sanitize_for_csv(item.get("resolved_brand")),
                "Manufacturer": self.sanitize_for_csv(item.get("resolved_manufacturer")),
                "Category": self.sanitize_for_csv(item.get("category")),
                "Subcategory": self.sanitize_for_csv(item.get("subcategory")),
                "UNSPSC_Code": self.sanitize_for_csv(item.get("unspsc_code")),
                "Material": self.sanitize_for_csv(attrs.get("Material", "")),
                "Size_Diameter": self.sanitize_for_csv(attrs.get("Size", "")),
                "Pressure_Rating": self.sanitize_for_csv(attrs.get("Pressure Rating", "")),
                "Voltage": self.sanitize_for_csv(attrs.get("Voltage", "")),
                "Connection_Type": self.sanitize_for_csv(attrs.get("Connection Type", "")),
                "All_Attributes": self.sanitize_for_csv(attr_str),
                "Mobile_Description": self.sanitize_for_csv(item.get("mobile_description")),
                "Long_Description": self.sanitize_for_csv(item.get("long_description")),
                "Confidence_Score": item.get("confidence_score"),
                "Review_Status": item.get("review_status")
            }
            flat_records.append(rec)
        return flat_records

    def format_records_shopify(self, enriched_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        shopify_records = []
        for item in enriched_items:
            sku = str(item.get("canonical_sku") or item.get("raw_sku") or "SKU")
            handle = re.sub(r"[^a-z0-9\-]+", "-", (item.get("product_title") or sku).lower()).strip("-")
            attrs = item.get("extracted_attributes") or {}
            tags = [item.get("resolved_brand", ""), item.get("category", ""), item.get("subcategory", "")]
            tags.extend([f"{k}:{v}" for k, v in attrs.items()])

            rec = {
                "Handle": handle,
                "Title": self.sanitize_for_csv(item.get("product_title")),
                "Body (HTML)": f"<p>{item.get('long_description', '')}</p><p><strong>Mobile Summary:</strong> {item.get('mobile_description', '')}</p>",
                "Vendor": self.sanitize_for_csv(item.get("resolved_brand") or item.get("resolved_manufacturer") or "Industrial Supplier"),
                "Standardized Product Type": self.sanitize_for_csv(item.get("subcategory") or item.get("category")),
                "Custom Product Type": self.sanitize_for_csv(item.get("category")),
                "Tags": ", ".join([t for t in tags if t]),
                "Published": "TRUE",
                "Option1 Name": "Title",
                "Option1 Value": "Default Title",
                "Variant SKU": self.sanitize_for_csv(sku),
                "Variant Grams": "500",
                "Variant Inventory Tracker": "shopify",
                "Variant Inventory Qty": "100",
                "Variant Inventory Policy": "deny",
                "Variant Fulfillment Service": "manual",
                "Variant Price": "19.99",
                "Variant Requires Shipping": "TRUE",
                "Variant Taxable": "TRUE",
                "Status": "active"
            }
            shopify_records.append(rec)
        return shopify_records

    def format_records_magento(self, enriched_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        magento_records = []
        for item in enriched_items:
            sku = str(item.get("canonical_sku") or item.get("raw_sku") or "SKU")
            rec = {
                "sku": self.sanitize_for_csv(sku),
                "attribute_set_code": "Industrial_MRO",
                "product_type": "simple",
                "categories": f"Default Category/{item.get('category', 'Supplies')}/{item.get('subcategory', 'General')}",
                "name": self.sanitize_for_csv(item.get("product_title")),
                "description": self.sanitize_for_csv(item.get("long_description")),
                "short_description": self.sanitize_for_csv(item.get("mobile_description")),
                "price": "19.99",
                "weight": "1.0",
                "visibility": "Catalog, Search",
                "status": "Enabled",
                "tax_class_name": "Taxable Goods",
                "manufacturer": self.sanitize_for_csv(item.get("resolved_brand")),
                "unspsc_code": self.sanitize_for_csv(item.get("unspsc_code"))
            }
            magento_records.append(rec)
        return magento_records

    def export_csv(self, enriched_items: List[Dict[str, Any]], template: str = "standard") -> io.BytesIO:
        if template == "shopify":
            flat = self.format_records_shopify(enriched_items)
        elif template == "magento":
            flat = self.format_records_magento(enriched_items)
        else:
            flat = self.format_records_standard(enriched_items)

        df = pd.DataFrame(flat)
        buf = io.BytesIO()
        df.to_csv(buf, index=False, encoding="utf-8")
        buf.seek(0)
        return buf

    def export_excel(self, enriched_items: List[Dict[str, Any]], template: str = "standard") -> io.BytesIO:
        if template == "shopify":
            flat = self.format_records_shopify(enriched_items)
        elif template == "magento":
            flat = self.format_records_magento(enriched_items)
        else:
            flat = self.format_records_standard(enriched_items)

        df = pd.DataFrame(flat)
        buf = io.BytesIO()
        with pd.ExcelWriter(buf, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Enriched_Products")
        buf.seek(0)
        return buf

    def export_json(self, enriched_items: List[Dict[str, Any]]) -> io.BytesIO:
        buf = io.BytesIO()
        json_str = json.dumps(enriched_items, indent=2, default=str)
        buf.write(json_str.encode("utf-8"))
        buf.seek(0)
        return buf

catalog_exporter = CatalogExporter()
