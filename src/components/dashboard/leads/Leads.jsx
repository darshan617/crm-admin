import React from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";
import { LuFileDown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";

const Leads = () => {
  return (
    <section className="content">
      <div class="page-header">
        <div class="">
          <div class="breadcrumb welcome-text">
            <p>
              <a href="">Dashboard</a> <span>/</span>
              <a href="">Leads</a>
            </p>
          </div>
          <h2>Add New Lead</h2>
        </div>
        <div class="back">
          <a href="/" class="back-btn">
            <IoMdArrowBack />
            <span>Back</span>
          </a>
        </div>
      </div>
      <section className={styles.commonForm}>
        <div className={styles.mainFormLayout}>
          {/* =================== LEFT SIDE =================== */}
          <div className={styles.formLeft}>
            {/* CUSTOMER DETAIL */}
            <h3>Customer Detail</h3>

            <div className={styles.formGrid}>
              {/* Name */}
              <div className="form-group">
                <label>Name</label>
                <input type="text" />
              </div>

              {/* Designation */}
              <div className="form-group">
                <label>Designation</label>
                <input type="text" />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>
                <input type="email" />
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label>Mobile No.</label>
                <div className="phone-group">
                  <select defaultValue="91">
                    <option>91</option>
                    <option>1</option>
                    <option>44</option>
                    <option>971</option>
                  </select>
                  <input type="tel" />
                </div>
              </div>

              {/* Company Name */}
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" />
              </div>

              {/* Industry */}
              <div className="form-group">
                <label>Industry</label>
                <input type="text" />
              </div>

              {/* Company Name 2 */}
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" />
              </div>

              {/* Industry 2 */}
              <div className="form-group">
                <label>Industry</label>
                <input type="text" />
              </div>

              {/* Employees */}
              <div className="form-group">
                <label>No. of Employees</label>
                <input type="text" />
              </div>

              {/* GSTIN */}
              <div className="form-group">
                <label>GSTIN</label>
                <input type="text" />
              </div>
            </div>

            {/* ADDRESS INFORMATION */}
            <h3 className="section-title">Address Information</h3>

            <div className={styles.formGrid}>
              {/* Mailing Address */}
              <div className="form-group full-width">
                <label>Mailing Address</label>
                <input type="text" />
              </div>

              {/* Country */}
              <div className="form-group">
                <label>Country</label>
                <select defaultValue="India">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                </select>
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>
                <select defaultValue="Maharashtra">
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Goa</option>
                  <option>Karnataka</option>
                  <option>Delhi</option>
                </select>
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>
                <input type="text" />
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" />
              </div>
            </div>

            {/* PLAN DETAIL */}
            <div className="section-heading">
              <h3>Plan Detail</h3>
              <button type="button" className={styles.addPlanBtn}>
                + Add Plan
              </button>
            </div>

            <div className={styles.planBox}>
              <div className="plan-header">
                <strong>Sr. No. 1</strong>
                <button
                  type="button"
                  className="remove-plan"
                  aria-label="Remove Plan"
                >
                  <i data-lucide="x"></i>
                </button>
              </div>

              <div className={`${styles.formGrid} ${styles.formGrid3} `}>
                {/* Provider */}
                <div className="form-group">
                  <label>Provider</label>
                  <input type="text" />
                </div>

                {/* Plan */}
                <div className="form-group">
                  <label>Plan</label>
                  <select
                    className="form-control"
                    id="ServiceID"
                    name="ServiceID"
                  >
                    <option value="">Select Service</option>
                    <option value="2">Tizzy Cloud Email</option>
                    <option value="3">Tizzy Cloud Hosting</option>
                    <option value="4">Google workspace</option>
                    <option value="5">Migration</option>
                    <option value="6">Backup &amp; Restore</option>
                    <option value="7">Microsoft 365</option>
                  </select>
                </div>

                {/* Quote Period */}
                <div className="form-group">
                  <label>Quote Period</label>
                  <select
                    className="form-control"
                    id="QuotType"
                    name="QuotType"
                  >
                    <option value="">Select Period</option>
                    <option value="1">Monthly</option>
                    <option value="2">Yearly</option>
                    <option value="3">3 Yearly</option>
                  </select>
                </div>

                {/* SKU */}
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" />
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" />
                </div>

                {/* Rate */}
                <div className="form-group">
                  <label>Rate</label>
                  <input type="text" />
                </div>
              </div>
            </div>

            {/* ADDITIONAL CONTACT */}
            <div className="section-heading additional-contact-heading">
              <h3>Additional Contact</h3>
              <button type="button" className={styles.addPlanBtn}>
                + Add Contact
              </button>
            </div>

            <div className={`${styles.formGrid} additional-contact-grid`}>
              {/* Contact Person */}
              <div className="form-group" style={{ color: "#0355ac" }}>
                <h4>Contact Person</h4>
              </div>

              <div></div>

              {/* Name */}
              <div className="form-group">
                <label>Name</label>
                <input type="text" />
              </div>

              {/* Designation */}
              <div className="form-group">
                <label>Designation</label>
                <input type="text" />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>
                <input type="email" />
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label>Mobile No.</label>
                <input type="tel" />
              </div>
            </div>
          </div>

          {/* =================== RIGHT SIDE =================== */}
          <div className="form-right">
            {/* FOLLOW UP DETAIL */}
            <div className={`${styles.sideCard} followup-card`}>
              <h3>Follow Up Detail</h3>

              {/* Follow Up Date */}
              <div className="form-group">
                <label>Follow Up Date</label>
                <div className="date-input">
                  <input type="date" />
                </div>
              </div>

              {/* Add Note */}
              <div className="form-group">
                <label>Add Note</label>
                <textarea rows={4}></textarea>
              </div>
            </div>

            {/* LEAD SPECIFICATION */}
            <div className={styles.leadSpecification}>
              <h3>Lead Specification</h3>

              {/* Lead Category */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Category</label>
                <div className={styles.selectWrap}>
                  <select defaultValue="Normal">
                    <option>Normal</option>
                    <option>Hot</option>
                    <option>Warm</option>
                    <option>Cold</option>
                  </select>
                </div>
              </div>

              {/* Lead Status */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Status</label>
                <div className={styles.selectWrap}>
                  <select defaultValue="New">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Converted</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {/* Lead Source */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Source</label>
                <div className={styles.selectWrap}>
                  <select defaultValue="Tele Caller">
                    <option>Tele Caller</option>
                    <option>Website</option>
                    <option>Reference</option>
                    <option>Social Media</option>
                    <option>Advertisement</option>
                  </select>
                </div>
              </div>

              {/* Assigned To */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Assigned To</label>
                <div className={styles.assignedUserForm}>
                  <span className={styles.userAvatar}>N</span>
                  <span>Namrata Singh</span>
                </div>
              </div>
            </div>

            {/* ADD DOCUMENT */}
            <div className="document-section">
              <h3>Add Document</h3>

              {/* Upload */}
              <a href="upload-document.php" className={styles.uploadBox}>
                <div className={styles.uploadIcon}>
                  <LuFileDown size={24} />
                </div>
                <p>Click to Upload</p>
                {/* <input type="file" className="document-input" /> */}
              </a>

              {/* Uploading */}
              <div className="upload-status">
                <div className={styles.uploadTitle}>
                  <span>Uploading 1/1 Files</span>
                </div>

                <div className={`${styles.fileItem} uploading-file`}>
                  <span>your-File-here.PDF</span>
                  <button type="button" aria-label="Cancel Upload">
                    <RxCross2 className={styles.uploaded} />
                  </button>
                </div>

                <div className={styles.progressBar}>
                  <span></span>
                </div>
              </div>

              {/* Uploaded */}
              <div
                className={`${styles.uploadStatus} ${styles.uploadedStatus}`}
              >
                <div className={styles.uploadTitle}>
                  <span>Uploaded</span>
                </div>

                <div className={`${styles.fileItem}`}>
                  <span>your-File-here.PDF</span>
                  <button type="button" aria-label="Delete File">
                    <FaRegTrashAlt className={styles.uploaded} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn}>
            Save Lead
          </button>
        </div>
      </section>
    </section>
  );
};

export default Leads;
