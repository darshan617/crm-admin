"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/components/quotation/Quotation.module.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import {
  LuSearch,
  LuRotateCcw,
  LuChevronRight,
  LuChevronLeft,
} from "react-icons/lu";

const quotations = [
  {
    id: 46,
    code: "TCCPLQ00043A-B",
    avatar: { letter: "E", color: "purple" },
    company: "Example Corp",
    contact: "John Doe",
    role: "Manager",
    plan: "Google Workspace Business Plus",
    licenses: 50,
    term: "Yearly",
    amount: "₹ 908,616.00",
    discount: "10.92%",
    status: { label: "Not shared", type: "pending" },
    assignee: { name: "Admin", letter: "A" },
    note: { prefix: "Follow up on", value: "01 Nov, 2026 12:00 AM" },
    approved: 0,
    locked: 0,
    email: "johnn@example.com",
  },
  {
    id: 45,
    code: "TCCPLQ00043A-A",
    avatar: { letter: "E", color: "blue" },
    company: "Example Corp",
    contact: "John Doe",
    role: "Manager",
    plan: "Google Workspace Business Plus",
    licenses: 50,
    term: "Yearly",
    amount: "₹ 918,000.00",
    discount: "10%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Admin", letter: "A" },
    note: { text: "Shared 13 Oct, 2026 12:56 PM" },
    approved: 1,
    locked: 1,
    email: "johnn@example.com",
  },
  {
    id: 44,
    code: "TCCPLQ00039A-A",
    avatar: { letter: "M", color: "red" },
    company: "MALAD RESIDENCY",
    contact: "Kapil Maurya",
    role: "Project Manager",
    plan: "Microsoft 365 Business Standard (no Teams)",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 6,224.40",
    discount: "22%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Pratik V", letter: "P" },
    note: { text: "Shared 12 Oct, 2026 01:49 PM" },
    approved: 1,
    locked: 1,
    email: "kapil@goyalinfotech.com",
  },
  {
    id: 43,
    code: "TCCPLQ00043A",
    avatar: { letter: "E", color: "yellow" },
    company: "Example Corp",
    contact: "John Doe",
    role: "Manager",
    plan: "Google Workspace Business Plus",
    licenses: 50,
    term: "Yearly",
    amount: "₹ 816,000.00",
    discount: "20%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Admin", letter: "A" },
    note: { text: "Shared 05 Oct, 2026 05:43 PM" },
    approved: 1,
    locked: 1,
    email: "johnn@example.com",
  },
  {
    id: 42,
    code: "TCCPLQ00042A",
    avatar: { letter: "M", color: "teal" },
    company: "MINISTRY OF RAILWAYS",
    contact: "Sushil",
    role: "Jr. PHP Laravel Developer",
    plan: "Microsoft 365 Apps for business",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 8,764.80",
    discount: "12%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Darshan Bane", letter: "D" },
    note: { text: "Shared 05 Oct, 2026 12:29 PM" },
    approved: 1,
    locked: 1,
    email: "sushil@goyalinfotech.com",
  },
  {
    id: 41,
    code: "TCCPLQ00041A",
    avatar: { letter: "K", color: "purple" },
    company: "KIRLOSKAR PNEUMATIC COMPANY LIMITED",
    contact: "Mittal Solanki",
    role: "Figma Designer",
    plan: "Microsoft 365 Business Standard (no Teams)",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 6,783.00",
    discount: "15%",
    status: { label: "Not shared", type: "pending" },
    assignee: { name: "Darshan Bane", letter: "D" },
    note: { prefix: "Follow up on", value: "29 Sep, 2026 12:00 AM" },
    approved: 0,
    locked: 0,
    email: "mittal@goyalinfotech.com",
  },
  {
    id: 40,
    code: "TCCPLQ00040A",
    avatar: { letter: "T", color: "blue" },
    company: "TIZZY PROPERTIES PRIVATE LIMITED",
    contact: "Govind",
    role: "P Manager",
    plan: "Google Workspace Business Standard",
    licenses: 23,
    term: "Yearly",
    amount: "₹ 268,272.00",
    discount: "10%",
    status: { label: "Shared", type: "pending" },
    assignee: { name: "Unassigned", letter: "U" },
    note: { text: "Shared 28 Sep, 2026 03:27 PM" },
    approved: 0,
    locked: 0,
    email: "websites@tizzycloud.com",
  },
  {
    id: 39,
    code: "TCCPLQ00039A",
    avatar: { letter: "M", color: "red" },
    company: "MALAD RESIDENCY",
    contact: "Kapil Maurya",
    role: "Project Manager",
    plan: "Microsoft 365 Business Standard (no Teams)",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 7,102.20",
    discount: "11%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Pratik V", letter: "P" },
    note: { text: "Shared 24 Sep, 2026 06:43 PM" },
    approved: 1,
    locked: 1,
    email: "kapil@goyalinfotech.com",
  },
  {
    id: 38,
    code: "TCCPLQ00038A",
    avatar: { letter: "I", color: "yellow" },
    company: "IT TEAMWORK",
    contact: "Janvi Singh",
    role: "Project Manager",
    plan: "Tizzy® Mail Corporate – 1 TB",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 7,040.00",
    discount: "12%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Pratik V", letter: "P" },
    note: { text: "Shared 24 Sep, 2026 06:29 PM" },
    approved: 1,
    locked: 1,
    email: "janvi@goyalinfotech.com",
  },
  {
    id: 37,
    code: "TCCPLQ00037A",
    avatar: { letter: "W", color: "teal" },
    company: "WNS GLOBAL SERVICES PRIVATE LIMITED",
    contact: "Pratik Vardekar",
    role: "Desinger",
    plan: "Microsoft 365 Apps for business",
    licenses: 1,
    term: "Yearly",
    amount: "₹ 8,266.80",
    discount: "17%",
    status: { label: "Approved", type: "approved" },
    assignee: { name: "Pratik V", letter: "P" },
    note: { text: "Shared 24 Sep, 2026 06:26 PM" },
    approved: 1,
    locked: 1,
    email: "pratik@goyalinfotech.com",
  },
];

const BASE = "https://superadmin.tizzygroup.com/crm/quotations";

const TABS = [
  { key: "all", label: "All" },
  { key: "discount", label: "Discount Status" },
  { key: "customer", label: "Customer Status" },
];

// --- Derived statuses -------------------------------------------------------
// Replace these with real fields from your API when available.
const getDiscountStatus = (q) => {
  // Discount-request status. Replace `discountStatus` with your API field
  // ("pending" | "approved" | "rejected" ...). Defaults to pending.
  const key = q.discountStatus ?? "pending";
  return { key, type: key, label: key.charAt(0).toUpperCase() + key.slice(1) };
};

// Customer Status tab lists only quotations that have been shared with the customer.
const isShared = (q) => q.status.label !== "Not shared";

const Quotation = () => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [discountFilter, setDiscountFilter] = useState("pending"); // pending | approved | all
  // Status dropdown value for the "All" and "Customer Status" tabs ("" = no filter)
  const [statusFilter, setStatusFilter] = useState({ all: "", customer: "" });

  const openQuotationMenu = (q, e) => {
    e.stopPropagation();
    // Hook up your actions menu here (view / history / edit / download / invoice)
    console.log("Quotation actions", {
      id: q.id,
      email: q.email,
      approved: q.approved,
      locked: q.locked,
      view: `${BASE}/${q.id}`,
      history: `${BASE}/${q.id}/activity`,
      edit: `${BASE}/${q.id}/edit`,
      download: `${BASE}/${q.id}/download`,
      invoiceDownload: `${BASE}/${q.id}/invoice/download`,
    });
  };

  const switchTab = (key) => {
    setActiveTab(key);
    setFilterOpen(false);
  };

  const visible = quotations.filter((q) =>
    `${q.code} ${q.company} ${q.contact}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const discountRows = visible.filter(
    (q) => discountFilter === "all" || getDiscountStatus(q).key === discountFilter
  );
  const discountCount = (key) =>
    quotations.filter((q) => key === "all" || getDiscountStatus(q).key === key)
      .length;
  const byStatus = (tab) => (q) =>
    !statusFilter[tab] || q.status.type === statusFilter[tab];
  const allRows = visible.filter(byStatus("all"));
  const customerRows = visible.filter(isShared).filter(byStatus("customer"));
  const shownRows =
    activeTab === "discount"
      ? discountRows
      : activeTab === "customer"
      ? customerRows
      : allRows;
  const pfx = activeTab === "customer" ? "es" : "crm"; // class prefix used by the backend markup

  const rowProps = (q) => ({
    key: q.id,
    className: "crm-quo-row table-row",
    style: { cursor: "pointer" },
    onClick: () => router.push(`/crm/quotations/${q.id}`),
  });

  const ContactCell = ({ q }) => (
    <td className="customer" data-label="Contact">
      <div className={`avatar ${q.avatar.color}`}>{q.avatar.letter}</div>
      <div>
        <h5>{q.company}</h5>
        <p>
          {q.contact}
          {q.role && ` - ${q.role}`}
        </p>
      </div>
    </td>
  );

  const ActionButton = ({ q }) => (
    <div className="actions">
      <button
        className="action-btn"
        type="button"
        title="Quotation actions"
        data-id={q.id}
        data-email={q.email}
        onClick={(e) => openQuotationMenu(q, e)}
      >
        <LuChevronRight size={24} aria-hidden="true" />
      </button>
    </div>
  );

  const EmptyRow = ({ cols }) => (
    <tr className="table-row">
      <td
        colSpan={cols}
        style={{ textAlign: "center", padding: "40px 16px", color: "#6b7280" }}
      >
        No quotation yet
      </td>
    </tr>
  );

  // ---------------- Tab: All ----------------
  const renderAll = (rows = allRows, statusOf = (q) => q.status) => (
    <table className="crm-quo-table">
      <thead>
        <tr className="table-head">
          <td className={styles.orderId}>Id</td>
          <td className={styles.orderId}>Contact Information</td>
          <td className={styles.orderId}>Plan</td>
          <td className="status-col">Status</td>
          <td className="status-col">Assigned To</td>
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.length === 0 && <EmptyRow cols={5} />}
        {rows.map((q) => (
          <tr {...rowProps(q)}>
            <td className={styles.orderId} data-label="Id">
              <span className="quotation-id">{q.code}</span>
            </td>
            <ContactCell q={q} />
            <td className="plan-info" data-label="Plan">
              <div className="plan-icon">
                <img
                  src="https://img.icons8.com/color/48/microsoft.png"
                  alt="Plan"
                />
              </div>
              <div>
                <h5>{q.plan}</h5>
                <p className="plan-meta">
                  <span>{q.licenses} Licenses</span>
                  <span>{q.term}</span>
                  <span>{q.amount}</span>
                  <span>{q.discount}</span>
                </p>
              </div>
            </td>
            <td className="status-col" data-label="Status">
              <span className={`badge ${statusOf(q).type}`}>
                {statusOf(q).label}
              </span>
            </td>
            <td className="plan-action" data-label="Assigned To">
              <div className={styles.assignedUser}>
                <div className="user-info">
                  <div className={styles.avatarFlex}>
                    <div className="mini-avatar primary">{q.assignee.letter}</div>
                    <h5>{q.assignee.name}</h5>
                  </div>
                  <small>
                    {q.note.prefix ? (
                      <>
                        {q.note.prefix}&nbsp;<strong>{q.note.value}</strong>
                      </>
                    ) : (
                      q.note.text
                    )}
                  </small>
                </div>
                <ActionButton q={q} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ---------------- Tab: Discount Status ----------------
  // Same table as "All", but the status badge is the discount-request status.
  const renderDiscount = () => renderAll(discountRows, getDiscountStatus);

  // ---------------- Tab: Customer Status ----------------
  const renderCustomer = () => (
    <table className="es-quo-table">
      <thead>
        <tr className="table-head">
          <td className={styles.orderId}>Id</td>
          <td className={styles.orderId}>Contact Information</td>
          <td className={styles.orderId}>Plan</td>
          <td className="status-col">Status</td>
          <td className="status-col">Invoice</td>
          <td className="status-col">Assigned To</td>
        </tr>
      </thead>
      <tbody className="table-body">
        {customerRows.length === 0 && <EmptyRow cols={6} />}
        {customerRows.map((q) => (
          <tr
            key={q.id}
            className="es-quo-row table-row"
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/crm/quotations/${q.id}/activity`)}
          >
            <td className={styles.orderId} data-label="Id">
              <span className="quotation-id">{q.code}</span>
            </td>
            <ContactCell q={q} />
            <td className="plan-info" data-label="Plan">
              <div className="plan-icon">
                <img
                  src="https://img.icons8.com/color/48/microsoft.png"
                  alt="Plan"
                />
              </div>
              <div>
                <h5>{q.plan}</h5>
                <p className="plan-meta">
                  <span>{q.licenses} Licenses</span>
                  <span>{q.term}</span>
                  <span>{q.amount}</span>
                  <span>{q.discount}</span>
                </p>
              </div>
            </td>
            <td className="status-col" data-label="Status">
              <span className={`badge ${q.status.type}`}>{q.status.label}</span>
            </td>
            <td className="status-col" data-label="Invoice">
              {q.approved ? <span className="badge approved">Approved</span> : "—"}
            </td>
            <td className="plan-action" data-label="Assigned To">
              <div className={styles.assignedUser}>
                <div className="user-info">
                  <div className={styles.avatarFlex}>
                    <div className="mini-avatar primary">{q.assignee.letter}</div>
                    <h5>{q.assignee.name}</h5>
                  </div>
                  <small>
                    {q.note.prefix ? (
                      <>
                        {q.note.prefix}&nbsp;<strong>{q.note.value}</strong>
                      </>
                    ) : (
                      q.note.text
                    )}
                  </small>
                </div>
                <ActionButton q={q} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="content">
      <div className="page-header">
        <div className="">
          <div className="breadcrumb welcome-text">
            <p>
              <a href="https://superadmin.tizzygroup.com/crm/dashboard">
                Dashboard
              </a>
              <span>/</span>{" "}
            </p>
          </div>
          <h2>Quotations </h2>
        </div>
        <div className={styles.crmActions}>
          <a href="" className={`${styles.crmActionBtn} ${styles.active}`}>
            <AiOutlineFileAdd size={20} />
            <span>Add Quotations</span>
          </a>
        </div>
      </div>

      <section className="common-table-section crm-quo-list">
        <div className={styles.crmLeadTabs}>
          {TABS.map((t) => (
            <a
              key={t.key}
              href="#"
              role="tab"
              aria-selected={activeTab === t.key}
              className={activeTab === t.key ? styles.active : ""}
              onClick={(e) => {
                e.preventDefault();
                switchTab(t.key);
              }}
            >
              {t.label}
            </a>
          ))}
        </div>

        <div className="common-table-card">
          <div className={`common-table-header ${pfx}-quo-header`}>
            <div className={`${pfx}-quo-title`}>
              <p>
                Showing <strong>{shownRows.length ? 1 : 0} - {shownRows.length}</strong> from{" "}
                <strong>{shownRows.length}</strong> Quotations
              </p>
            </div>

            <form
              className="table-search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                id="partnerSearch"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Quotation"
                autoComplete="off"
              />
              <LuSearch size={24} aria-hidden="true" />
            </form>
          </div>

          <form
            method="GET"
            action="/crm/quotations"
            className={`table-filter-wrap ${filterOpen ? "" : ""}`}
            id="filterPanel"
            style={{ display: filterOpen ? undefined : "none" }}
          >
            <input
              type="hidden"
              name="tab"
              value={activeTab === "customer" ? "email" : activeTab}
            />
            <div className="filter-grid">
              <div className="filter-group">
                <h6>Date Type :</h6>
                <div className="filter-options">
                  <select name="date_type" defaultValue="">
                    <option value="">Select</option>
                    <option value="created">Created Date</option>
                    <option value="sent">Shared Date</option>
                    <option value="follow_up">Follow Up Date</option>
                  </select>
                </div>
              </div>

              <div className="filter-group">
                <h6>Date Range :</h6>
                <div className="date-range">
                  <div className="date-input">
                    <input type="date" name="from" defaultValue="" />
                  </div>
                  <div className="date-input">
                    <input type="date" name="to" defaultValue="" />
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h6>
                  {activeTab === "discount" ? "Discount Status :" : "Status :"}
                </h6>
                <div className="filter-options">
                  <select
                    key={activeTab}
                    name="status"
                    {...(activeTab === "discount"
                      ? {
                          value: discountFilter === "all" ? "" : discountFilter,
                          onChange: (e) =>
                            setDiscountFilter(e.target.value || "all"),
                        }
                      : {
                          value: statusFilter[activeTab] ?? "",
                          onChange: (e) =>
                            setStatusFilter((f) => ({
                              ...f,
                              [activeTab]: e.target.value,
                            })),
                        })}
                  >
                    <option value="">Select</option>
                    {activeTab === "discount" ? (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                        <option value="accepted">Accepted</option>
                      </>
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                        <option value="accepted">Accepted</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="filter-group filter-action-group">
                <h6>&nbsp;</h6>
              </div>
            </div>
          </form>

          <div className="table-filter">
            <div className="border-line"></div>
            <button
              className={`filter-btn ${filterOpen ? "is-open" : ""}`}
              id="toggleFilter"
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
            >
              {filterOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M9 3L3 9M3 3L9 9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
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
              )}
              <span>{filterOpen ? "Close" : "Filters"}</span>
            </button>
            <Link
              href="/crm/quotations"
              className="filter-btn"
              id="resetFilters"
              role="button"
              style={{ display: filterOpen ? undefined : "none" }}
              onClick={() => {
                setSearch("");
                setStatusFilter({ all: "", customer: "" });
              }}
            >
              <LuRotateCcw size={15} aria-hidden="true" />
              <span>Reset</span>
            </Link>
          </div>

          {activeTab === "discount" && (
            <div className={styles.partnerTabsWrap}>
              <div className={styles.partnerTabs}>
                {[
                  ["pending", "Pending Requests"],
                  ["approved", "Approved Requests"],
                  ["all", "All Requests"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.partnerTab} ${
                      discountFilter === key ? styles.active : ""
                    }`}
                    onClick={() => setDiscountFilter(key)}
                  >
                    {label} (<span className="tab-count">{discountCount(key)}</span>)
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "all" && renderAll()}
          {activeTab === "discount" && renderDiscount()}
          {activeTab === "customer" && renderCustomer()}

          <div className="table-pagination">
            <a href="#" className="page-btn">
              <LuChevronLeft size={24} aria-hidden="true" />
            </a>
            <a href="#" className="page-btn active">
              1
            </a>
            <a href="#" className="page-btn">
              <LuChevronRight size={24} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quotation;