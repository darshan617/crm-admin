import React, { useRef, useState } from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";
import { LuFileDown } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

const AddDocumentForm = ({
  csrfToken,
  formData,
  handleUpdate,
  handleDocumentSelect,
  handleDocumentRemove,
}) => {
  const documentInputRef = useRef(null);

  return (
    <div className={styles.creditModalBox}>
      <h2 className={styles.contactModalTitle}>Add Document</h2>
      <form onSubmit={handleUpdate}>
        <input type="hidden" name="_token" value={csrfToken} />

        <div className={styles.leadDocCard}>
          <input
            ref={documentInputRef}
            type="file"
            multiple
            className={styles.hiddenFileInput}
            onChange={handleDocumentSelect}
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
          </button>

          {formData?.documents?.length > 0 && (
            <div className={styles.uploadedStatus}>
              <div className={styles.uploadTitle}>
                <span>Attached Files</span>
              </div>

              {formData?.documents?.map((file, index) => (
                <div className={styles.fileItem} key={`${file.name}-${index}`}>
                  <span className={styles.fileName} title={file.name}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => handleDocumentRemove(index)}
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
