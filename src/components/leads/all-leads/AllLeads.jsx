"use client";
import { useState } from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import styles from "@/components/leads/all-leads/AllLeads.module.css";

/* ---------------- DATA ---------------- */

const TABS = [
  { label: "All Leads", href: "#", active: true },
  { label: "JD Leads", href: "#", active: false },
  { label: "Exhibition Leads", href: "#", active: false },
];

const FILTER_SELECTS = [
  {
    label: "Date Type",
    options: ["Created Date", "Follow Up Date", "Updated Date"],
  },
  {
    label: "Status",
    options: [
      "New",
      "Contacted",
      "Qualified",
      "Quotation Sent",
      "Negotiation",
      "Won",
      "Lost",
      "Nurturing",
    ],
  },
  {
    label: "Employee",
    options: [
      "Pranali Jadhav",
      "Rohit Patil",
      "Nisha Singh",
      "Aakash Menon",
      "Sneha Patil",
      "Aniket Deshmukh",
      "Karan Choudhury",
      "Preeti Sinha",
    ],
  },
  {
    label: "Lead Bifurcation",
    options: ["New", "Existing", "Follow Up", "Converted", "Closed"],
  },
  {
    label: "Lead Priority",
    options: ["Hot", "Warm", "Cold"],
  },
];

const DATE_RANGE_PLACEHOLDERS = ["From", "To"];

const TABLE_HEADINGS = [
  { label: "Customer Name", className: "" },
  { label: "Contact Information", className: "" },
  { label: "Status", className: styles.statusCol },
  { label: "Plan", className: "" },
];

const LEADS = [
  {
    id: 1,
    avatarColor: "purple",
    company: "Wilson Enterprises Pvt. Ltd.",
    person: "Wilson Thomas - Owner",
    email: "wilson@wilsonenterprises.com",
    phone: "+91-981234 56780",
    status: "New",
    badge: "new",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/leads/leads-details",
  },
  {
    id: 2,
    avatarColor: "blue",
    company: "Maria Trading Co.",
    person: "Maria Gonzalez - Manager",
    email: "maria@mariatrading.com",
    phone: "+91-987654 32100",
    status: "Contacted",
    badge: "contacted",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 3,
    avatarColor: "teal",
    company: "Ali Solutions Ltd.",
    person: "Ali Chen - CEO",
    email: "info@alisolutions.com",
    phone: "+91-998877 66554",
    status: "Qualified",
    badge: "qualified",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 4,
    avatarColor: "purple",
    company: "Samantha Foods Inc.",
    person: "Samantha Lee - Director",
    email: "hello@samanthafoods.com",
    phone: "+91-945612 34785",
    status: "Quotation Sent",
    badge: "quotation-sent",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 5,
    avatarColor: "blue",
    company: "Michael Technologies",
    person: "Michael Tran - Sales Head",
    email: "info@michaeltech.com",
    phone: "+91-956789 43210",
    status: "Negotiation",
    badge: "negotiation",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 6,
    avatarColor: "teal",
    company: "Royal Business Solutions",
    person: "Rahul Sharma - Director",
    email: "rahul@royalbusiness.com",
    phone: "+91-912345 67890",
    status: "Won",
    badge: "won",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 7,
    avatarColor: "red",
    company: "Tanvi Designs Studio",
    person: "Tanvi Roy - Founder",
    email: "contact@tanvidesigns.com",
    phone: "+91-978654 32125",
    status: "Lost",
    badge: "lost",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
  {
    id: 8,
    avatarColor: "yellow",
    company: "Nexus Innovations",
    person: "Vivek Sharma - Business Analyst",
    email: "info@nexusinnovations.com",
    phone: "+91-934567 89123",
    status: "Nurturing",
    badge: "nurturing",
    assignedTo: "Pranali Jadhav",
    followUp: "29 Jan, 2026 2:56 PM",
    href: "/crm-lead-details",
  },
];

const PAGES = [1, 2, 3, 4, 5];

const TOTAL_CUSTOMERS = 124;

export default function AllLeads() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === LEADS.length ? [] : LEADS.map((l) => l.id),
    );
  };

  return (
    <section className={styles.commonTableSection}>
      <div className={styles.crmLeadTabs}>
        {TABS.map((tab) => (
          <a
            key={tab.label}
            href={tab.href}
            className={tab.active ? styles.active : ""}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="common-table-card">
        {/* Header */}
        <div className={`${styles.commonTableHeader} ${styles.crmLeadHeader}`}>
          <div className={styles.crmLeadTitle}>
            <p>
              Showing <strong>1 - 10</strong> from{" "}
              <strong>{TOTAL_CUSTOMERS}</strong> Customers
            </p>

            <span className="header-divider"></span>

            <label className={styles.itemsSelected}>
              <input
                type="checkbox"
                checked={
                  LEADS.length > 0 && selectedIds.length === LEADS.length
                }
                onChange={toggleAll}
              />

              <div>
                <span>{selectedIds.length}</span>/{TOTAL_CUSTOMERS} Items
                Selected
              </div>
            </label>
          </div>

          <div className={`${styles.tableSearch} table-search`}>
            <input
              type="text"
              id="partnerSearch"
              placeholder="Search Partners"
              style={{ outline: "none" }}
            />

            <CiSearch size={16} />
          </div>
        </div>

        {/* Filter Panel */}
        <div
          className={`${styles.tableFilterWrap} ${
            showFilters ? styles.active : ""
          }`}
          id="filterPanel"
        >
          <div className={styles.filterGrid}>
            {/* Date Type */}
            <div className={styles.filterGroup}>
              <h6>{FILTER_SELECTS[0].label} :</h6>

              <div className={styles.filterOptions}>
                <select defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>

                  {FILTER_SELECTS[0].options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className={styles.filterGroup}>
              <h6>Date Range :</h6>

              <div className={styles.dateRange}>
                {DATE_RANGE_PLACEHOLDERS.map((ph) => (
                  <div className={styles.dateInput} key={ph}>
                    <input
                      type="text"
                      placeholder={ph}
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                    />

                    <LuCalendarDays size={16} />
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining Filters */}
            {FILTER_SELECTS.slice(1).map((f) => (
              <div className={styles.filterGroup} key={f.label}>
                <h6>{f.label} :</h6>

                <div className={styles.filterOptions}>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>

                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Button */}
        <div className="table-filter">
          <div className="border-line"></div>

          <button
            className="filter-btn"
            id="toggleFilter"
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
            >
              <path
                d="M0.75 0.75H10.75M2.75 4.25H8.75M4.25 7.75H7.25"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>Filters</span>
          </button>
        </div>

        {/* Table */}
        <table className={`${styles.crmLeadTable} crm-lead-table`}>
          <thead>
            <tr className={`${styles.tableHead} table-head`}>
              <td className="select-col">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    LEADS.length > 0 && selectedIds.length === LEADS.length
                  }
                  onChange={toggleAll}
                />
              </td>

              {TABLE_HEADINGS.map((h) => (
                <td key={h.label} className={h.className || undefined}>
                  {h.label}
                </td>
              ))}
            </tr>
          </thead>

          <tbody className="table-body">
            {LEADS.map((lead) => (
              <tr
                className={`${styles.crmLeadRow} crm-lead-row table-row`}
                key={lead.id}
              >
                {/* Checkbox */}
                <td className="select-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead.id)}
                    onChange={() => toggleOne(lead.id)}
                  />
                </td>

                {/* Customer */}
                <td className={styles.customer}>
                  <div className={`avatar ${lead.avatarColor}`}>
                    {lead.company.charAt(0)}
                  </div>

                  <div>
                    <h5>{lead.company}</h5>
                    <p>{lead.person}</p>
                  </div>
                </td>

                {/* Contact */}
                <td className={styles.contactInfo}>
                  <div>
                    <h5>{lead.email}</h5>
                    <p>{lead.phone}</p>
                  </div>
                </td>

                {/* Status */}
                <td className={styles.statusCol}>
                  <span className={`badge ${lead.badge}`}>{lead.status}</span>
                </td>

                {/* Plan / Assigned User */}
                <td className="plan-action">
                  <div className={styles.assignedUser}>
                    <div className="user-info">
                      <div className={styles.avatarFlex}>
                        <div className="mini-avatar primary">
                          {lead.assignedTo.charAt(0)}
                        </div>

                        <h5>{lead.assignedTo}</h5>
                      </div>

                      <small>
                        Follow up on&nbsp;
                        <strong>{lead.followUp}</strong>
                      </small>
                    </div>

                    <div className="actions">
                      <Link href={lead.href} className="action-btn">
                        <HiChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.tablePagination}>
          <a href="#" className={styles.pageBtn}>
            <HiChevronLeft size={16} />
          </a>

          {PAGES.map((p) => (
            <a
              href="#"
              key={p}
              className={`${styles.pageBtn} ${p === 1 ? styles.active : ""}`}
            >
              {p}
            </a>
          ))}

          <a href="#" className={styles.pageBtn}>
            <HiChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
