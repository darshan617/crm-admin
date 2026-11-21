import React, { useRef, useState } from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";
import { LuFileDown } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
];

const fileTypeError = (fileName) =>
  `${fileName} must be a file of type: pdf, doc, docx, jpg, jpeg, png.`;

const AddDocumentForm = ({
  csrfToken,
  formData,
  handleUpdate,
  handleDocumentSelect,
  handleDocumentRemove,
}) => {
  const documentInputRef = useRef(null);
  const [uploadedDoc, setUploadedDocs] = useState([]);
  const [fileError, setFileError] = useState("");

  return (
    <div className={styles.creditModalBox}>
      <h2 className={styles.contactModalTitle}>Add Document</h2>
      <form onSubmit={handleUpdate}>
        <input type="hidden" name="_token" value={csrfToken} />

        <div className={styles.leadDocCard}>
          {/* <input
            ref={documentInputRef}
            type="file"
            multiple
            className={styles.hiddenFileInput}
            onChange={(event) => {
              handleDocumentSelect(event);

              const selectedFiles = Array.from(event.target.files ?? []);
              if (selectedFiles.length === 0) return;
              setUploadedDocs((prev) => [...prev, ...selectedFiles]);
              event.target.value = "";
            }}
          /> */}
          <input
            ref={documentInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className={styles.hiddenFileInput}
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files ?? []);
              event.target.value = "";

              if (selectedFiles.length === 0) return;

              const accepted = [];
              const rejected = [];

              selectedFiles.forEach((file) => {
                const extension = file.name.split(".").pop()?.toLowerCase();
                if (ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
                  accepted.push(file);
                } else {
                  rejected.push(file.name);
                }
              });

              if (rejected.length > 0) {
                setFileError(fileTypeError(rejected.join(", ")));
              } else {
                setFileError("");
              }

              if (accepted.length === 0) return;

              setUploadedDocs((prev) => [...prev, ...accepted]);
              handleDocumentSelect(accepted);
            }}
          />
          <button
            type="button"
            className={styles.uploadBox}
            onClick={() => documentInputRef.current?.click()}
          >
            <div className={styles.uploadIcon}>
              <LuFileDown size={24} />
            </div>
            <p>Click to Upload</p>
            <span className={styles.uploadFormats}>
              pdf, doc, docx, jpg, jpeg, png
            </span>
          </button>
          {fileError && (
            <span className={styles.errorMessage}>{fileError}</span>
          )}

          {uploadedDoc.length > 0 && (
            <div className={styles.uploadedStatus}>
              <div className={styles.uploadTitle}>
                <span>Attached Files</span>
              </div>

              {uploadedDoc.map((file, index) => (
                <div className={styles.fileItem} key={`${file.name}-${index}`}>
                  <span className={styles.fileName} title={file.name}>
                    {file.name}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setUploadedDocs((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                      handleDocumentRemove(index);
                    }}
                  >
                    <FaRegTrashAlt className={styles.uploaded} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn}>
            {"Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDocumentForm;
