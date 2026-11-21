import { useRef, useState } from "react";
import { FiExternalLink, FiFileText } from "react-icons/fi";
import { LuCloudUpload } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

import styles from "@/components/manage/crm-setting/crmSetting.module.css";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import {
  useCompanyProfileQuery,
  useUploadCompanyProfileMutation,
} from "@/redux/apis/crmSettingsApi";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const getPdfUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (/^(https?:|blob:|data:)/.test(url)) return url;

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  return base ? `${base}/${url.replace(/^\/+/, "")}` : url;
};

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return null;
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export default function CompanyProfilePdf({ canEdit }) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useCompanyProfileQuery();
  const [uploadCompanyProfile, { isLoading: isSaving }] =
    useUploadCompanyProfileMutation();

  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const profile = data?.data || data || {};
  const existingUrl = getPdfUrl(
    profile.pdf_url || profile.file_url || profile.url || profile.path,
  );
  const existingName =
    profile.file_name ||
    profile.name ||
    profile.original_name ||
    (existingUrl ? "Company profile.pdf" : null);
  const existingSize = formatBytes(profile.file_size || profile.size);

  const validateAndSetFile = (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      showToast("Please select a PDF file.", "error");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      showToast("PDF must be 10MB or smaller.", "error");
      return;
    }

    setPdfFile(file);
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (!canEdit) return;
    validateAndSetFile(event.dataTransfer.files?.[0] || null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!canEdit) return;

    if (!pdfFile) {
      showToast("Please choose a PDF to upload.", "error");
      return;
    }

    const body = new FormData();
    body.append("company_profile", pdfFile);

    try {
      await uploadCompanyProfile({ body }).unwrap();
      showToast("Company profile PDF saved successfully", "success");
      setPdfFile(null);
    } catch (error) {
      showToast(
        error?.data?.message || "Unable to save company profile PDF",
        "error",
      );
    }
  };

  const showBusy = isLoading || isFetching;

  return (
    <form className={styles.profileCard} onSubmit={handleSave}>
      <p className={styles.profileHint}>
        Upload / replace the Company Profile PDF attached on quotation and
        invoice emails.
      </p>

      {showBusy ? (
        <div className={styles.profileEmpty}>Loading company profile PDF...</div>
      ) : isError ? (
        <div className={styles.profileEmpty}>
          <p>Unable to fetch company profile PDF.</p>
          <button type="button" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      ) : existingUrl ? (
        <div className={styles.profileCurrent}>
          <div className={styles.profileCurrentIcon}>
            <FiFileText size={22} />
          </div>
          <div className={styles.profileCurrentMeta}>
            <strong>{existingName}</strong>
            <span>
              {existingSize ? `${existingSize} · ` : ""}
              Currently attached to emails
            </span>
          </div>
          <a
            href={existingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileViewBtn}
          >
            <FiExternalLink size={14} />
            View
          </a>
        </div>
      ) : (
        <div className={styles.profileEmpty}>
          No company profile PDF uploaded yet.
        </div>
      )}

      {canEdit && (
        <>
          <button
            type="button"
            className={`${styles.profileDropzone} ${
              isDragging ? styles.profileDropzoneActive : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Select a company profile PDF"
          >
            <div className={styles.profileDropIcon}>
              <LuCloudUpload size={28} />
            </div>
            <div className={styles.profileDropText}>
              Click or drag PDF here
            </div>
            <div className={styles.profileDropFormat}>PDF only, max 10MB</div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={handleFileChange}
          />

          {pdfFile && (
            <div className={styles.profileSelected}>
              <div className={styles.profileSelectedTitle}>Selected file</div>
              <div className={styles.profileSelectedRow}>
                <span>{pdfFile.name}</span>
                <button
                  type="button"
                  className={styles.profileRemoveBtn}
                  aria-label="Remove selected PDF"
                  onClick={() => setPdfFile(null)}
                >
                  <RxCross2 />
                </button>
              </div>
            </div>
          )}

          <div className={styles.profileActions}>
            <button
              type="submit"
              className={styles.profileSaveBtn}
              disabled={isSaving || !pdfFile}
            >
              {isSaving ? "Saving..." : "Save company profile PDF"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
