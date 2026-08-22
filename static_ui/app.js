/**
 * UniEnrich AI - Standalone Pure JavaScript Application Engine
 * Connects directly to FastAPI backend at http://localhost:8000/api/v1
 */

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:8000/api/v1" 
  : "/api/v1";

let state = {
  batches: [],
  activeBatchId: null,
  activeBatch: null,
  catalogProducts: [],
  reviewProducts: [],
  selectedExportChannel: "standard",
  pollInterval: null,
  currentStatusFilter: "ALL"
};

// Initialization on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initTabNavigation();
  initUploadDropzone();
  loadBatches();
  setupKeyboardShortcuts();
  checkApiHealth();
});

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `✅ ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE.replace("/api/v1", "")}/health`);
    if (res.ok) {
      document.getElementById("apiStatusText").textContent = "Online (v1.0.0)";
    }
  } catch {
    document.getElementById("apiStatusText").textContent = "Connecting...";
  }
}

// Tab Navigation
function initTabNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

  const targetBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const targetPane = document.getElementById(`tab-${tabId}`);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetPane) targetPane.classList.add("active");

  if (tabId === "products") loadCatalogProducts();
  if (tabId === "review") loadReviewQueue();
  if (tabId === "duplicates") loadDuplicateClusters();
}

// Load Batches & Populate UI
async function loadBatches() {
  try {
    const res = await fetch(`${API_BASE}/batches`);
    if (!res.ok) return;
    const batches = await res.json();
    state.batches = batches;

    if (batches.length > 0) {
      if (!state.activeBatchId) {
        state.activeBatchId = batches[0].id;
        state.activeBatch = batches[0];
      }
      document.getElementById("activeFeedName").textContent = state.activeBatch.filename;
    }

    renderDashboardKPIs(batches);
    renderDashboardBatches(batches);
    populateCatalogBatchSelect(batches);
  } catch (err) {
    console.error("Failed to load batches:", err);
  }
}

function renderDashboardKPIs(batches) {
  const totalUploaded = batches.reduce((acc, b) => acc + b.total_records, 0);
  const totalProcessed = batches.reduce((acc, b) => acc + b.processed_records, 0);
  const totalDuplicates = batches.reduce((acc, b) => acc + b.duplicate_records, 0);
  const totalNeedsReview = batches.reduce((acc, b) => acc + b.missing_brand_records, 0);

  document.getElementById("kpiTotalUploaded").textContent = totalUploaded.toLocaleString();
  document.getElementById("kpiTotalProcessed").textContent = totalProcessed.toLocaleString();
  document.getElementById("kpiDuplicates").textContent = totalDuplicates.toLocaleString();
  document.getElementById("kpiNeedsReview").textContent = totalNeedsReview.toLocaleString();
  document.getElementById("sidebarReviewCount").textContent = totalNeedsReview;
  document.getElementById("reviewCountBadge").textContent = totalNeedsReview;
}

function renderDashboardBatches(batches) {
  const tbody = document.getElementById("dashboardBatchesBody");
  if (!tbody) return;

  if (batches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No feeds uploaded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = batches.map((b) => `
    <tr>
      <td><strong>${b.filename}</strong></td>
      <td>${b.total_records}</td>
      <td><span class="badge ${b.status === 'COMPLETED' ? 'badge-green' : b.status === 'PROCESSING' ? 'badge-purple' : 'badge-yellow'}">${b.status}</span></td>
      <td>
        <span class="text-green">${b.total_records - b.error_records} Valid</span> &bull; 
        <span class="text-yellow">${b.missing_brand_records} Need Review</span> &bull; 
        <span class="text-red">${b.duplicate_records} Dups</span>
      </td>
      <td class="text-muted">${new Date(b.uploaded_at).toLocaleDateString()}</td>
      <td class="text-right">
        <button class="btn btn-secondary btn-sm" onclick="openBatchInCatalog('${b.id}')">View</button>
        <button class="btn btn-primary btn-sm" onclick="switchTab('export')">Export</button>
      </td>
    </tr>
  `).join("");
}

function populateCatalogBatchSelect(batches) {
  const select = document.getElementById("catalogBatchSelect");
  if (!select) return;
  select.innerHTML = batches.map((b) => `
    <option value="${b.id}" ${b.id === state.activeBatchId ? "selected" : ""}>${b.filename} (${b.total_records} SKUs)</option>
  `).join("");
}

function openBatchInCatalog(batchId) {
  state.activeBatchId = batchId;
  populateCatalogBatchSelect(state.batches);
  switchTab("products");
}

// Ingestion & File Upload
function initUploadDropzone() {
  const dropzone = document.getElementById("uploadDropzone");
  const fileInput = document.getElementById("catalogFileInput");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--blue-primary)";
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "var(--border-light)";
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--border-light)";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  });
}

async function handleFileUpload(file) {
  document.getElementById("dropzoneFilename").textContent = `Uploading: ${file.name}...`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed");
    const result = await res.json();
    state.activeBatchId = result.batch_id;
    renderScorecard(result);
    loadBatches();
    showToast(`Uploaded ${result.total_rows} catalog SKUs successfully.`);
  } catch (err) {
    alert("Upload error: " + err.message);
  }
}

async function loadDomainPreset(domain) {
  let content = "";
  let name = "";
  if (domain === "mro") {
    name = "mro_piping_catalog.csv";
    content = `SKU,Brand,Raw_Description,Category,Price\nSKU-1001,3 M,"3/4 CPLG BRS 150# <p>Pipe fitting</p>",,14.50\nSKU-1002,-- Unbranded --,"1/2 IN BALL VALV BRS FNPT 600 WOG",,22.80\nSKU-1005,3M INC,"2 IN FLG SS 316 150 LB ANSI B16.5",,89.20\nSKU-1008,Parker Hannifin,"1/4 IN OD TUBE X 1/4 IN NPT MALE COMPRESSION ELBOW BRASS",,8.75\nSKU-1010,N/A,"SCH 40 PVC TEE 1-1/2 IN SLIP X SLIP X SLIP",,3.25`;
  } else if (domain === "electrical") {
    name = "electrical_feed.csv";
    content = `SKU,Brand,Raw_Description,Category,Price\nSKU-2001,Square D,"20A 1-POLE CIRCUIT BREAKER 120V QO120",,11.50\nSKU-2002,Square D,"100A 2-POLE MAIN BREAKER 120/240V QOM2100",,85.00\nSKU-2003,Klein,"1000V INSULATED HIGH-LEVERAGE SIDE-CUTTING PLIERS 9-INCH",Hand Tools,45.00\nSKU-2004,-- Unbranded --,"12/2 WG NM-B WIRE 250 FT COPPER 600V",,78.50\nSKU-2005,Leviton,"15A 125V DUPLEX RECEPTACLE TAMPER RESISTANT WHITE",,2.45`;
  } else {
    name = "tools_machinery.csv";
    content = `SKU,Brand,Raw_Description,Category,Price\nSKU-3001,DEWALT,"20V MAX CORDLESS DRILL 1/2 IN CHUCK BL MOTOR",Power Tools,129.00\nSKU-3002,De Walt,"ATOMIC 20V MAX COMPACT 1/4 IN IMPACT DRIVER",Power Tools,119.00\nSKU-3003,Milwaukee Electric,"M18 FUEL 1/2 IN IMPACT WRENCH 1400 FT-LBS",,249.00\nSKU-3004,Milwaukee,"M12 CORDLESS 3/8 IN RATCHET BARE TOOL 2457-20",,139.00\nSKU-3005,Bosch,"18V 1-INCH SDS-PLUS ROTARY HAMMER BULLDOG",Power Tools,219.00`;
  }

  const dummyFile = new File([content], name, { type: "text/csv" });
  await handleFileUpload(dummyFile);
}

function renderScorecard(res) {
  document.getElementById("scorecardContainer").style.display = "block";
  document.getElementById("scTotalRows").textContent = res.total_rows;
  document.getElementById("scErrorRows").textContent = res.error_rows;
  document.getElementById("scDuplicateRows").textContent = res.duplicate_rows;
  document.getElementById("scMissingBrandRows").textContent = res.missing_brand_rows;

  const tbody = document.getElementById("rawPreviewTableBody");
  tbody.innerHTML = res.preview_records.map((r) => `
    <tr>
      <td>${r.row_index}</td>
      <td class="font-mono text-blue">${r.sku || "—"}</td>
      <td>${r.brand ? r.brand : '<em class="text-yellow">Missing</em>'}</td>
      <td class="font-mono text-muted">${r.description}</td>
      <td>${r.category || "—"}</td>
      <td><span class="badge ${r.has_error ? 'badge-red' : 'badge-green'}">${r.has_error ? 'Error' : 'Ready'}</span></td>
    </tr>
  `).join("");
}

// Pipeline Execution
async function triggerEnrichmentPipeline() {
  if (!state.activeBatchId) return;
  switchTab("process");

  try {
    await fetch(`${API_BASE}/enrich/${state.activeBatchId}`, { method: "POST" });
    pollPipelineProgress();
  } catch (err) {
    alert("Pipeline start error: " + err.message);
  }
}

function pollPipelineProgress() {
  if (state.pollInterval) clearInterval(state.pollInterval);

  state.pollInterval = setInterval(async () => {
    if (!state.activeBatchId) return;
    try {
      const res = await fetch(`${API_BASE}/enrich/progress/${state.activeBatchId}`);
      if (!res.ok) return;
      const data = await res.json();

      document.getElementById("pipelineProgressBar").style.width = `${data.progress_percentage}%`;
      document.getElementById("pipelineProgressBadge").textContent = `${data.progress_percentage}% Complete`;
      document.getElementById("pipelineStatusTitle").textContent = `Pipeline Status: ${data.status}`;
      document.getElementById("pipelineStatusSub").textContent = `Current Step: ${data.current_step}`;

      if (data.logs && data.logs.length > 0) {
        document.getElementById("pipelineLogsContainer").innerHTML = data.logs.map((l) => `<div class="log-line">${l}</div>`).join("");
      }

      if (data.status === "COMPLETED") {
        clearInterval(state.pollInterval);
        showToast("AI Enrichment completed successfully!");
        loadBatches();
      }
    } catch (err) {
      console.error(err);
    }
  }, 1000);
}

// Catalog Products Loading & Filtering
async function loadCatalogProducts() {
  const select = document.getElementById("catalogBatchSelect");
  if (select && select.value) state.activeBatchId = select.value;
  if (!state.activeBatchId) return;

  const tbody = document.getElementById("catalogProductsBody");
  tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Loading catalog items...</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/products/${state.activeBatchId}?status=${state.currentStatusFilter}`);
    if (!res.ok) return;
    const data = await res.json();
    state.catalogProducts = data.items;
    renderCatalogProducts(data.items);
  } catch (err) {
    console.error(err);
  }
}

function renderCatalogProducts(items) {
  const tbody = document.getElementById("catalogProductsBody");
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No products match criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map((p) => {
    const conf = Math.round((p.confidence_score || 0) * 100);
    const attrs = p.extracted_attributes || {};
    const attrPills = Object.entries(attrs).slice(0, 3).map(([k, v]) => `<span class="badge badge-lime">${k}: ${v}</span>`).join(" ");

    return `
      <tr>
        <td class="font-mono text-blue font-semibold">${p.canonical_sku || p.raw_sku}</td>
        <td><strong>${p.resolved_brand || "Unbranded"}</strong><div class="text-muted text-xs">${p.resolved_manufacturer || ""}</div></td>
        <td class="max-w-xs truncate">${p.product_title || p.raw_description}</td>
        <td>${p.category || "—"}<div class="text-purple font-mono text-xs">UNSPSC: ${p.unspsc_code || "—"}</div></td>
        <td>${attrPills}</td>
        <td><span class="badge ${conf >= 85 ? 'badge-green' : conf >= 70 ? 'badge-yellow' : 'badge-red'}">${conf}% Conf</span></td>
        <td><span class="badge badge-blue">${p.review_status}</span></td>
        <td class="text-right">
          <div class="flex-end gap-2">
            <button class="btn btn-secondary btn-sm" onclick="copyProductJSON('${p.id}')" title="Copy JSON">📋 JSON</button>
            <button class="btn btn-primary btn-sm" onclick="openCompareModal('${p.id}')">Compare</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function copyProductJSON(productId) {
  const prod = state.catalogProducts.find((p) => p.id === productId);
  if (!prod) return;
  navigator.clipboard.writeText(JSON.stringify(prod, null, 2));
  showToast(`Copied JSON for SKU ${prod.canonical_sku || prod.raw_sku}`);
}

function filterCatalogStatus(status) {
  state.currentStatusFilter = status;
  document.querySelectorAll(".filter-pills .pill").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-status") === status);
  });
  loadCatalogProducts();
}

function handleCatalogSearch(val) {
  const q = val.toLowerCase();
  const filtered = state.catalogProducts.filter((p) => 
    (p.product_title || "").toLowerCase().includes(q) || 
    (p.canonical_sku || "").toLowerCase().includes(q) ||
    (p.resolved_brand || "").toLowerCase().includes(q)
  );
  renderCatalogProducts(filtered);
}

// Split Comparison Modal
async function openCompareModal(productId) {
  document.getElementById("compareModalOverlay").style.display = "flex";
  document.getElementById("compareModalBody").innerHTML = `<div class="text-center py-6 text-muted">Loading comparison...</div>`;

  try {
    const res = await fetch(`${API_BASE}/products/${productId}/compare`);
    if (!res.ok) return;
    const comp = await res.json();

    document.getElementById("compareModalTitle").textContent = `Split-Screen Comparison: ${comp.enriched_record.sku}`;
    document.getElementById("compareModalBody").innerHTML = `
      <div class="grid-2col mb-4">
        <!-- Before -->
        <div class="card bg-canvas">
          <h4 class="text-muted uppercase text-xs font-bold mb-2">Original Raw Feed (Before)</h4>
          <div class="space-y-2 text-xs">
            <div><span class="text-muted block">Raw Brand:</span> <strong>${comp.raw_record.brand || "Empty"}</strong></div>
            <div><span class="text-muted block">Raw Description:</span> <p class="font-mono bg-card p-2 rounded">${comp.raw_record.description}</p></div>
            <div><span class="text-muted block">Raw Category:</span> ${comp.raw_record.category || "—"}</div>
          </div>
        </div>

        <!-- After -->
        <div class="card bg-canvas border-blue">
          <div class="flex-between mb-2">
            <h4 class="text-blue uppercase text-xs font-bold">AI Enriched Record (After)</h4>
            <span class="badge badge-green">${Math.round(comp.confidence_score * 100)}% Confidence</span>
          </div>
          <div class="space-y-2 text-xs">
            <div><span class="text-muted block">Canonical Brand:</span> <strong class="text-green">${comp.enriched_record.brand}</strong> (${comp.enriched_record.manufacturer})</div>
            <div><span class="text-muted block">Standardized Title:</span> <p class="font-bold text-white bg-card p-2 rounded">${comp.enriched_record.title}</p></div>
            <div><span class="text-muted block">Taxonomy &amp; UNSPSC:</span> ${comp.enriched_record.category} &rarr; ${comp.enriched_record.subcategory} <span class="text-purple font-mono">(${comp.enriched_record.unspsc})</span></div>
            <div><span class="text-muted block">Extracted Specs:</span> <p class="font-mono text-lime">${JSON.stringify(comp.enriched_record.attributes)}</p></div>
          </div>
        </div>
      </div>

      <div class="card bg-canvas">
        <h4 class="text-xs font-bold text-white mb-1">Generated Mobile Summary:</h4>
        <p class="text-xs text-muted">${comp.enriched_record.mobile_description}</p>
        <h4 class="text-xs font-bold text-white mt-3 mb-1">E-Commerce Long Description:</h4>
        <p class="text-xs text-muted">${comp.enriched_record.long_description}</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

function closeCompareModal() {
  document.getElementById("compareModalOverlay").style.display = "none";
}

// Human Review Queue
async function loadReviewQueue() {
  if (!state.activeBatchId) return;
  const tbody = document.getElementById("reviewTableBody");

  try {
    const res = await fetch(`${API_BASE}/products/${state.activeBatchId}?status=NEEDS_REVIEW`);
    if (!res.ok) return;
    const data = await res.json();
    state.reviewProducts = data.items;

    if (data.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-green font-semibold">🎉 All clear! Zero items pending human review.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.items.map((p) => `
      <tr>
        <td class="font-mono text-blue">${p.canonical_sku || p.raw_sku}</td>
        <td>
          <div class="text-muted text-xs">Brand: ${p.raw_brand || '<em class="text-yellow">NULL</em>'}</div>
          <div class="font-mono text-xs">${p.raw_description}</div>
        </td>
        <td>
          <strong>${p.product_title}</strong>
          <div class="text-green text-xs">Brand: ${p.resolved_brand} &bull; ${p.category}</div>
        </td>
        <td><span class="badge badge-yellow">${Math.round(p.confidence_score * 100)}% Conf</span></td>
        <td class="text-right">
          <button class="btn btn-green btn-sm" onclick="reviewAction('${p.id}', 'ACCEPT')">Accept</button>
          <button class="btn btn-secondary btn-sm" onclick="openEditModal('${p.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="reviewAction('${p.id}', 'REJECT')">Reject</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

async function reviewAction(productId, action) {
  try {
    await fetch(`${API_BASE}/review/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, action })
    });
    showToast(`Product ${action.toLowerCase()}ed.`);
    loadReviewQueue();
    loadBatches();
  } catch (err) {
    alert("Action failed: " + err.message);
  }
}

async function bulkApproveReviews() {
  if (state.reviewProducts.length === 0) return;
  const ids = state.reviewProducts.map((p) => p.id);
  try {
    await fetch(`${API_BASE}/review/bulk-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_ids: ids, action: "ACCEPT_ALL" })
    });
    showToast(`Bulk approved ${ids.length} products with 100% verification.`);
    loadReviewQueue();
    loadBatches();
  } catch (err) {
    alert("Bulk approve failed: " + err.message);
  }
}

// Inline Edit Modal
function openEditModal(productId) {
  const prod = state.reviewProducts.find((p) => p.id === productId) || state.catalogProducts.find((p) => p.id === productId);
  if (!prod) return;

  document.getElementById("editProductId").value = prod.id;
  document.getElementById("editTitle").value = prod.product_title || "";
  document.getElementById("editBrand").value = prod.resolved_brand || "";
  document.getElementById("editUNSPSC").value = prod.unspsc_code || "";
  document.getElementById("editCategory").value = prod.category || "";
  document.getElementById("editSubcategory").value = prod.subcategory || "";
  document.getElementById("editMaterial").value = prod.extracted_attributes?.Material || "";
  document.getElementById("editPressure").value = prod.extracted_attributes?.["Pressure Rating"] || "";

  document.getElementById("editModalOverlay").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModalOverlay").style.display = "none";
}

async function handleSaveEditProduct(e) {
  e.preventDefault();
  const id = document.getElementById("editProductId").value;
  const edits = {
    product_title: document.getElementById("editTitle").value,
    resolved_brand: document.getElementById("editBrand").value,
    unspsc_code: document.getElementById("editUNSPSC").value,
    category: document.getElementById("editCategory").value,
    subcategory: document.getElementById("editSubcategory").value,
    attr_Material: document.getElementById("editMaterial").value,
    attr_Pressure: document.getElementById("editPressure").value
  };

  try {
    await fetch(`${API_BASE}/review/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: id, action: "EDIT", edits })
    });
    closeEditModal();
    showToast("Edits saved and record verified with 100% confidence.");
    loadReviewQueue();
    loadBatches();
  } catch (err) {
    alert("Save failed: " + err.message);
  }
}

// Duplicate Merge Studio
async function loadDuplicateClusters() {
  if (!state.activeBatchId) return;
  const slider = document.getElementById("dupThresholdSlider");
  const threshold = slider ? slider.value : 0.75;
  document.getElementById("dupThresholdLabel").textContent = `${Math.round(threshold * 100)}%`;

  const container = document.getElementById("duplicateClustersContainer");
  container.innerHTML = `<div class="card text-center py-6 text-muted">Scanning catalog for semantic duplicates...</div>`;

  try {
    const res = await fetch(`${API_BASE}/duplicates/${state.activeBatchId}?threshold=${threshold}`);
    if (!res.ok) return;
    const data = await res.json();

    if (data.clusters.length === 0) {
      container.innerHTML = `<div class="card text-center py-8 text-green font-semibold">✅ No duplicate conflicts detected above ${Math.round(threshold*100)}% threshold.</div>`;
      return;
    }

    container.innerHTML = data.clusters.map((c) => `
      <div class="card">
        <div class="flex-between mb-3 border-b border-subtle pb-2">
          <div>
            <strong>Cluster ${c.cluster_id}</strong>
            <span class="badge badge-blue ml-2">Similarity: ${Math.round(c.highest_similarity * 100)}%</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="mergeDuplicates('${c.canonical_candidate.id}', ['${c.duplicate_items.map(d=>d.id).join("','")}'])">Merge into Master</button>
        </div>
        <div class="grid-2col text-xs">
          <div class="p-3 bg-canvas rounded">
            <span class="text-green font-bold block mb-1">Primary Canonical Master</span>
            <div>${c.canonical_candidate.product_title}</div>
            <div class="text-muted font-mono">${c.canonical_candidate.canonical_sku}</div>
          </div>
          <div class="p-3 bg-canvas rounded">
            <span class="text-yellow font-bold block mb-1">Duplicate Items (${c.duplicate_items.length})</span>
            ${c.duplicate_items.map((d) => `<div>${d.product_title || d.raw_description} (${d.canonical_sku || d.raw_sku})</div>`).join("")}
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

async function mergeDuplicates(primaryId, dupIds) {
  try {
    await fetch(`${API_BASE}/duplicates/merge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: state.activeBatchId, primary_product_id: primaryId, duplicate_product_ids: dupIds })
    });
    showToast("Consolidated duplicate records into canonical master.");
    loadDuplicateClusters();
  } catch (err) {
    alert("Merge error: " + err.message);
  }
}

// Datasheet OCR
async function handleDatasheetUpload(file) {
  const container = document.getElementById("datasheetResultBody");
  container.innerHTML = `<div class="text-center py-6 text-muted">Vision AI parsing engineering document...</div>`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/datasheet/parse`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Datasheet parse failed");
    const parsed = await res.json();
    renderDatasheetResult(parsed.data);
  } catch (err) {
    container.innerHTML = `<div class="text-red p-3">Parse failed: ${err.message}</div>`;
  }
}

function loadSampleDatasheet() {
  const demoContent = "MODEL: HYD-SS-3000\nMANUFACTURER: Parker Hannifin\nSIZE: 1/2 IN\nMATERIAL: Stainless Steel 316\nMAX PRESSURE: 3000 PSI\nTEMP: -40F to 450F\nSTANDARDS: ANSI B16.5, ASME Section VIII";
  const dummyFile = new File([demoContent], "Parker_Hydraulic_Fitting_Datasheet.pdf", { type: "application/pdf" });
  handleDatasheetUpload(dummyFile);
}

function renderDatasheetResult(data) {
  const container = document.getElementById("datasheetResultBody");
  container.innerHTML = `
    <div class="space-y-3 text-xs">
      <div class="grid-2col">
        <div><span class="text-muted block">Detected SKU:</span> <strong class="font-mono text-blue">${data.detected_sku}</strong></div>
        <div><span class="text-muted block">Detected Brand:</span> <strong class="text-green">${data.detected_brand}</strong></div>
      </div>
      <div><span class="text-muted block">Taxonomy:</span> ${data.category} &rarr; ${data.subcategory} (UNSPSC: ${data.unspsc})</div>
      <div><span class="text-muted block">Technical Specs Extracted:</span> <p class="font-mono text-lime bg-canvas p-2 rounded">${JSON.stringify(data.technical_specs, null, 2)}</p></div>
      <div><span class="text-muted block">Compliance:</span> <span class="badge badge-lime">${data.compliance}</span></div>
      <button class="btn btn-purple w-full mt-2" onclick="importDatasheetToCatalog(${JSON.stringify(data).replace(/"/g, '&quot;')})">Import to Catalog Feed</button>
    </div>
  `;
}

async function importDatasheetToCatalog(spec) {
  if (!state.activeBatchId) return;
  try {
    await fetch(`${API_BASE}/datasheet/import-to-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: state.activeBatchId, parsed_spec: spec })
    });
    showToast(`Imported SKU '${spec.detected_sku}' into catalog.`);
    loadBatches();
  } catch (err) {
    alert("Import failed: " + err.message);
  }
}

// Rule Studio Scratchpad
async function testScratchpad(text) {
  if (!text.trim()) return;
  try {
    const res = await fetch(`${API_BASE}/rules/test-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: text })
    });
    if (!res.ok) return;
    const data = await res.json();

    document.getElementById("scratchStep1").textContent = data.cleaned_text;
    document.getElementById("scratchStep2").textContent = `${data.expanded_text} (+${data.expansions_triggered} expansions)`;
    document.getElementById("scratchStep3").textContent = `Resolved Brand: ${data.resolved_brand} (${data.resolved_manufacturer}) - ${Math.round(data.brand_confidence * 100)}% Conf`;
  } catch (err) {
    console.error(err);
  }
}

// Copilot Drawer
function openCopilot() {
  document.getElementById("copilotOverlay").classList.add("open");
}

function closeCopilot() {
  document.getElementById("copilotOverlay").classList.remove("open");
}

document.getElementById("openCopilotBtn")?.addEventListener("click", openCopilot);

function setCopilotPrompt(p) {
  document.getElementById("copilotInput").value = p;
  handleCopilotSubmit(new Event("submit"));
}

async function handleCopilotSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("copilotInput");
  const prompt = input.value.trim();
  if (!prompt || !state.activeBatchId) return;

  const chatBody = document.getElementById("copilotChatBody");
  chatBody.innerHTML += `<div class="card bg-card p-2 text-xs text-white mb-2"><strong>You:</strong> ${prompt}</div>`;
  input.value = "";

  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: state.activeBatchId, prompt })
    });
    if (!res.ok) throw new Error("Query failed");
    const result = await res.json();

    chatBody.innerHTML += `
      <div class="card bg-canvas border-purple p-3 text-xs mb-3">
        <div class="text-purple font-bold mb-1">🤖 Copilot (${result.intent}):</div>
        <p class="text-white mb-2">${result.summary}</p>
        ${result.affected_count ? `<button class="btn btn-purple btn-sm w-full" onclick="applyCopilotBulk('${result.target_attribute}', '${result.proposed_value}', ['${result.product_ids.join("','")}'])">Apply Bulk Edit</button>` : ''}
      </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;
  } catch (err) {
    chatBody.innerHTML += `<div class="text-red text-xs">Error: ${err.message}</div>`;
  }
}

async function applyCopilotBulk(attr, val, ids) {
  try {
    await fetch(`${API_BASE}/copilot/apply-bulk-edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_ids: ids, attribute_name: attr, new_value: val })
    });
    showToast(`Updated '${attr}' across ${ids.length} products.`);
    loadBatches();
    closeCopilot();
  } catch (err) {
    alert("Bulk edit failed: " + err.message);
  }
}

// Multi-Channel Export
function selectExportChannel(channel, el) {
  state.selectedExportChannel = channel;
  document.querySelectorAll(".channel-card").forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
}

function downloadExport(format) {
  if (!state.activeBatchId) return alert("Select a batch first");
  const url = `${API_BASE}/export/${state.activeBatchId}?format=${format}&template=${state.selectedExportChannel}`;
  window.open(url, "_blank");
}

// Keyboard shortcuts for Review
function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (state.reviewProducts.length === 0) return;

    const firstId = state.reviewProducts[0].id;
    if (e.key === "a" || e.key === "A") {
      reviewAction(firstId, "ACCEPT");
    } else if (e.key === "r" || e.key === "R") {
      reviewAction(firstId, "REJECT");
    } else if (e.key === "e" || e.key === "E") {
      openEditModal(firstId);
    }
  });
}
