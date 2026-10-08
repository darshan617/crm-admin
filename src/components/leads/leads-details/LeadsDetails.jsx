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
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisble,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import EditDetailForm from "../edit-detail-form/EditDetailForm";
import AddContactForm from "../add-contact-form/AddContactForm";
import AddCurrentServiceForm from "../add-current-service-form/AddCurrentServiceForm";
import AddOurService from "../add-our-service/AddOurService";
import AddDocumentForm from "../add-document-form/AddDocumentForm";

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

export default function LeadDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isPopupVisible = useSelector(selectIsPopupVisble);

  const removeService = (formId) => {
    if (confirm("Remove this info?")) {
      document.getElementById(formId)?.submit();
    }
  };

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
                    onClick={() =>
                      dispatch(setIsPopupVisible("add-details-popup"))
                    }
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

                  <a
                    onClick={() => dispatch(setIsPopupVisible("add-contact"))}
                    className={styles.addCreditBtn}
                  >
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
                    onClick={() =>
                      dispatch(setIsPopupVisible("add-current-service"))
                    }
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

                  <a
                    onClick={() =>
                      dispatch(setIsPopupVisible("add-our-service"))
                    }
                    className={styles.addCreditBtn}
                  >
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

                  <a onClick={() =>
                      dispatch(setIsPopupVisible("add-document"))
                    } className={styles.addCreditBtn}>
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

      {isPopupVisible === "add-details-popup" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          <EditDetailForm />
        </CustomPopup>
      )}
      {isPopupVisible === "add-contact" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          <AddContactForm />
        </CustomPopup>
      )}
      {isPopupVisible === "add-current-service" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          <AddCurrentServiceForm />
        </CustomPopup>
      )}
      {isPopupVisible === "add-our-service" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          <AddOurService />
        </CustomPopup>
      )}
      {isPopupVisible === "add-document" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          <AddDocumentForm />
        </CustomPopup>
      )}
    </>
  );
}
