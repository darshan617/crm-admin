import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/components/dashboard/upload-leads/UploadLeads.module.css";
import { LuCloudUpload } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import {
  useConfirmLeadsUploadMutation,
  usePreviewLeadsUploadMutation,
} from "@/redux/apis/leadsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { BsDownload } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "match", label: "Match" },
  { id: "import", label: "Import" },
];

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

const REQUIRED_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
];

const OPTIONAL_FIELDS = [
  { key: "salutation", label: "Salutation" },
  { key: "mobile_code", label: "Mobile Code" },
  { key: "company_name", label: "Company Name" },
  { key: "designation", label: "Designation" },
  { key: "industry", label: "Industry" },
  { key: "no_of_employees", label: "No of Employees" },
  { key: "gstin", label: "GSTIN" },
  { key: "mailing_address", label: "Mailing Address" },
  { key: "country", label: "Country" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "pincode", label: "Pincode" },
  { key: "provider", label: "Provider" },
  { key: "sku", label: "SKU" },
  { key: "quote_period", label: "Quote Period" },
  { key: "quantity", label: "Quantity" },
  { key: "rate", label: "Rate" },
  { key: "contact_name", label: "Contact Name" },
  { key: "contact_designation", label: "Contact Designation" },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_mobile", label: "Contact Mobile" },
  { key: "follow_up_date", label: "Follow Up Date" },
  { key: "follow_up_note", label: "Follow Up Note" },
  { key: "lead_priority", label: "Lead Priority" },
  { key: "lead_status", label: "Lead Status" },
  { key: "lead_source", label: "Lead Source" },
  { key: "lead_bifurcation", label: "Lead Bifurcation" },
  { key: "assigned_to", label: "Assigned To" },
];

const ALL_FIELD_KEYS = [
  ...REQUIRED_FIELDS.map((field) => field.key),
  ...OPTIONAL_FIELDS.map((field) => field.key),
];

const isAcceptedFile = (selectedFile) => {
  const name = selectedFile?.name?.toLowerCase() || "";
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
};

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-]+/g, "_")
    .replace(/[^\w.]/g, "");

const pickFirstArray = (...candidates) => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length) return candidate;
  }
  return [];
};

const asObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const nestedPreview = (data) => asObject(data.preview);

const extractRawPreviewRows = (data) => {
  const previewObj = nestedPreview(data);

  return pickFirstArray(
    data.preview_rows,
    data.sample_rows,
    data.data_preview,
    data.sample_data,
    data.preview_data,
    data.records,
    data.examples,
    Array.isArray(data.data) ? data.data : null,
    Array.isArray(data.preview) ? data.preview : null,
    previewObj.rows,
    previewObj.preview_rows,
    previewObj.data,
    previewObj.records,
    data.rows,
  );
};

const extractColumns = (data) => {
  const previewObj = nestedPreview(data);
  const raw = pickFirstArray(
    data.columns,
    data.headers,
    data.file_columns,
    data.file_headers,
    data.column_headers,
    previewObj.columns,
    previewObj.headers,
  );

  if (raw.length) {
    return raw
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.name || item?.key || item?.header || item?.label || "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  const previewRows = extractRawPreviewRows(data);
  const firstRow = previewRows[0];

  if (Array.isArray(firstRow)) {
    return firstRow.map((_, index) => `column_${index + 1}`);
  }

  if (firstRow && typeof firstRow === "object") {
    const values = firstRow.values || firstRow.cells || firstRow.data;
    if (Array.isArray(values)) {
      return values.map((_, index) => `column_${index + 1}`);
    }
    return Object.keys(firstRow);
  }

  return [];
};

const cellLookup = (row, column) => {
  if (!row || typeof row !== "object" || Array.isArray(row)) return undefined;
  if (Object.prototype.hasOwnProperty.call(row, column)) return row[column];

  const normalizedColumn = normalizeHeader(column);
  const matchedKey = Object.keys(row).find(
    (key) => normalizeHeader(key) === normalizedColumn,
  );
  return matchedKey ? row[matchedKey] : undefined;
};

const rowToObject = (row, columns) => {
  if (row == null) return null;

  if (Array.isArray(row)) {
    return columns.reduce((acc, column, index) => {
      acc[column] = row[index] ?? "";
      return acc;
    }, {});
  }

  if (typeof row !== "object") return null;

  const nestedValues = row.values || row.cells || row.data;
  if (Array.isArray(nestedValues)) {
    return rowToObject(nestedValues, columns);
  }

  return columns.reduce((acc, column) => {
    const value = cellLookup(row, column);
    acc[column] = value == null ? "" : value;
    return acc;
  }, {});
};

const extractPreviewRows = (data, columns) =>
  extractRawPreviewRows(data)
    .map((row) => rowToObject(row, columns))
    .filter(Boolean);

const mappingFromArray = (items = []) => {
  if (!Array.isArray(items)) return {};

  return items.reduce((acc, item) => {
    if (!item || typeof item !== "object") return acc;
    const field =
      item.crm_field ||
      item.field ||
      item.key ||
      item.target ||
      item.name ||
      "";
    const column =
      item.file_column ||
      item.column ||
      item.header ||
      item.source ||
      item.value ||
      "";
    if (field) acc[field] = column || "";
    return acc;
  }, {});
};

const extractSuggestedMapping = (data, columns) => {
  const suggestedSource =
    data.suggested_mapping ||
    data.mapping ||
    data.default_mapping ||
    data.auto_mapping ||
    data.matched_columns ||
    data.column_mapping;

  const suggested = Array.isArray(suggestedSource)
    ? mappingFromArray(suggestedSource)
    : asObject(suggestedSource);

  const columnSet = new Set(columns);
  const mapping = {};

  ALL_FIELD_KEYS.forEach((key) => {
    const value = suggested[key];
    if (typeof value === "string" && columnSet.has(value)) {
      mapping[key] = value;
      return;
    }
    mapping[key] = "";
  });

  const columnByNormalized = columns.reduce((acc, column) => {
    acc[normalizeHeader(column)] = column;
    return acc;
  }, {});

  ALL_FIELD_KEYS.forEach((key) => {
    if (mapping[key]) return;
    const match =
      columnByNormalized[normalizeHeader(key)] ||
      columnByNormalized[key.replace(/_/g, "")];
    if (match) mapping[key] = match;
  });

  return mapping;
};

const normalizePreviewResponse = (payload, fallbackFileName = "") => {
  const root = asObject(payload?.data ?? payload);
  const data = asObject(
    root.file || root.upload || root.preview_payload || root,
  );
  const columns = extractColumns(data);
  const previewRows = extractPreviewRows(data, columns);
  const mapping = extractSuggestedMapping(data, columns);

  const rowCount =
    data.total_rows ??
    data.row_count ??
    data.rows_count ??
    root.total_rows ??
    root.row_count ??
    data.total ??
    previewRows.length ??
    0;

  return {
    importToken:
      data.import_token ||
      root.import_token ||
      data.token ||
      root.token ||
      data.upload_token ||
      data.preview_token ||
      "",
    fileName:
      data.file_name ||
      data.filename ||
      root.file_name ||
      root.filename ||
      fallbackFileName ||
      "file",
    rowCount: Number(rowCount) || 0,
    columns,
    previewRows,
    mapping,
    raw: data,
  };
};

const buildConfirmMapping = (mapping) =>
  ALL_FIELD_KEYS.reduce((acc, key) => {
    const value = mapping?.[key];
    acc[key] = value ? value : null;
    return acc;
  }, {});

const UploaadLeads = () => {
  const fileInputRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [mapping, setMapping] = useState({});
  const [importResult, setImportResult] = useState(null);

  const [previewLeadsUpload, { isLoading: isPreviewLoading }] =
    usePreviewLeadsUploadMutation();
  const [confirmLeadsUpload, { isLoading: isConfirmLoading }] =
    useConfirmLeadsUploadMutation();
  const { showToast } = useToast();

  const previewColumns = useMemo(() => {
    if (preview?.columns?.length) return preview.columns;
    const firstRow = preview?.previewRows?.[0];
    if (firstRow && typeof firstRow === "object" && !Array.isArray(firstRow)) {
      return Object.keys(firstRow);
    }
    return [];
  }, [preview]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!isAcceptedFile(selectedFile)) {
      showToast("Please choose a .csv, .xls, or .xlsx file.", "warning");
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const resetToUpload = () => {
    setStepIndex(0);
    setPreview(null);
    setMapping({});
    setImportResult(null);
  };

  const handleDifferentFile = () => {
    setFile(null);
    resetToUpload();
  };

  const handlePreview = async (event) => {
    event.preventDefault();

    if (!file) {
      showToast("Please select a leads file to upload.", "warning");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await previewLeadsUpload({ body }).unwrap();
      if (response?.success === false) {
        showToast(
          response.message || "Could not preview the leads file.",
          "error",
        );
        return;
      }

      const normalized = normalizePreviewResponse(response, file.name);
      if (!normalized.importToken) {
        showToast(
          "Preview succeeded but import token is missing. Please try again.",
          "error",
        );
        return;
      }

      setPreview(normalized);
      setMapping(normalized.mapping);
      setImportResult(null);
      setStepIndex(1);
    } catch (error) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "Could not preview the leads file.",
        "error",
      );
    }
  };

  const handleMappingChange = (fieldKey, column) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: column,
    }));
  };

  const handleConfirmImport = async () => {
    if (!preview?.importToken) {
      showToast("Import token missing. Please upload the file again.", "error");
      return;
    }

    const missingRequired = REQUIRED_FIELDS.filter(
      (field) => !mapping?.[field.key],
    );
    if (missingRequired.length) {
      showToast(
        `Please map required fields: ${missingRequired
          .map((field) => field.label)
          .join(", ")}.`,
        "warning",
      );
      return;
    }

    try {
      const response = await confirmLeadsUpload({
        body: {
          import_token: preview.importToken,
          mapping: buildConfirmMapping(mapping),
        },
      }).unwrap();

      if (response?.success === false) {
        showToast(response.message || "Could not import leads.", "error");
        return;
      }

      setImportResult(response);
      setStepIndex(2);
      showToast(response?.message || "Leads imported successfully.", "success");
    } catch (error) {
      showToast(
        error?.data?.message || error?.message || "Could not import leads.",
        "error",
      );
    }
  };

  const renderFieldSelect = (field, { required = false } = {}) => (
    <div className={`form-group ${styles.matchField}`} key={field.key}>
      <label>
        {field.label}
        {required ? <span> *</span> : null}
      </label>
      <select
        value={mapping?.[field.key] || ""}
        onChange={(event) => handleMappingChange(field.key, event.target.value)}
      >
        <option value="">{required ? "Select column" : "Skip"}</option>
        {previewColumns.map((column) => (
          <option key={`${field.key}-${column}`} value={column}>
            {column}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      className="content"
      style={{
        maxWidth: "900px",
        justifyContent: "space-between",
        margin: "auto",
      }}
    >
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link> <span>/</span>
              <Link href="/leads">Leads</Link> <span>/</span>
              <span>Upload</span>
            </p>
          </div>
          <h2>Upload Leads</h2>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Link
            href="/sample-lead-file/leads_sample.csv"
            download="leads_sample.csv"
            className={styles.downloadSampleBtn}
          >
            <BsDownload size={18} />
            <span>Sample CSV</span>
          </Link>
          <div className="back">
            <Link href="/leads" className="back-btn">
              <IoMdArrowBack />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.uploadLeadPage}>
        <div className={styles.stepper} aria-label="Lead import progress">
          {STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isDone = index < stepIndex;
            return (
              <div
                key={step.id}
                className={`${styles.step} ${isActive ? styles.stepActive : ""} ${isDone ? styles.stepDone : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className={styles.stepNumber}>{index + 1}</span>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        {stepIndex === 0 && (
          <form className={styles.uploadLeadCard} onSubmit={handlePreview}>
            <h3>Upload leads</h3>
            <p className={styles.uploadLeadHint}>
              Upload CSV/Excel, then match columns like Phone → Mobile
            </p>
            <button
              className={`${styles.uploadLeadBox} ${isDragging ? styles.uploadLeadBoxActive : ""}`}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              aria-label="Select a CSV, XLS, or XLSX leads file"
            >
              <div className={styles.uploadLeadIcon}>
                <LuCloudUpload size={28} />
              </div>
              <div className={styles.uploadLeadText}>
                Click or drag file here
              </div>
              <div className={styles.uploadLeadFormat}>.csv, .xls, .xlsx</div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              id="leadFile"
              className="lead-file-input"
              accept=".csv,.xls,.xlsx"
              hidden
              onChange={handleFileChange}
            />
            {file && (
              <div className={styles.uploadFileSection}>
                <div className={styles.uploadFileTitle}>Selected file</div>
                <div className={styles.uploadFileRow}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className={styles.uploadRemoveBtn}
                    aria-label="Remove"
                    onClick={() => setFile(null)}
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            )}

            <div className={styles.uploadSubmitWrap}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isPreviewLoading}
              >
                {isPreviewLoading ? "Loading..." : "Next"}
              </button>
            </div>
          </form>
        )}

        {stepIndex === 1 && preview && (
          <div className={`${styles.uploadLeadCard} ${styles.matchCard}`}>
            <h3>
              {preview.fileName} - {preview.rowCount} rows
            </h3>
            <p className={styles.uploadLeadHint}>
              Match your file columns to CRM Fields. Example: Phone → Mobile.
            </p>

            <div className={`form-grid form-grid-3 ${styles.requiredGrid}`}>
              {REQUIRED_FIELDS.map((field) =>
                renderFieldSelect(field, { required: true }),
              )}
            </div>

            <h4 className={styles.moreFieldsTitle}>More Fields (optional)</h4>
            <div className={`form-grid ${styles.optionalGrid}`}>
              {OPTIONAL_FIELDS.map((field) => renderFieldSelect(field))}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewTitle}>Preview rows</div>
              <div className={styles.previewTableWrap}>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      {previewColumns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.previewRows.length ? (
                      preview.previewRows.map((row, rowIndex) => (
                        <tr key={`preview-row-${rowIndex}`}>
                          {previewColumns.map((column) => {
                            const value = cellLookup(row, column);
                            return (
                              <td key={`${rowIndex}-${column}`}>
                                {value == null || value === ""
                                  ? "—"
                                  : String(value)}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={Math.max(previewColumns.length, 1)}>
                          No preview rows available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.matchActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleDifferentFile}
                disabled={isConfirmLoading}
              >
                Different file
              </button>
              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleConfirmImport}
                disabled={isConfirmLoading}
              >
                {isConfirmLoading ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className={styles.uploadLeadCard}>
            <h3>Import complete</h3>
            <p className={styles.uploadLeadHint}>
              {importResult?.message ||
                "Your leads file has been imported successfully."}
            </p>
            {importResult?.data && typeof importResult.data === "object" ? (
              <div className={styles.importSummary}>
                {["imported", "created", "updated", "skipped", "failed"].map(
                  (key) => {
                    const value = importResult.data?.[key];
                    if (value == null) return null;
                    return (
                      <div key={key} className={styles.importStat}>
                        <span>{key}</span>
                        <strong>{String(value)}</strong>
                      </div>
                    );
                  },
                )}
              </div>
            ) : null}
            <div className={styles.matchActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleDifferentFile}
              >
                Upload another
              </button>
              <Link href="/leads" className={styles.submitBtn}>
                Go to leads
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UploaadLeads;
