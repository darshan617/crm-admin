"use client";

import { useState } from "react";
import Link from "next/link";
import { GoArrowLeft, GoPlus } from "react-icons/go";
import { FaPencil } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import styles from "@/components/leads/leads-details/LeadsDetails.module.css";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisble,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import AddCurrentServiceForm from "./leads-form/add-current-service-form/AddCurrentServiceForm";
import AddContactForm from "./leads-form/add-contact-form/AddContactForm";
import AddOurService from "./leads-form/add-our-service/AddOurService";
import AddDocumentForm from "./leads-form/add-document-form/AddDocumentForm";
import EditDetailForm from "./leads-form/edit-detail-form/EditDetailForm";
import {
  useGetDdDataQuery,
  useGetSingleLeadDeatilsQuery,
} from "@/redux/apis/leadsApi";

const displayValue = (value) =>
  value === null || value === undefined || value === "" ? "-" : value;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatDateTimeInput = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const createLeadFormData = (leadData) => {
  const leadDomain = leadData.domain || {};
  const services = Array.isArray(leadData.services) ? leadData.services : [];

  return {
    customer_detail: {
      salutation: leadData.salutation || "",
      name: leadData.name || "",
      designation: leadData.designation || "",
      email: leadData.email || "",
      mobile_code: leadData.mobile_code || "91",
      mobile: leadData.mobile || "",
      company_name: leadData.company_name || "",
      industry: leadData.industry || "",
      no_of_employees: leadData.no_of_employees ?? "",
      gstin: leadData.gstin || "",
      business_type: leadData.business_type || "",
    },
    address_information: {
      mailing_address: leadData.mailing_address || "",
      country: leadData.country || "",
      state: leadData.state || "",
      city: leadData.city || "",
      pincode: leadData.pincode || "",
    },
    domain: {
      domain_type: leadDomain.domain_type || "",
      domain: leadDomain.domain || "",
      domain_period: leadDomain.domain_period || "",
      domain_rate: leadDomain.domain_rate ?? "",
      sac: leadData.sac ?? leadDomain.sac ?? "",
      domain_start: leadDomain.domain_start?.slice(0, 10) || "",
      domain_end: leadDomain.domain_end?.slice(0, 10) || "",
      domain_renewal_date: leadDomain.domain_renewal_date?.slice(0, 10) || "",
    },
    current_service_info: services
      .filter(
        (service) =>
          service.is_info === true ||
          service.is_info === 1 ||
          service.is_info === "1",
      )
      .map((service) => ({
        domain: service.domain || "",
        provider_id: service.provider_id || "",
        plan_id: service.plan_id || "",
        quantity: service.quantity ?? "",
        rate: service.rate ?? "",
        renewal_date: service.renewal_date?.slice(0, 10) || "",
      })),
    our_service_plan_detail: services
      .filter(
        (service) =>
          service.is_info !== true &&
          service.is_info !== 1 &&
          service.is_info !== "1",
      )
      .map((service) => ({
        provider_id: service.provider_id ?? null,
        plan_id: service.plan_id ?? null,
        quote_period: service.quote_period || "",
        sku: service.sku || "",
        quantity: service.quantity ?? null,
        rate: service.rate ?? "",
      })),
    additional_contact: Array.isArray(leadData.contacts)
      ? leadData.contacts.map((contact) => ({
          name: contact.name || "",
          designation: contact.designation || "",
          email: contact.email || "",
          mobile: contact.mobile || "",
        }))
      : [],
    lead_specification: {
      lead_priority: leadData.lead_priority || "",
      lead_status: leadData.lead_status || "",
      lead_bifurcation: leadData.lead_bifurcation || "",
      lead_source: leadData.lead_source || "",
      assigned_to: leadData.assigned_to || "",
    },
    follow_up_detail: {
      follow_up_date: formatDateTimeInput(leadData.follow_up_date),
      follow_up_note: leadData.follow_up_note || "",
    },
    document_detail: {
      document_type: "PAN Card",
      files: [],
    },
    documents: leadData.document ? [leadData.document] : [],
  };
};

export default function LeadDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isPopupVisible = useSelector(selectIsPopupVisble);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    customer_detail: {
      salutation: "",
      name: "",
      designation: "",
      email: "",
      mobile_code: "91",
      mobile: "",
      company_name: "",
      industry: "",
      no_of_employees: "",
      gstin: "",
      business_type: "new",
    },
    address_information: {
      mailing_address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    domain: {
      domain_type: "no-domain",
      domain: "",
      domain_period: "",
      domain_rate: null,
      sac: "",
      domain_start: "",
      domain_end: "",
      domain_renewal_date: "",
    },
    current_service_info: [
      {
        domain: "",
        provider_id: "",
        plan_id: "",
        quantity: "",
        rate: "",
        renewal_date: "",
      },
    ],
    our_service_plan_detail: [
      {
        provider_id: null,
        plan_id: null,
        quote_period: "",
        sku: "",
        quantity: null,
        rate: "",
      },
    ],
    additional_contact: [
      {
        name: "",
        designation: "",
        email: "",
        mobile: "",
      },
    ],
    lead_specification: {
      lead_priority: "",
      lead_status: "",
      lead_bifurcation: "",
      lead_source: "",
      assigned_to: "",
    },
    follow_up_detail: {
      follow_up_date: "",
      follow_up_note: "",
    },
    document_detail: {
      document_type: "PAN Card",
      files: [],
    },
    documents: [],
  });

  console.log(formData);

  const { data: getLeadDeatils } = useGetSingleLeadDeatilsQuery(
    {
      lead_id: router?.query?.slug,
    },
    { skip: !router?.query?.slug },
  );
  const { data: apiDropdownData } = useGetDdDataQuery();

  const leadData = getLeadDeatils?.data?.lead || {};
  const contacts = Array.isArray(leadData.contacts) ? leadData.contacts : [];
  const services = Array.isArray(leadData.services) ? leadData.services : [];
  const currentServices = services.filter(
    (service) =>
      service.is_info === true ||
      service.is_info === 1 ||
      service.is_info === "1",
  );
  const ourServices = services.filter(
    (service) =>
      service.is_info !== true &&
      service.is_info !== 1 &&
      service.is_info !== "1",
  );
  const leadId = leadData.id || router?.query?.slug;

  const handleFormChange = (
    e,
    section,
    index = null,
    stateField = e.target.name,
  ) => {
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? null
          : Number(e.target.value)
        : e.target.value;
    const serviceSections = ["current_service_info", "our_service_plan_detail"];
    const selectedPlan =
      stateField === "plan_id"
        ? Object.values(apiDropdownData?.data?.options?.plans || {})
            .flat()
            .find((plan) => String(plan.id) === String(value))
        : null;

    setFormData((prev) => {
      // Handle array sections
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index
              ? {
                  ...item,
                  [stateField]: value,
                  ...(serviceSections.includes(section) &&
                  stateField === "provider_id"
                    ? { plan_id: "", sku: "" }
                    : {}),
                  ...(serviceSections.includes(section) &&
                  stateField === "plan_id"
                    ? { sku: selectedPlan?.sku || selectedPlan?.slug || "" }
                    : {}),
                }
              : item,
          ),
        };
      }

      // Handle object sections
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [stateField]: value,
        },
      };
    });
  };

  const handleDocumentFilesChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      document_detail: {
        ...prev.document_detail,
        files,
      },
    }));
  };

  const statusBg = (status) => {
    const renamedStatus = status?.toLowerCase();

    if (renamedStatus === "new") {
      return "var(--success-text)";
    } else if (renamedStatus === "normal") {
      return "var(--purple)";
    } else if (
      renamedStatus === "contacted" ||
      renamedStatus === "qualified" ||
      renamedStatus === "cold"
    ) {
      return "var(--primary)";
    } else if (
      renamedStatus === "coverted" ||
      renamedStatus === "warm" ||
      renamedStatus === "nurturing"
    ) {
      return "var(--orange)";
    } else if (renamedStatus === "closed" || renamedStatus === "hot") {
      return "var(--danger)";
    } else {
      return "gray";
    }
  };

  const openPopup = (popup, item = null) => {
    let popupItem = item ? { ...item } : null;

    if (leadData.id) {
      const nextFormData = createLeadFormData(leadData);

      if (popup === "add-contact") {
        if (popupItem?.type === "contact") {
          popupItem = {
            ...popupItem,
            index: popupItem.index ?? nextFormData.additional_contact.length,
          };
        } else {
          popupItem = {
            type: "contact",
            index: nextFormData.additional_contact.length,
          };
          nextFormData.additional_contact.push({
            name: "",
            designation: "",
            email: "",
            mobile: "",
          });
        }
      } else if (popup === "add-current-service") {
        if (popupItem?.type === "current-service") {
          popupItem = {
            ...popupItem,
            index: popupItem.index ?? nextFormData.current_service_info.length,
          };
        } else {
          popupItem = {
            type: "current-service",
            index: nextFormData.current_service_info.length,
          };
          nextFormData.current_service_info.push({
            domain: "",
            provider_id: "",
            plan_id: "",
            quantity: 1,
            rate: "",
            renewal_date: "",
          });
        }
      } else if (popup === "add-our-service") {
        if (popupItem?.type === "our-service") {
          popupItem = {
            ...popupItem,
            index:
              popupItem.index ?? nextFormData.our_service_plan_detail.length,
          };
        } else {
          popupItem = {
            type: "our-service",
            index: nextFormData.our_service_plan_detail.length,
          };
          nextFormData.our_service_plan_detail.push({
            provider_id: null,
            plan_id: null,
            quote_period: "Yearly",
            sku: "",
            quantity: 1,
            rate: "",
          });
        }
      }

      setFormData(nextFormData);
    }
    setEditingItem(popupItem);
    dispatch(setIsPopupVisible(popup));
  };

  const closePopup = () => {
    setEditingItem(null);
    dispatch(setIsPopupVisible(""));
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
                    Status :
                    <span
                      className={`${styles?.leadStatus} `}
                      style={{
                        background: statusBg(leadData?.lead_status),
                      }}
                    >
                      {displayValue(leadData?.lead_status)}
                    </span>
                  </span>

                  <span>
                    Category :
                    <span
                      className={styles?.leadStatus}
                      style={{
                        background: statusBg(leadData?.lead_category),
                      }}
                    >
                      {displayValue(leadData?.lead_category)}
                    </span>
                  </span>

                  <span>
                    Created On :<span>{formatDate(leadData?.created_at)}</span>
                  </span>
                </div>

                <div className={styles.leadCompanyHeader}>
                  <h3>{displayValue(leadData?.company_name)}</h3>

                  <button
                    type="button"
                    className={styles.editLeadBtn}
                    onClick={() => openPopup("add-details-popup")}
                  >
                    <FaPencil />
                    Add / Edit Details
                  </button>
                </div>

                <div className={styles.leadInfoGrid}>
                  <div className={styles.infoItem}>
                    <label>Full Name</label>
                    <p>{displayValue(leadData?.name)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Designation</label>
                    <p>{displayValue(leadData?.designation)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Contact No.</label>
                    <p>
                      {leadData?.mobile
                        ? `+${leadData?.mobile_code || ""} ${leadData.mobile}`
                        : "-"}
                    </p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Email</label>
                    <p>{displayValue(leadData?.email)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Industry</label>
                    <p>{displayValue(leadData?.industry)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Number of Employee</label>
                    <p>{displayValue(leadData?.no_of_employees)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>GSTIN</label>
                    <p>{displayValue(leadData?.gstin)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Address</label>
                    <p>
                      {[
                        leadData?.mailing_address,
                        leadData?.city,
                        leadData?.state,
                        leadData?.pincode,
                        leadData?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Domain</label>
                    <p>{displayValue(leadData?.domain?.domain)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Business Type</label>
                    <p>{displayValue(leadData?.business_type)}</p>
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
                    onClick={() => openPopup("add-contact")}
                    className={styles.addCreditBtn}
                  >
                    <GoPlus />
                    Add Contact
                  </a>
                </div>

                <div className={styles.contactInformationSection}>
                  {contacts.length ? (
                    contacts.map((contact, index) => (
                      <div
                        className={styles.leadContactCard}
                        key={contact.id ?? `${contact.name}-${index}`}
                      >
                        <div
                          className={`${styles.serviceActions} ${styles.actionAbsolute}`}
                        >
                          <button
                            type="button"
                            title="Delete contact"
                            aria-label={`Delete contact ${contact.name || ""}`}
                          >
                            <FiTrash2 />
                          </button>
                          <button
                            type="button"
                            title="Edit contact"
                            aria-label={`Edit contact ${contact.name || ""}`}
                            onClick={() =>
                              openPopup("add-contact", {
                                type: "contact",
                                data: contact,
                                index,
                              })
                            }
                          >
                            <FaPencil />
                          </button>
                        </div>
                        <h4>{displayValue(contact.name)}</h4>

                        <div className={styles.contactInfoGrid}>
                          <div>
                            <label>Full Name</label>
                            <p>{displayValue(contact.name)}</p>
                          </div>

                          <div>
                            <label>Designation</label>
                            <p>{displayValue(contact.designation)}</p>
                          </div>

                          <div>
                            <label>Email</label>
                            <p>{displayValue(contact.email)}</p>
                          </div>

                          <div>
                            <label>Contact No.</label>
                            <p>{displayValue(contact.mobile)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No contacts added.</p>
                  )}
                </div>
              </div>
            </section>

            {/* current service */}

            <section className="common-table-section lead-show-full">
              <div className="common-table-card p-16">
                <div className={styles.cardHeader}>
                  <h3>CURRENT SERVICE (INFO)</h3>
                  <a
                    onClick={() => openPopup("add-current-service")}
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
                {currentServices.length ? (
                  currentServices.map((service, index) => (
                    <div
                      className={`${styles.serviceRequiredCard} ${styles.serviceRequiredCard2}`}
                      key={service.id}
                    >
                      <div
                        className={`${styles.serviceActions} ${styles.actionAbsolute}`}
                      >
                        <button
                          type="button"
                          title="Delete current service"
                          aria-label="Delete current service"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          type="button"
                          title="Edit current service"
                          aria-label="Edit current service"
                          onClick={() =>
                            openPopup("add-current-service", {
                              type: "current-service",
                              data: service,
                              index,
                            })
                          }
                        >
                          <FaPencil />
                        </button>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Domain</label>
                        <p>{displayValue(service.domain)}</p>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Service</label>
                        <p>{displayValue(service.provider?.name)}</p>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Plan Name</label>
                        <p>{displayValue(service.plan?.name)}</p>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Current Price</label>
                        <p>
                          {service.rate === null || service.rate === undefined
                            ? "-"
                            : `₹ ${service.rate}`}
                        </p>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Renewal Date</label>
                        <p>{formatDate(service.renewal_date)}</p>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>No of Users</label>
                        <p>{displayValue(service.quantity)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No current service information.</p>
                )}
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
                    onClick={() => openPopup("add-our-service")}
                    className={styles.addCreditBtn}
                  >
                    <GoPlus />
                    Add Service
                  </a>
                </div>

                {ourServices.length ? (
                  ourServices.map((service, index) => (
                    <div
                      className={styles.serviceRequiredCard}
                      key={service.id}
                    >
                      <div
                        className={`${styles.serviceActions} ${styles.actionAbsolute}`}
                      >
                        <button
                          type="button"
                          title="Delete service"
                          aria-label="Delete service"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          type="button"
                          title="Edit service"
                          aria-label="Edit service"
                          onClick={() =>
                            openPopup("add-our-service", {
                              type: "our-service",
                              data: service,
                              index,
                            })
                          }
                        >
                          <FaPencil />
                        </button>
                      </div>
                      <div className={styles.serviceItem}>
                        <label>Service</label>
                        <p>{displayValue(service.provider?.name)}</p>
                      </div>

                      <div className={styles.serviceItem}>
                        <label>Plan Name</label>
                        <p>{displayValue(service.plan?.name)}</p>
                      </div>

                      <div className={styles.serviceItem}>
                        <label>Quot Period</label>
                        <p>
                          {displayValue(
                            service.quote_period || service.plan?.billing_cycle,
                          )}
                        </p>
                      </div>

                      <div className={styles.serviceItem}>
                        <label>Renewal Date</label>
                        <p>{formatDate(service.renewal_date)}</p>
                      </div>

                      <div className={styles.serviceItem}>
                        <label>Rate</label>
                        <p>
                          {service.rate === null || service.rate === undefined
                            ? "-"
                            : `₹ ${service.rate}`}
                        </p>
                      </div>

                      <div className={styles.serviceItem}>
                        <label>No of Users</label>
                        <p>{displayValue(service.quantity)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No services added.</p>
                )}

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

                  <a
                    onClick={() => openPopup("add-document")}
                    className={styles.addCreditBtn}
                  >
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

                  {leadData.document ? (
                    <div className={styles.downloadRow}>
                      <div className={styles.downloadFile}>
                        {displayValue(
                          typeof leadData.document === "string"
                            ? leadData.document
                            : leadData.document.name,
                        )}
                      </div>
                      <div>-</div>
                      <div>
                        {formatDate(
                          typeof leadData.document === "object"
                            ? leadData.document.created_at
                            : null,
                        )}
                      </div>
                      <div>-</div>
                    </div>
                  ) : (
                    <p>No documents added.</p>
                  )}
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

                <div className="followup-form" key={leadData.id || "loading"}>
                  {/* Lead Category */}

                  <div className="form-group">
                    <label>
                      Lead Category <span>*</span>
                    </label>

                    <div className="">
                      <select
                        defaultValue={
                          leadData.lead_category || leadData.lead_priority || ""
                        }
                      >
                        <option value="">Select Category</option>
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
                      <select defaultValue={leadData.lead_source || ""}>
                        <option value="">Select Source</option>
                        <option>New</option>
                        <option>Website</option>
                        <option>Reference</option>
                        <option>Tele Caller</option>
                        <option>Social Media</option>
                        <option>LinkedIn</option>
                      </select>
                    </div>
                  </div>

                  {/* Lead Status */}

                  <div className="form-group">
                    <label>
                      Lead Status <span>*</span>
                    </label>

                    <div className="">
                      <select defaultValue={leadData.lead_status || ""}>
                        <option value="">Select Status</option>
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Converted</option>
                        <option>Closed</option>
                        <option>Nurturing</option>
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

                      <span>{displayValue(leadData.assigned_to)}</span>

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
                        type="datetime-local"
                        defaultValue={formatDateTimeInput(
                          leadData.follow_up_date,
                        )}
                        placeholder="dd/mm/yy - hh:mm"
                      />
                    </div>
                  </div>

                  {/* Note */}

                  <div className="form-group">
                    <label>
                      Note <span>*</span>
                    </label>

                    <textarea defaultValue={leadData.follow_up_note || ""} />
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
        <CustomPopup onClose={closePopup}>
          <EditDetailForm
            leadData={leadData}
            formData={formData}
            setFormData={setFormData}
            handleFormChange={handleFormChange}
            apiDropdownData={apiDropdownData}
          />
        </CustomPopup>
      )}
      {isPopupVisible === "add-contact" && (
        <CustomPopup onClose={closePopup}>
          <AddContactForm
            leadId={leadId}
            initialData={
              editingItem?.type === "contact" ? editingItem.data : null
            }
            formData={formData}
            handleFormChange={handleFormChange}
            formIndex={editingItem?.index}
            formSection="additional_contact"
          />
        </CustomPopup>
      )}
      {isPopupVisible === "add-current-service" && (
        <CustomPopup onClose={closePopup}>
          <AddCurrentServiceForm
            leadId={leadId}
            apiDropdownData={apiDropdownData}
            initialData={
              editingItem?.type === "current-service" ? editingItem.data : null
            }
            formData={formData}
            handleFormChange={handleFormChange}
            formIndex={editingItem?.index}
            formSection="current_service_info"
          />
        </CustomPopup>
      )}
      {isPopupVisible === "add-our-service" && (
        <CustomPopup onClose={closePopup}>
          <AddOurService
            leadId={leadId}
            apiDropdownData={apiDropdownData}
            initialData={
              editingItem?.type === "our-service" ? editingItem.data : null
            }
            formData={formData}
            handleFormChange={handleFormChange}
            formIndex={editingItem?.index}
            formSection="our_service_plan_detail"
          />
        </CustomPopup>
      )}
      {isPopupVisible === "add-document" && (
        <CustomPopup onClose={closePopup}>
          <AddDocumentForm
            leadId={leadId}
            formData={formData}
            handleFormChange={handleFormChange}
            onFilesChange={handleDocumentFilesChange}
          />
        </CustomPopup>
      )}
    </>
  );
}
