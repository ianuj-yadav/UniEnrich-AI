"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertOctagon, 
  Copy, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  FileCheck,
  Wrench,
  Zap,
  Hammer
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { uploadCatalogFile, startEnrichment, UploadResult } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStartingEnrichment, setIsStartingEnrichment] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const result = await uploadCatalogFile(file);
      setUploadResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadDomainSample = async (domain: "mro" | "electrical" | "tools") => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      let csvContent = "";
      let filename = "";

      if (domain === "mro") {
        filename = "mro_piping_catalog.csv";
        csvContent = `SKU,Brand,Raw_Description,Category,Price
SKU-1001,3 M,"3/4 CPLG BRS 150# <p>Pipe fitting</p>",,14.50
SKU-1002,-- Unbranded --,"1/2 IN BALL VALV BRS FNPT 600 WOG",,22.80
SKU-1005,3M INC,"2 IN FLG SS 316 150 LB ANSI B16.5",,89.20
SKU-1008,Parker Hannifin,"1/4 IN OD TUBE X 1/4 IN NPT MALE COMPRESSION ELBOW BRASS",,8.75
SKU-1010,N/A,"SCH 40 PVC TEE 1-1/2 IN SLIP X SLIP X SLIP",,3.25`;
      } else if (domain === "electrical") {
        filename = "electrical_components_feed.csv";
        csvContent = `SKU,Brand,Raw_Description,Category,Price
SKU-2001,Square D,"20A 1-POLE CIRCUIT BREAKER 120V QO120",,11.50
SKU-2002,Square D,"100A 2-POLE MAIN BREAKER 120/240V QOM2100",,85.00
SKU-2003,Klein,"1000V INSULATED HIGH-LEVERAGE SIDE-CUTTING PLIERS 9-INCH",Hand Tools,45.00
SKU-2004,-- Unbranded --,"12/2 WG NM-B WIRE 250 FT COPPER 600V",,78.50
SKU-2005,Leviton,"15A 125V DUPLEX RECEPTACLE TAMPER RESISTANT WHITE",,2.45`;
      } else {
        filename = "industrial_tools_machinery.csv";
        csvContent = `SKU,Brand,Raw_Description,Category,Price
SKU-3001,DEWALT,"20V MAX CORDLESS DRILL 1/2 IN CHUCK BL MOTOR",Power Tools,129.00
SKU-3002,De Walt,"ATOMIC 20V MAX COMPACT 1/4 IN IMPACT DRIVER",Power Tools,119.00
SKU-3003,Milwaukee Electric,"M18 FUEL 1/2 IN IMPACT WRENCH 1400 FT-LBS",,249.00
SKU-3004,Milwaukee,"M12 CORDLESS 3/8 IN RATCHET BARE TOOL 2457-20",,139.00
SKU-3005,Bosch,"18V 1-INCH SDS-PLUS ROTARY HAMMER BULLDOG",Power Tools,219.00`;
      }

      const sampleFile = new File([csvContent], filename, { type: "text/csv" });
      setFile(sampleFile);
      const result = await uploadCatalogFile(sampleFile);
      setUploadResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load dataset");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartPipeline = async () => {
    if (!uploadResult) return;
    setIsStartingEnrichment(true);
    try {
      await startEnrichment(uploadResult.batch_id);
      router.push(`/process?batch_id=${uploadResult.batch_id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate AI enrichment");
      setIsStartingEnrichment(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="blue">Stage 1</Badge>
          <span className="text-xs font-semibold text-grey-300 uppercase tracking-wider">File Ingestion & Validation</span>
        </div>
        <h1 className="text-2xl font-bold text-white-50">CSV / XLSX Ingestion Studio</h1>
        <p className="text-sm text-grey-200">
          Upload raw, unstandardized supplier catalog files. The pre-flight validator checks encoding, headers, syntax errors, and duplicate SKUs.
        </p>
      </div>

      {/* Preset Domain Sample Cards */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-grey-400 uppercase tracking-wider">1-Click Demo Datasets</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLoadDomainSample("mro")}
            disabled={isUploading}
            className="p-3.5 rounded-xl bg-black-900 border border-black-800 hover:border-blue-500/60 hover:bg-black-800 transition text-left space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-white text-xs">
                <Wrench className="w-3.5 h-3.5 text-blue-400" /> MRO Piping &amp; Fittings
              </div>
              <Badge variant="blue" size="sm">5 SKUs</Badge>
            </div>
            <p className="text-[11px] text-grey-400">Couplings, ball valves, and flanges with CPLG, BRS, 150#.</p>
          </button>

          <button
            onClick={() => handleLoadDomainSample("electrical")}
            disabled={isUploading}
            className="p-3.5 rounded-xl bg-black-900 border border-black-800 hover:border-yellow-500/60 hover:bg-black-800 transition text-left space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-white text-xs">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Electrical &amp; Power
              </div>
              <Badge variant="warning" size="sm">5 SKUs</Badge>
            </div>
            <p className="text-[11px] text-grey-400">Breakers, insulated pliers, and wire with Square D &amp; Leviton.</p>
          </button>

          <button
            onClick={() => handleLoadDomainSample("tools")}
            disabled={isUploading}
            className="p-3.5 rounded-xl bg-black-900 border border-black-800 hover:border-purple-500/60 hover:bg-black-800 transition text-left space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-white text-xs">
                <Hammer className="w-3.5 h-3.5 text-purple-400" /> Tools &amp; Machinery
              </div>
              <Badge variant="purple" size="sm">5 SKUs</Badge>
            </div>
            <p className="text-[11px] text-grey-400">Cordless drills, impact drivers with DeWalt, Milwaukee, Bosch.</p>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <Card>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-black-600 hover:border-blue-500/80 bg-black-900/60 rounded-xl p-8 md:p-12 text-center transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer"
          onClick={() => document.getElementById("catalog-file-input")?.click()}
        >
          <div className="w-14 h-14 bg-black-800 rounded-full flex items-center justify-center border border-black-600 text-blue-400">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-white-100">
              {file ? file.name : "Drag and drop your catalog file here"}
            </p>
            <p className="text-xs text-grey-300">
              Supports <strong className="text-grey-200">.CSV, .XLSX, .XLS, .TSV</strong> up to 50MB (approx. 100,000 SKUs)
            </p>
          </div>

          <input
            id="catalog-file-input"
            type="file"
            accept=".csv,.xlsx,.xls,.tsv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="primary"
              size="md"
              icon={<UploadCloud className="w-4 h-4" />}
              onClick={handleUpload}
              disabled={!file || isUploading}
              isLoading={isUploading}
            >
              Upload & Validate
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-800/30 border border-red-700 rounded-md text-xs text-red-500 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </Card>

      {/* Validation Scorecard */}
      {uploadResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white-50 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Pre-Flight Validation Scorecard
            </h2>
            <Badge variant="success">Validation Passed</Badge>
          </div>

          {/* 4 Core Scorecard Metrics Required by Spec */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-black-800 border border-black-600 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-grey-300">Products Uploaded</span>
              <div className="text-2xl font-bold text-white-50">{uploadResult.total_rows}</div>
              <p className="text-[11px] text-grey-400">Total data rows detected</p>
            </div>

            <div className="p-4 bg-black-800 border border-black-600 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-grey-300">Rows with Errors</span>
              <div className="text-2xl font-bold text-red-500">{uploadResult.error_rows}</div>
              <p className="text-[11px] text-red-600">Missing description or invalid</p>
            </div>

            <div className="p-4 bg-black-800 border border-black-600 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-grey-300">Duplicate Rows</span>
              <div className="text-2xl font-bold text-orange-400">{uploadResult.duplicate_rows}</div>
              <p className="text-[11px] text-orange-500">Duplicate SKU keys</p>
            </div>

            <div className="p-4 bg-black-800 border border-black-600 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-grey-300">Missing Brand</span>
              <div className="text-2xl font-bold text-yellow-400">{uploadResult.missing_brand_rows}</div>
              <p className="text-[11px] text-yellow-500/80">Will resolve via AI & regex</p>
            </div>
          </div>

          {/* Detected Columns */}
          <Card title="Detected Column Schema" subtitle="Header names mapped to enrichment schema">
            <div className="flex flex-wrap gap-2">
              {uploadResult.columns_detected.map((col, i) => (
                <Badge key={i} variant="grey" size="md">
                  {col}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Raw Preview Table */}
          <Card title="Raw Ingestion Preview (First 5 Rows)" subtitle="Uncleaned supplier feed input">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black-900 border-b border-black-600 text-grey-300 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Raw SKU</th>
                    <th className="py-2.5 px-3">Raw Brand</th>
                    <th className="py-2.5 px-3">Raw Description</th>
                    <th className="py-2.5 px-3">Raw Category</th>
                    <th className="py-2.5 px-3">Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black-600">
                  {uploadResult.preview_records.map((rec) => (
                    <tr key={rec.row_index} className="hover:bg-black-700/50">
                      <td className="py-2.5 px-3 text-grey-400">{rec.row_index}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-400">{rec.sku}</td>
                      <td className="py-2.5 px-3">
                        {rec.brand ? (
                          <span className="text-white-100">{rec.brand}</span>
                        ) : (
                          <span className="text-yellow-400 italic">Empty</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-grey-200 max-w-md truncate font-mono">
                        {rec.description}
                      </td>
                      <td className="py-2.5 px-3 text-grey-300">{rec.category || "—"}</td>
                      <td className="py-2.5 px-3">
                        {rec.has_error ? (
                          <Badge variant="danger" size="sm">Error</Badge>
                        ) : (
                          <Badge variant="success" size="sm">Ready</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Action Trigger Card */}
          <div className="p-6 bg-purple-800/20 border border-purple-600/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white-50">Ready to Enrich Catalog Data</h3>
              <p className="text-xs text-grey-200">
                Trigger the 7-step pipeline: Cleaner &rarr; RapidFuzz Brand Resolver &rarr; Gemini 2.5 Flash Attributes &rarr; Classifier &rarr; Descriptions &rarr; Confidence Gate.
              </p>
            </div>
            <Button
              variant="purple"
              size="lg"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleStartPipeline}
              isLoading={isStartingEnrichment}
              className="shrink-0"
            >
              Start AI Enrichment Pipeline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
