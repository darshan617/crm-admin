import React, { useRef, useState } from "react";
import Link from "next/link";
import styles from "@/components/dashboard/upload-leads/UploadLeads.module.css";
import { LuFileDown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useUploadLeadsMutation } from "@/redux/apis/leadsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const UploaadLeads = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadLeads, { isLoading }] = useUploadLeadsMutation();
  const { showToast } = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
    event.target.value = "";
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
    <div className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link> <span>/</span>
              <Link href="/leads">Leads</Link>
            </p>
          </div>
          <h2>Upload Lead</h2>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Link
            href="/sample-lead-file/leads_sample.csv"
            download="leads_sample.csv"
            className={styles.downloadSampleBtn}
          >
            <LuFileDown size={20} />
            <span>Download Sample File</span>
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
        <form className={styles.uploadLeadCard} onSubmit={handleUpload}>
          <h3>UPLOAD CUSTOMER LEADS</h3>
          <button
            className={styles.uploadLeadBox}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Select a CSV, XLS, or XLSX leads file"
          >
            <div className={styles.uploadLeadIcon}>
              <LuFileDown size={30} />
            </div>
            <div className={styles.uploadLeadText}>Click to Upload</div>
            <div className={styles.uploadLeadFormat}>(.csv, .xls or .xlsx)</div>
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
              {isLoading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UploaadLeads;
