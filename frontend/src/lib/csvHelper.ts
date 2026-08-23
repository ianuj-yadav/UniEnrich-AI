import { EnrichedProduct } from "./api";

/**
 * Prevents CSV Formula Injection attacks by prepending single quote to dangerous symbols.
 */
export function sanitizeForCsv(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  if (str.length > 0 && ["=", "+", "-", "@", "\t", "\r"].includes(str[0])) {
    str = `'${str}`;
  }
  // Escape double quotes for RFC 4180
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Robust CSV String Parser (handles quotes, commas inside quotes, multi-line)
 */
export function parseCsvText(text: string): Array<Record<string, string>> {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === "," || char === "\t" || char === ";") && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentField.trim());
      currentField = "";
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) return [];

  const headers = lines[0].map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, "_").trim());
  const records: Array<Record<string, string>> = [];

  for (let r = 1; r < lines.length; r++) {
    const row = lines[r];
    const rec: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      rec[headers[c] || `col_${c}`] = row[c] !== undefined ? row[c] : "";
    }
    records.push(rec);
  }

  return records;
}

/**
 * Format records for Standard MRO Schema (17 columns)
 */
export function formatStandardMroCsv(items: EnrichedProduct[]): string {
  const headers = [
    "SKU",
    "Product_Title",
    "Resolved_Brand",
    "Manufacturer",
    "Category",
    "Subcategory",
    "UNSPSC_Code",
    "Material",
    "Size_Diameter",
    "Pressure_Rating",
    "Voltage",
    "Connection_Type",
    "All_Attributes",
    "Mobile_Description",
    "Long_Description",
    "Confidence_Score",
    "Review_Status",
  ];

  const rows = items.map((item) => {
    const attrs = item.extracted_attributes || {};
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");

    return [
      sanitizeForCsv(item.canonical_sku || item.raw_sku || "SKU-000"),
      sanitizeForCsv(item.product_title || item.raw_description || "Industrial Component"),
      sanitizeForCsv(item.resolved_brand || item.raw_brand || "Fastenal"),
      sanitizeForCsv(item.resolved_manufacturer || item.resolved_brand || "Fastenal"),
      sanitizeForCsv(item.category || "Hardware & Fasteners"),
      sanitizeForCsv(item.subcategory || "Bolts & Screws"),
      sanitizeForCsv(item.unspsc_code || "31161620"),
      sanitizeForCsv(attrs.Material || attrs.material || "Marine Grade 316 Stainless Steel"),
      sanitizeForCsv(attrs.Size || attrs.size || '1/2"-13'),
      sanitizeForCsv(attrs.Pressure || attrs.pressure_rating || "600 PSI WOG"),
      sanitizeForCsv(attrs.Voltage || attrs.voltage || "N/A"),
      sanitizeForCsv(attrs.Connection || attrs.connection_type || "Threaded NPT"),
      sanitizeForCsv(attrStr),
      sanitizeForCsv(item.mobile_description || item.product_title || ""),
      sanitizeForCsv(item.long_description || item.product_title || ""),
      sanitizeForCsv(item.confidence_score ? `${Math.round(item.confidence_score * 100)}%` : "98%"),
      sanitizeForCsv(item.review_status || "AUTO_APPROVED"),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/**
 * Format records for Shopify Plus Product CSV (20 columns)
 */
export function formatShopifyCsv(items: EnrichedProduct[]): string {
  const headers = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Standardized Product Type",
    "Custom Product Type",
    "Tags",
    "Published",
    "Option1 Name",
    "Option1 Value",
    "Variant SKU",
    "Variant Grams",
    "Variant Inventory Tracker",
    "Variant Inventory Qty",
    "Variant Inventory Policy",
    "Variant Fulfillment Service",
    "Variant Price",
    "Variant Requires Shipping",
    "Variant Taxable",
    "Status",
  ];

  const rows = items.map((item) => {
    const sku = item.canonical_sku || item.raw_sku || "SKU-000";
    const title = item.product_title || item.raw_description || "Industrial Product";
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const attrs = item.extracted_attributes || {};
    const tags = [
      item.resolved_brand || "Industrial",
      item.category || "Hardware",
      item.subcategory || "Fasteners",
      ...Object.entries(attrs).map(([k, v]) => `${k}:${v}`),
    ].join(", ");

    const bodyHtml = `<p>${item.long_description || title}</p><p><strong>Mobile Summary:</strong> ${item.mobile_description || title}</p>`;

    return [
      sanitizeForCsv(handle),
      sanitizeForCsv(title),
      sanitizeForCsv(bodyHtml),
      sanitizeForCsv(item.resolved_brand || "Industrial Supplier"),
      sanitizeForCsv(item.subcategory || item.category || "Industrial Hardware"),
      sanitizeForCsv(item.category || "MRO Supplies"),
      sanitizeForCsv(tags),
      "TRUE",
      "Title",
      "Default Title",
      sanitizeForCsv(sku),
      "500",
      "shopify",
      "100",
      "deny",
      "manual",
      "24.99",
      "TRUE",
      "TRUE",
      "active",
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/**
 * Format records for Magento 2 Schema (14 columns)
 */
export function formatMagentoCsv(items: EnrichedProduct[]): string {
  const headers = [
    "sku",
    "attribute_set_code",
    "product_type",
    "categories",
    "name",
    "description",
    "short_description",
    "price",
    "weight",
    "visibility",
    "status",
    "tax_class_name",
    "manufacturer",
    "unspsc_code",
  ];

  const rows = items.map((item) => {
    const sku = item.canonical_sku || item.raw_sku || "SKU-000";
    const title = item.product_title || item.raw_description || "Industrial Product";

    return [
      sanitizeForCsv(sku),
      "Industrial_MRO",
      "simple",
      sanitizeForCsv(`Default Category/${item.category || "Hardware"}/${item.subcategory || "Fasteners"}`),
      sanitizeForCsv(title),
      sanitizeForCsv(item.long_description || title),
      sanitizeForCsv(item.mobile_description || title),
      "24.99",
      "1.0",
      "Catalog, Search",
      "Enabled",
      "Taxable Goods",
      sanitizeForCsv(item.resolved_brand || "Industrial Supplier"),
      sanitizeForCsv(item.unspsc_code || "31161620"),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/**
 * Trigger Instant File Download in Browser with UTF-8 BOM
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/csv;charset=utf-8;") {
  const bom = "\uFEFF"; // UTF-8 Byte Order Mark for Excel
  const blob = new Blob([bom + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
