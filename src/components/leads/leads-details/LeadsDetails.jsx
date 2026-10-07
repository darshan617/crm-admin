"use client";

import { useState } from "react";
import Link from "next/link";
import { GoArrowLeft, GoPlus } from "react-icons/go";
import { FaPencil } from "react-icons/fa6";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileImageLine } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import styles from "@/components/leads/leads-details/LeadsDetails.module.css";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";

const contacts = [1, 2, 3].map((n) => ({
  title: `Contact Person ${n}`,
  fullName: "Harsh Agarwal",
  designation: "Manager",
  email: "harsh@agarwalenterprise.com",
  phone: "+91 981234 56780",
}));

const documents = [
  {
    name: "images 02-09-2026 13:12:52:866.png",
    icon: RiFileImageLine,
    by: "Mittal Solanki",
    date: "02/09/2026 01:12 PM",
  },
  {
    name: "images.png",
    icon: RiFileImageLine,
    by: "Mittal Solanki",
    date: "02/09/2026 01:11 PM",
  },
  {
    name: "GST_Certificate.pdf",
    icon: FiFileText,
    by: "Mittal Solanki",
    date: "02/09/2026 01:05 PM",
  },
];

const activities = [
  { date: "08 May 2026", text: "Proposal drafted and sent for review." },
  { date: "07 May 2026", text: "Initial meeting scheduled with the lead." },
  { date: "06 May 2026", text: "Follow-up email sent to prospective client." },
  { date: "05 May 2026", text: "New Lead created by online marketing." },
];

// const [showLeadModal, setShowLeadModal] = useState(false);

export default function LeadDetail() {
  // popup is closed by default, opens only on "Add / Edit Details" click
  const [showLeadModal, setShowLeadModal] = useState(false);

  const removeService = (formId) => {
    if (confirm("Remove this info?")) {
      document.getElementById(formId)?.submit();
    }
  };

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <a href="">Dashboard</a>
              <span>/</span>
              <a href="">Leads</a>
              <span>/</span>
            </p>
          </div>

          <h2>Lead Detail</h2>
        </div>

        <div className="back">
          <Link href="/b2b-partners" className="back-btn">
            <GoArrowLeft />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="customer-dashboard">
        <div className={styles.orderDashboardGrid}>
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <main className={styles.customerContent}>
            {/* =========================
                LEAD INFORMATION
            ========================== */}

            <section className="common-table-section">
              <div className={`${styles.commonTableCard} p-16`}>
                <div className={styles.leadTopMeta}>
                  <span>
                    Status :<div className="status-interested">Interested</div>
                  </span>

                  <span>
                    Category :<div className="status-hot">Hot</div>
                  </span>

                  <span>
                    Created On :<div>25 Jun, 2021</div>
                  </span>
                </div>

                <div className={styles.leadCompanyHeader}>
                  <h3>Goyal Infotech Pvt. Ltd.</h3>

                  <button
                    type="button"
                    className={styles.editLeadBtn}
                    onClick={() => setShowDocumentModal(true)}
                  >
                    <FaPencil />
                    Add / Edit Details
                  </button>
                </div>

                <div className={styles.leadInfoGrid}>
                  <div className={styles.infoItem}>
                    <label>Full Name</label>
                    <p>Harsh Agarwal</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Designation</label>
                    <p>Owner</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Contact No.</label>
                    <p>+91 981234 56780</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Email</label>
                    <p>harsh@agarwalenterprise.com</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Industry</label>
                    <p>Secondary (manufacturing)</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Number of Employee</label>
                    <p>125</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>GSTIN</label>
                    <p>27ABCFU1234D2Z5</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Address</label>
                    <p>
                      Office No. 410, 9 Business Bay, Mindspace, Malad West,
                      Mumbai, Maharashtra-400064. INDIA
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                CONTACT INFORMATION
            ========================== */}

            <section className="common-table-section">
              <div className={`${styles.commonTableCard} p-16`}>
                <div className={styles.cardHeader}>
                  <h3>CONTACT INFORMATION</h3>

                  <a href="#" className={styles.addCreditBtn}>
                    <GoPlus />
                    Add Contact
                  </a>
                </div>

                <div className={styles.contactInformationSection}>
                  {contacts.map((contact) => (
                    <div className={styles.leadContactCard} key={contact.title}>
                      <h4>{contact.title}</h4>

                      <div className={styles.contactInfoGrid}>
                        <div>
                          <label>Full Name</label>
                          <p>{contact.fullName}</p>
                        </div>

                        <div>
                          <label>Designation</label>
                          <p>{contact.designation}</p>
                        </div>

                        <div>
                          <label>Email</label>
                          <p>{contact.email}</p>
                        </div>

                        <div>
                          <label>Contact No.</label>
                          <p>{contact.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* current service */}

            <section className="common-table-section lead-show-full">
              <div className="common-table-card p-16">
                <div className={styles.cardHeader}>
                  <h3>CURRENT SERVICE (INFO)</h3>
                  <a
                    href="#"
                    className={styles.addCreditBtn}
                    id="openAddInfoService"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="plus"
                      aria-hidden="true"
                      className="lucide lucide-plus"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    Add Current Service
                  </a>
                </div>
                <div
                  className={`${styles.serviceRequiredCard} ${styles.serviceRequiredCard2}`}
                >
                  <div className={styles.serviceItem}>
                    <label>Domain</label>
                    <p>dsadsa</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Service</label>
                    <p>Google Workspace</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Plan Name</label>
                    <p>Google Workspace Business Standard</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Current Price</label>
                    <p>₹ 12,960.00</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Renewal Date</label>
                    <p>-</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>No of Users</label>
                    <p>1</p>
                  </div>
                  <div
                    className={`${styles.serviceActions} ${styles.actionAbsolute}`}
                  >
                    <button
                      type="button"
                      onClick={() => removeService("delete-service-66")}
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      type="button"
                      className="edit-info-service-btn"
                      data-action="https://superadmin.tizzygroup.com/crm/leads/70/services/66/update"
                      data-provider="3"
                      data-plan="20"
                      data-sku="business-standard"
                      data-quantity="1"
                      data-rate="12960.00"
                      data-renewal=""
                      data-domain="dsadsa"
                    >
                      <FaPencil />
                    </button>
                  </div>
                  <form
                    id="delete-service-66"
                    method="POST"
                    action="https://superadmin.tizzygroup.com/crm/leads/70/services/66/delete"
                  >
                    <input
                      type="hidden"
                      name="_token"
                      value="WW2Yc8aGHganqT0MoQtZEFariu0DTM7CjtaZh8YE"
                      autoComplete="off"
                    />{" "}
                  </form>
                </div>
                <div className={styles.serviceRequiredCard}>
                  <div className={styles.serviceItem}>
                    <label>Domain</label>
                    <p>dsadsa</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Service</label>
                    <p>Google Workspace</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Plan Name</label>
                    <p>Google Workspace Business Standard</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Current Price</label>
                    <p>₹ 12,960.00</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>Renewal Date</label>
                    <p>-</p>
                  </div>
                  <div className={styles.serviceItem}>
                    <label>No of Users</label>
                    <p>1</p>
                  </div>
                  <div
                    className={`${styles.serviceActions} ${styles.actionAbsolute}`}
                  >
                    <button
                      type="button"
                      onClick={() => removeService("delete-service-67")}
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      type="button"
                      className="edit-info-service-btn"
                      data-action="https://superadmin.tizzygroup.com/crm/leads/70/services/67/update"
                      data-provider="3"
                      data-plan="20"
                      data-sku="business-standard"
                      data-quantity="1"
                      data-rate="12960.00"
                      data-renewal=""
                      data-domain="dsadsa"
                    >
                      <FaPencil />
                    </button>
                  </div>
                  <form
                    id="delete-service-67"
                    method="POST"
                    action="https://superadmin.tizzygroup.com/crm/leads/70/services/67/delete"
                  >
                    <input
                      type="hidden"
                      name="_token"
                      value="WW2Yc8aGHganqT0MoQtZEFariu0DTM7CjtaZh8YE"
                      autoComplete="off"
                    />{" "}
                  </form>
                </div>
              </div>
            </section>

            {/* =========================
                SERVICE REQUIRED
            ========================== */}

            <section className="common-table-section">
              <div className={`${styles.commonTableCard} p-16`}>
                <div className={styles.cardHeader}>
                  <h3>OUR SERVICE</h3>

                  <a href="#" className={styles.addCreditBtn}>
                    <GoPlus />
                    Add Service
                  </a>
                </div>

                <div className={styles.serviceRequiredCard}>
                  <div className={styles.serviceCheck}>
                    <input type="checkbox" />
                  </div>

                  <div className={styles.serviceItem}>
                    <label>Service</label>
                    <p>Tizzy Cloud Email</p>
                  </div>

                  <div className={styles.serviceItem}>
                    <label>Plan Name</label>
                    <p>Tizzy Mail Platinum 50 GB</p>
                  </div>

                  <div className={styles.serviceItem}>
                    <label>Quot Period</label>
                    <p>Yearly</p>
                  </div>

                  <div className={styles.serviceItem}>
                    <label>Renewal Date</label>
                    <p>12/06/2027</p>
                  </div>

                  <div className={styles.serviceItem}>
                    <label>Rate</label>
                    <p>₹ 6510 per user/year</p>
                  </div>

                  <div className={styles.serviceItem}>
                    <label>No of Users</label>
                    <p>50</p>
                  </div>

                  <div
                    className={`${styles.actionAbsolute} ${styles.serviceActions} `}
                  >
                    <button type="button">
                      <FiTrash2 />
                    </button>

                    <button type="button">
                      <FaPencil />
                    </button>
                  </div>
                </div>

                <div className={styles.submitWrap}>
                  <button type="button" className={styles.submitBtn}>
                    Create Quotation
                  </button>
                </div>
              </div>
            </section>

            {/* =========================
                DOCUMENTS
            ========================== */}

            <section className="common-table-section" id="documentsCard">
              <div className={`${styles.commonTableCard} p-16`}>
                <div className={styles.cardHeader}>
                  <h3>DOCUMENTS</h3>

                  <a href="#" className={styles.addCreditBtn}>
                    <GoPlus />
                    Add Document
                  </a>
                </div>

                <div className={styles.downloadList}>
                  {/* HEADER */}

                  <div className={styles.downloadHeader}>
                    <div>File Name</div>

                    <div>Attached By</div>

                    <div>Date Added</div>

                    <div className="status-col">Action</div>
                  </div>

                  {/* DOCUMENTS */}

                  {documents.map((doc) => {
                    const FileIcon = doc.icon;

                    return (
                      <div className={styles.downloadRow} key={doc.name}>
                        <div>
                          <a href="#" className={styles.downloadFile}>
                            <FileIcon />
                            {doc.name}
                          </a>
                        </div>

                        <div>{doc.by}</div>

                        <div>{doc.date}</div>

                        <div className={styles.serviceActions}>
                          <button type="button" title="Preview">
                            <FaRegEye />
                          </button>

                          <button type="button" title="Download">
                            <MdOutlineFileDownload />
                          </button>

                          <button type="button" title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className={styles.customerInfo}>
            {/* =========================
                SCHEDULE FOLLOW UP
            ========================== */}

            <section className="common-table-section">
              <div className={`${styles.commonTableCard} p-16`}>
                <div className={styles.cardHeader}>
                  <h3>SCHEDULE FOLLOW UP</h3>
                </div>

                <div className="followup-form">
                  {/* Lead Category */}

                  <div className="form-group">
                    <label>
                      Lead Category <span>*</span>
                    </label>

                    <div className="">
                      <select defaultValue="New">
                        <option>New</option>
                        <option>Hot</option>
                        <option>Warm</option>
                        <option>Cold</option>
                      </select>
                    </div>
                  </div>

                  {/* Lead Source */}

                  <div className="form-group">
                    <label>
                      Lead Source <span>*</span>
                    </label>

                    <div className="">
                      <select defaultValue="New">
                        <option>New</option>
                        <option>Website</option>
                        <option>Reference</option>
                        <option>Tele Caller</option>
                        <option>Social Media</option>
                      </select>
                    </div>
                  </div>

                  {/* Lead Status */}

                  <div className="form-group">
                    <label>
                      Lead Status <span>*</span>
                    </label>

                    <div className="">
                      <select defaultValue="New">
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Converted</option>
                        <option>Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Assigned To */}

                  <div className="form-group">
                    <label>
                      Assigned To <span>*</span>
                    </label>

                    <div className={styles.assignedUserForm}>
                      {/* <span className="user-avatar">N</span> */}

                      <span>Namrata Singh</span>

                      <IoChevronDown />
                    </div>
                  </div>

                  {/* Set Time */}

                  <div className="form-group">
                    <label>
                      Set Time <span>*</span>
                    </label>

                    <div className="time-input">
                      <input
                        type="text"
                        placeholder="dd/mm/yy - hh:mm"
                        onFocus={(e) => {
                          e.currentTarget.type = "datetime-local";
                        }}
                      />
                    </div>
                  </div>

                  {/* Note */}

                  <div className="form-group">
                    <label>
                      Note <span>*</span>
                    </label>

                    <textarea></textarea>
                  </div>

                  <div className={styles.submitWrap}>
                    <button type="button" className={styles.submitBtn}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                ACTIVITY
            ========================== */}

            <div className={styles.activityColumn} style={{ width: "100%" }}>
              <div className={styles.commonTableHeader}>
                <h3>Recent Activities</h3>
                <a href="#" className={styles.viewAll}>
                  View All
                </a>
              </div>

              <div className={styles.activityCard}>
                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon}  ${styles.teal}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="check"
                      aria-hidden="true"
                      className="lucide lucide-check"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Service added
                      <span>Google Workspace Business Standard</span>
                    </p>
                    <small>27 minutes ago</small>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles.teal}  `}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="check"
                      aria-hidden="true"
                      className="lucide lucide-check"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Service added
                      <span>Google Workspace Business Standard</span>
                    </p>
                    <small>27 minutes ago</small>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon}  ${styles.blue} `}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="phone-call"
                      aria-hidden="true"
                      className="lucide lucide-phone-call"
                    >
                      <path d="M13 2a9 9 0 0 1 9 9"></path>
                      <path d="M13 6a5 5 0 0 1 5 5"></path>
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Follow-up set for 06 Oct 2026, 12
                      <span>00 AM</span>
                    </p>
                    <small>27 minutes ago</small>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon}  ${styles.purple} `}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="user-round-plus"
                      aria-hidden="true"
                      className="lucide lucide-user-round-plus"
                    >
                      <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                      <circle cx="10" cy="8" r="5"></circle>
                      <path d="M19 16v6"></path>
                      <path d="M22 19h-6"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Lead created from
                      <span>Website</span>
                    </p>
                    <small>1 day ago</small>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles.purple}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="user-round-plus"
                      aria-hidden="true"
                      className="lucide lucide-user-round-plus"
                    >
                      <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                      <circle cx="10" cy="8" r="5"></circle>
                      <path d="M19 16v6"></path>
                      <path d="M22 19h-6"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Contact added
                      <span>Janvi Singh</span>
                    </p>
                    <small>1 day ago</small>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles.teal}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-lucide="check"
                      aria-hidden="true"
                      className="lucide lucide-check"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>

                  <div className={styles.activityContent}>
                    <p>
                      Service added
                      <span>Microsoft 365 Apps for business</span>
                    </p>
                    <small>1 day ago</small>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <CustomPopup
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        maxWidth="600px"
      >
        <div className={styles.creditModalBox}>
          <h2>Add / Edit Lead Details</h2>

          <form
            method="POST"
            action="https://superadmin.tizzygroup.com/crm/leads/70/update"
            className="common-form"
            id="leadDetailsForm"
            noValidate
          >
            <input
              type="hidden"
              name="_token"
              value="WW2Yc8aGHganqT0MoQtZEFariu0DTM7CjtaZh8YE"
              autoComplete="off"
            />

            <div className={styles.formGrid}>
              <div className="form-group">
                <label>
                  Name <span>*</span>
                </label>

                <div className="phone-group name-title-row">
                  <select
                    name="salutation"
                    className="form-control phone-code-select title-select"
                    required
                    defaultValue="Mr"
                  >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>

                  <input
                    type="text"
                    name="name"
                    defaultValue="Darshan B"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Designation</label>

                <select name="designation" defaultValue="Accounts">
                  <option value="">Select Designation</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Director">Director</option>
                  <option value="IT Head">IT Head</option>
                  <option value="Manager">Manager</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Email <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  defaultValue="darshan1@goyalinfotech.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Mobile <span>*</span>
                </label>

                <div className="phone-group">
                  <select
                    name="mobile_code"
                    className="form-control phone-code-select"
                    defaultValue="91"
                  >
                    <option value="91">+91 India</option>
                    <option value="93">+93 Afghanistan</option>
                    <option value="355">+355 Albania</option>
                    <option value="213">+213 Algeria</option>
                    <option value="376">+376 Andorra</option>
                    <option value="244">+244 Angola</option>
                    <option value="54">+54 Argentina</option>
                    <option value="374">+374 Armenia</option>
                    <option value="973">+973 Bahrain</option>
                    <option value="880">+880 Bangladesh</option>
                    <option value="375">+375 Belarus</option>
                    <option value="32">+32 Belgium</option>
                    <option value="501">+501 Belize</option>
                    <option value="229">+229 Benin</option>
                    <option value="975">+975 Bhutan</option>
                    <option value="591">+591 Bolivia</option>
                    <option value="387">+387 Bosnia</option>
                    <option value="267">+267 Botswana</option>
                    <option value="55">+55 Brazil</option>
                    <option value="673">+673 Brunei</option>
                    <option value="359">+359 Bulgaria</option>
                    <option value="226">+226 Burkina Faso</option>
                    <option value="257">+257 Burundi</option>
                    <option value="855">+855 Cambodia</option>
                    <option value="237">+237 Cameroon</option>
                    <option value="1">+1 USA / Canada</option>
                    <option value="238">+238 Cape Verde</option>
                    <option value="236">+236 Central African Republic</option>
                    <option value="235">+235 Chad</option>
                    <option value="56">+56 Chile</option>
                    <option value="86">+86 China</option>
                    <option value="57">+57 Colombia</option>
                    <option value="269">+269 Comoros</option>
                    <option value="242">+242 Congo</option>
                    <option value="506">+506 Costa Rica</option>
                    <option value="385">+385 Croatia</option>
                    <option value="53">+53 Cuba</option>
                    <option value="357">+357 Cyprus</option>
                    <option value="420">+420 Czech Republic</option>
                    <option value="45">+45 Denmark</option>
                    <option value="253">+253 Djibouti</option>
                    <option value="593">+593 Ecuador</option>
                    <option value="20">+20 Egypt</option>
                    <option value="503">+503 El Salvador</option>
                    <option value="240">+240 Equatorial Guinea</option>
                    <option value="291">+291 Eritrea</option>
                    <option value="372">+372 Estonia</option>
                    <option value="251">+251 Ethiopia</option>
                    <option value="679">+679 Fiji</option>
                    <option value="358">+358 Finland</option>
                    <option value="33">+33 France</option>
                    <option value="241">+241 Gabon</option>
                    <option value="220">+220 Gambia</option>
                    <option value="995">+995 Georgia</option>
                    <option value="49">+49 Germany</option>
                    <option value="233">+233 Ghana</option>
                    <option value="30">+30 Greece</option>
                    <option value="502">+502 Guatemala</option>
                    <option value="224">+224 Guinea</option>
                    <option value="245">+245 Guinea-Bissau</option>
                    <option value="592">+592 Guyana</option>
                    <option value="509">+509 Haiti</option>
                    <option value="504">+504 Honduras</option>
                    <option value="852">+852 Hong Kong</option>
                    <option value="36">+36 Hungary</option>
                    <option value="354">+354 Iceland</option>
                    <option value="62">+62 Indonesia</option>
                    <option value="98">+98 Iran</option>
                    <option value="964">+964 Iraq</option>
                    <option value="353">+353 Ireland</option>
                    <option value="972">+972 Israel</option>
                    <option value="39">+39 Italy</option>
                    <option value="225">+225 Ivory Coast</option>
                    <option value="81">+81 Japan</option>
                    <option value="962">+962 Jordan</option>
                    <option value="7">+7 Kazakhstan / Russia</option>
                    <option value="254">+254 Kenya</option>
                    <option value="686">+686 Kiribati</option>
                    <option value="965">+965 Kuwait</option>
                    <option value="996">+996 Kyrgyzstan</option>
                    <option value="856">+856 Laos</option>
                    <option value="371">+371 Latvia</option>
                    <option value="961">+961 Lebanon</option>
                    <option value="266">+266 Lesotho</option>
                    <option value="231">+231 Liberia</option>
                    <option value="218">+218 Libya</option>
                    <option value="423">+423 Liechtenstein</option>
                    <option value="370">+370 Lithuania</option>
                    <option value="352">+352 Luxembourg</option>
                    <option value="853">+853 Macau</option>
                    <option value="389">+389 Macedonia</option>
                    <option value="261">+261 Madagascar</option>
                    <option value="265">+265 Malawi</option>
                    <option value="60">+60 Malaysia</option>
                    <option value="960">+960 Maldives</option>
                    <option value="223">+223 Mali</option>
                    <option value="356">+356 Malta</option>
                    <option value="222">+222 Mauritania</option>
                    <option value="230">+230 Mauritius</option>
                    <option value="52">+52 Mexico</option>
                    <option value="373">+373 Moldova</option>
                    <option value="377">+377 Monaco</option>
                    <option value="976">+976 Mongolia</option>
                    <option value="382">+382 Montenegro</option>
                    <option value="212">+212 Morocco</option>
                    <option value="258">+258 Mozambique</option>
                    <option value="95">+95 Myanmar</option>
                    <option value="264">+264 Namibia</option>
                    <option value="977">+977 Nepal</option>
                    <option value="31">+31 Netherlands</option>
                    <option value="64">+64 New Zealand</option>
                    <option value="505">+505 Nicaragua</option>
                    <option value="227">+227 Niger</option>
                    <option value="234">+234 Nigeria</option>
                    <option value="850">+850 North Korea</option>
                    <option value="47">+47 Norway</option>
                    <option value="968">+968 Oman</option>
                    <option value="92">+92 Pakistan</option>
                    <option value="970">+970 Palestine</option>
                    <option value="507">+507 Panama</option>
                    <option value="675">+675 Papua New Guinea</option>
                    <option value="595">+595 Paraguay</option>
                    <option value="51">+51 Peru</option>
                    <option value="63">+63 Philippines</option>
                    <option value="48">+48 Poland</option>
                    <option value="351">+351 Portugal</option>
                    <option value="974">+974 Qatar</option>
                    <option value="40">+40 Romania</option>
                    <option value="250">+250 Rwanda</option>
                    <option value="966">+966 Saudi Arabia</option>
                    <option value="221">+221 Senegal</option>
                    <option value="381">+381 Serbia</option>
                    <option value="248">+248 Seychelles</option>
                    <option value="232">+232 Sierra Leone</option>
                    <option value="65">+65 Singapore</option>
                    <option value="421">+421 Slovakia</option>
                    <option value="386">+386 Slovenia</option>
                    <option value="252">+252 Somalia</option>
                    <option value="27">+27 South Africa</option>
                    <option value="82">+82 South Korea</option>
                    <option value="211">+211 South Sudan</option>
                    <option value="34">+34 Spain</option>
                    <option value="94">+94 Sri Lanka</option>
                    <option value="249">+249 Sudan</option>
                    <option value="597">+597 Suriname</option>
                    <option value="268">+268 Swaziland</option>
                    <option value="46">+46 Sweden</option>
                    <option value="41">+41 Switzerland</option>
                    <option value="963">+963 Syria</option>
                    <option value="886">+886 Taiwan</option>
                    <option value="992">+992 Tajikistan</option>
                    <option value="255">+255 Tanzania</option>
                    <option value="66">+66 Thailand</option>
                    <option value="228">+228 Togo</option>
                    <option value="676">+676 Tonga</option>
                    <option value="216">+216 Tunisia</option>
                    <option value="90">+90 Turkey</option>
                    <option value="993">+993 Turkmenistan</option>
                    <option value="256">+256 Uganda</option>
                    <option value="380">+380 Ukraine</option>
                    <option value="971">+971 UAE</option>
                    <option value="44">+44 United Kingdom</option>
                    <option value="598">+598 Uruguay</option>
                    <option value="998">+998 Uzbekistan</option>
                    <option value="678">+678 Vanuatu</option>
                    <option value="58">+58 Venezuela</option>
                    <option value="84">+84 Vietnam</option>
                    <option value="967">+967 Yemen</option>
                    <option value="260">+260 Zambia</option>
                    <option value="263">+263 Zimbabwe</option>
                  </select>

                  <input
                    type="tel"
                    name="mobile"
                    defaultValue="9658745858"
                    required
                    inputMode="numeric"
                    maxLength="15"
                    pattern="[0-9]{6,15}"
                    className="js-mobile-digits"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  defaultValue="CENTRAL WARE HOUSING CORP.LTD."
                />
              </div>

              <div className="form-group">
                <label>Business</label>
                <select name="business_type" defaultValue="existing">
                  <option value="new">New Business</option>
                  <option value="existing">Existing Business</option>
                </select>
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  defaultValue="CORPORATION"
                  placeholder="Filled from GSTIN"
                />
              </div>

              <div className="form-group">
                <label>No. of Employees</label>
                <input
                  type="number"
                  name="no_of_employees"
                  min="0"
                  defaultValue="22"
                />
              </div>

              <div className="form-group">
                <label>GSTIN</label>

                <input
                  type="text"
                  name="gstin"
                  id="editGstin"
                  defaultValue="24AAACC1206D1ZM"
                  maxLength="15"
                />

                <div
                  id="editGstStatus"
                  style={{
                    fontSize: "13px",
                    marginTop: "6px",
                    fontWeight: 600,
                  }}
                ></div>
              </div>

              <div className="form-group">
                <label>Assigned To</label>

                <select name="assigned_to" defaultValue="Darshan Bane">
                  <option value="">Select Employee</option>
                  <option value="Darshan Bane">Darshan Bane</option>
                  <option value="Janvi Singh">Janvi Singh</option>
                  <option value="Pratik V">Pratik V</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lead Priority</label>

                <select name="lead_category" defaultValue="Hot">
                  <option value="">Select Priority</option>
                  <option value="Cold">Cold</option>
                  <option value="Hot">Hot</option>
                  <option value="Normal">Normal</option>
                  <option value="Warm">Warm</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Lead Status <span>*</span>
                </label>

                <select name="lead_status" required defaultValue="Contacted">
                  <option value="">Select Status</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Lost">Lost</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="New">New</option>
                  <option value="Nurturing">Nurturing</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Quote Send">Quote Send</option>
                  <option value="Won">Won</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lead Bifurcation</label>

                <select name="lead_bifurcation" defaultValue="B2B">
                  <option value="">Select Bifurcation</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lead Source</label>

                <select name="lead_source" defaultValue="Website">
                  <option value="">Select Source</option>
                  <option value="Email">Email</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Instagram">Instagram</option>
                  <option value="JD">JD</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Tele Caller">Tele Caller</option>
                  <option value="Website">Website</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Mailing Address</label>

                <input
                  type="text"
                  name="mailing_address"
                  defaultValue="CENTRAL WAREHOUSING CORPORATION, MAHALAXMI CHAR RASTA, PALDI, Ahmedabad, Gujarat, 380007"
                />
              </div>

              <div className="form-group">
                <label>Country</label>

                <select name="country" defaultValue="India">
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>State</label>

                <input type="text" name="state" defaultValue="Delhi" />
              </div>

              <div className="form-group">
                <label>City</label>

                <input type="text" name="city" defaultValue="" />
              </div>

              <div className="form-group">
                <label>Pincode</label>

                <input type="text" name="pincode" defaultValue="380007" />
              </div>

              <div className="form-group">
                <label>Domain option</label>

                <select
                  name="domain_type"
                  id="editDomainType"
                  defaultValue="existing"
                >
                  <option value="">No domain</option>
                  <option value="existing">Already have domain</option>
                  <option value="new">Need new domain</option>
                </select>
              </div>

              <div
                className="form-group edit-domain-name domain-check-group"
                style={{}}
              >
                <label>Domain Name</label>

                <div className="domain-check-row">
                  <input
                    type="text"
                    name="domain"
                    id="editDomainName"
                    defaultValue="dar.com"
                    placeholder="example.com"
                  />

                  <button
                    type="button"
                    className="add-plan-btn domain-check-btn edit-domain-check"
                    id="editCheckDomainBtn"
                    style={{ display: "none" }}
                  >
                    Check Availability
                  </button>
                </div>

                <div
                  id="editDomainCheckStatus"
                  className="form-hint domain-check-status"
                ></div>

                <div id="editDomainHaveHint" className="form-hint"></div>
              </div>

              <div
                className="form-group edit-domain-have"
                style={{ display: "flex" }}
              >
                <label>Renewal Date</label>

                <div className="date-input">
                  <input
                    type="date"
                    name="domain_renewal_date"
                    id="editDomainRenewal"
                    defaultValue="2026-10-06"
                  />
                </div>
              </div>

              <div
                className="form-group edit-domain-new"
                style={{ display: "none" }}
              >
                <label>Period</label>

                <select name="domain_period" defaultValue="">
                  <option value="">Select Period</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div
                className="form-group edit-domain-new"
                style={{ display: "none" }}
              >
                <label>Rate</label>

                <input
                  type="number"
                  name="domain_rate"
                  min="0"
                  step="0.01"
                  defaultValue=""
                />
              </div>

              <div
                className="form-group edit-domain-new"
                style={{ display: "none" }}
              >
                <label>SAC</label>

                <input type="text" name="sac" defaultValue="" />
              </div>

              <div
                className="form-group edit-domain-new"
                style={{ display: "none" }}
              >
                <label>Domain Start</label>

                <input type="date" name="domain_start" defaultValue="" />
              </div>

              <div
                className="form-group edit-domain-new"
                style={{ display: "none" }}
              >
                <label>Domain End</label>

                <input type="date" name="domain_end" defaultValue="" />
              </div>
            </div>

            <div className={styles.submitWrap}>
              <button type="submit" className={styles.submitBtn}>
                Save Details
              </button>
            </div>
          </form>
        </div>
      </CustomPopup>
    </>
  );
}
