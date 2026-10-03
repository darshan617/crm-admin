import React from "react";
import styles from '@/components/dashboard/upload-leads/UploadLeads.module.css'
import { LuFileDown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";

const UploaadLeads = () => {
  return (
    <div className="content">
      <div className="page-header">
        <div className="">
          <div className="breadcrumb welcome-text">
            <p>
              <a href="">Dashboard</a> <span>/</span>
              <a href="">Leads</a>
            </p>
          </div>
          <h2>Upload Lead</h2>
        </div>
        <div className="back">
          <a href="/" className="back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </a>
        </div>
      </div>
      <section className={styles.uploadLeadPage}>
        <div className={styles.uploadLeadCard}>
          {/* <!-- Heading --> */}
          <h3>UPLOAD CUSTOMER LEADS</h3>
          {/* <!-- Upload Box --> */}
          <div className={styles.uploadLeadBox}>
            <div className={styles.uploadLeadIcon}>
            <LuFileDown size={30} />
            </div>
            <div className={styles.uploadLeadText}>Click to Upload</div>
            <div className={styles.uploadLeadFormat}>(.csv, .xls or .xlsx)</div>
            {/* <input
              type="file"
              id="leadFile"
              className="lead-file-input"
              accept=".csv,.xls,.xlsx"
            /> */}
          </div>
          {/* <!-- Uploading --> */}
          <div className={styles.uploadFileSection}>
            <div className={styles.uploadFileTitle}>Uploading 1/1 files</div>
            <div className={styles.uploadFileRow}>
              <span>your-file-here.PDF</span>
              <button
                type="button"
                className={styles.uploadRemoveBtn}
                aria-label="Remove"
              >
                <RxCross2 />
              </button>
            </div>
            <div className={styles.uploadProgress}>
              <span></span>
            </div>
          </div>

          {/* <!-- Uploaded --> */}
          <div className={`${styles.uploadFileSection} ${styles.uploadedSection}`}>
            <div className={styles.uploadFileTitle}>Uploaded</div>
            <div className={`${styles.uploadFileRow} uploaded-row`}>
              <span>your-file-here.PDF</span>
              <button
                type="button"
                className={styles.uploadDeleteBtn }
                aria-label="Delete"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>

          {/* <!-- Submit --> */}
          <div className={styles.uploadSubmitWrap}>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UploaadLeads;
