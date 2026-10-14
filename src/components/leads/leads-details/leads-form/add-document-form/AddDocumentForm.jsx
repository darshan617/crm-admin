import React, { useState } from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const AddDocumentForm = ({
  leadId = 70,
  csrfToken,
  formData,
  handleFormChange,
  onFilesChange,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const documentForm = formData?.document_detail || {
    document_type: "PAN Card",
    files: [],
  };
  const files = documentForm.files || [];

  const handleFiles = (fileList) => {
    const picked = Array.from(fileList);
    const tooBig = picked.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 10 MB`);
      return;
    }
    setError("");
    onFilesChange(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      setError("Please choose a file");
      return;
    }
    setLoading(true);
    const formElement = e.currentTarget;
    try {
      const body = new FormData(formElement);
      body.delete("documents[]");
      files.forEach((file) => body.append("documents[]", file));
      const res = await fetch(
        `https://superadmin.tizzygroup.com/crm/leads/${leadId}/documents`,
        {
          method: "POST",
          body,
          credentials: "include",
          headers: { "X-CSRF-TOKEN": csrfToken, Accept: "application/json" },
          // do NOT set Content-Type; the browser adds the multipart boundary
        }
      );
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      onFilesChange([]);
      formElement.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.creditModalBox}>
      <h2 className={styles.contactModalTitle}>Add Document</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="_token" value={csrfToken} />

        <div className={styles.leadDocCard}>
          <p className={`${styles.formHint} ${styles.docHelp}`}>
            PDF, JPG, PNG, DOC or DOCX. Max 10 MB each.
          </p>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label htmlFor="document_type">Document Type</label>
            <select
              id="document_type"
              name="document_type"
              value={documentForm.document_type}
              onChange={(event) =>
                handleFormChange(event, "document_detail")
              }
            >
              <option value="PAN Card">PAN Card</option>
              <option value="GST Certificate">GST Certificate</option>
              <option value="Address Proof">Address Proof</option>
              <option value="Company Registration">Company Registration</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <label
            className={styles.uploadBox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              name="documents[]"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className={styles.uploadIcon}></div>
            <p>Click to upload or drag files here</p>
            <span className={styles.uploadFormats}>PDF · JPG · PNG · DOC · DOCX</span>
          </label>

          {files.length > 0 && (
            <ul className="doc-file-list">
              {files.map((f) => (
                <li key={f.name}>{f.name} ({(f.size / 1024).toFixed(0)} KB)</li>
              ))}
            </ul>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDocumentForm;