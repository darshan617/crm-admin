import React, { useRef, useState } from "react";
import Link from "next/link";
import styles from "@/components/dashboard/upload-leads/UploadLeads.module.css";
import { LuCloudUpload, LuFileDown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useUploadLeadsMutation } from "@/redux/apis/leadsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { BsDownload } from "react-icons/bs";

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "match", label: "Match" },
  { id: "import", label: "Import" },
];

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

const isAcceptedFile = (selectedFile) => {
  const name = selectedFile?.name?.toLowerCase() || "";
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
};

const UploaadLeads = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLeads, { isLoading }] = useUploadLeadsMutation();
  const { showToast } = useToast();

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

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      showToast("Please select a leads file to upload.", "warning");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await uploadLeads({ body }).unwrap();
      if (response?.success === false) {
        showToast(
          response.message || "Could not upload the leads file.",
          "error",
        );
        return;
      }
      showToast(response?.message || "Leads uploaded successfully.", "success");
      setFile(null);
    } catch (error) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "Could not upload the leads file.",
        "error",
      );
    }
  };

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>
      <section className={styles.uploadLeadPage}>
        <div className={styles.stepper} aria-label="Lead import progress">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${index === 0 ? styles.stepActive : ""}`}
              aria-current={index === 0 ? "step" : undefined}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <form className={styles.uploadLeadCard} onSubmit={handleUpload}>
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
            <div className={styles.uploadLeadText}>Click or drag file here</div>
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
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Next"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UploaadLeads;
