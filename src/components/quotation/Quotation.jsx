"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineFileAdd } from "react-icons/ai";
import {
  LuSearch,
  LuRotateCcw,
  LuChevronRight,
  LuEye,
  LuHistory,
  LuPencil,
  LuDownload,
  LuMail,
  LuCornerUpRight,
} from "react-icons/lu";
import styles from "@/components/quotation/Quotation.module.css";
import { useGetAllQuotationsQuery } from "@/redux/apis/quotationApi";
import Pagination from "@/common-components/pagination/Pagination";

const TABS = [
  { key: "all", label: "All" },
  { key: "discount", label: "Discount Status" },
  { key: "customer", label: "Customer Status" },
];

const DISCOUNT_TABS = [
  ["pending", "Pending Requests"],
  ["approved", "Approved Requests"],
  ["all", "All Requests"],
];

const STATUS_OPTIONS = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "accepted",
];

const getStatus = (quotation, fallback = "-") => {
  const status =
    quotation.status ??
    quotation.quotation_status ??
    quotation.discount_status ??
    quotation.customer_status;

  if (typeof status === "string") return status;
  return status?.name || status?.label || fallback;
};

const getStatusClass = (status) =>
  String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

const getCompany = (quotation) => quotation.company_name || "-";
const getContact = (quotation) =>
  quotation.contact_name || quotation.name || quotation.email || "-";
const getAssignee = (quotation) =>
  quotation.assigned_to?.name ||
  quotation.assigned_to ||
  quotation.assignee?.name ||
  quotation.assignee ||
  "Unassigned";
const getFollowUp = (quotation) =>
  quotation.follow_up_date || quotation.shared_at || quotation.created_at || "";
const getAmount = (quotation) =>
  quotation.total_amount ?? quotation.grand_total ?? quotation.amount ?? "";
const getPlan = (quotation) =>
  quotation.plan_name || quotation.product_name || quotation.plan || "";
const getDiscountStatus = (quotation) =>
  quotation.discount_status || quotation.discount_request_status || "pending";

const Quotation = () => {
  const router = useRouter();
  const [view, setView] = useState({
    filterOpen: false,
    activeTab: "all",
    search: "",
    discountFilter: "pending",
    statusFilter: { all: "", customer: "" },
    dateType: "",
    from: "",
    to: "",
    activeQuotationId: null,
    popupPosition: { top: 0, left: 0 },
  });

  const updateView = (updates) =>
    setView((current) => ({ ...current, ...updates }));

  const status =
    view.activeTab === "discount"
      ? view.discountFilter === "all"
        ? ""
        : view.discountFilter
      : view.statusFilter[view.activeTab] || "";
  const {
    data: quotationResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetAllQuotationsQuery({
    search: view.search,
    tab: view.activeTab,
    status,
    date_type: view.dateType,
    from: view.from,
    to: view.to,
    page: 1,
  });

  const quotations = Array.isArray(quotationResponse?.data?.quotations)
    ? quotationResponse.data.quotations
    : Array.isArray(quotationResponse?.data)
      ? quotationResponse.data
      : [];
  const pagination = quotationResponse?.data?.pagination;
  const total = pagination?.total ?? quotations.length;

  const selectTab = (activeTab) => updateView({ activeTab, filterOpen: false });

  const resetFilters = () =>
    updateView({
      search: "",
      discountFilter: "pending",
      statusFilter: { all: "", customer: "" },
      dateType: "",
      from: "",
      to: "",
    });

  const openQuotationMenu = (quotation, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 260;
    const popupHeight = 275;
    const left = Math.max(
      12,
      Math.min(rect.right - popupWidth, window.innerWidth - popupWidth - 12),
    );
    const top = Math.max(
      12,
      Math.min(rect.bottom + 8, window.innerHeight - popupHeight - 12),
    );
    updateView({
      popupPosition: { top, left },
      activeQuotationId:
        view.activeQuotationId === quotation.id ? null : quotation.id,
    });
  };

  const renderRows = (customerTab = false) => {
    const columnCount = customerTab ? 6 : 5;
    const rows = quotations;

    if (isError) {
      return (
        <tr className="table-row">
          <td colSpan={columnCount} role="alert">
            Unable to load quotations. Please try again.
          </td>
        </tr>
      );
    }
    if (isLoading || isFetching) {
      return (
        <tr className="table-row">
          <td colSpan={columnCount}>Loading quotations...</td>
        </tr>
      );
    }
    if (rows.length === 0) {
      return (
        <tr className="table-row">
          <td colSpan={columnCount}>No quotations found.</td>
        </tr>
      );
    }

    return rows?.map((quotation) => {
      const company = getCompany(quotation);
      const currentStatus = getStatus(quotation);
      const assignee = getAssignee(quotation);
      const discountStatus = getDiscountStatus(quotation);
      const rowStatus =
        view.activeTab === "discount" ? discountStatus : currentStatus;
      const contact = getContact(quotation);

      return (
        <tr
          key={quotation.id}
          className={`${customerTab ? "es" : "crm"}-quo-row table-row`}
          style={{ cursor: "pointer" }}
          onClick={() =>
            router.push(
              customerTab
                ? `/quotations/quotation-detail/${quotation.id}/activity`
                : "/quotations/quotation-detail",
            )
          }
        >
          <td className={styles.orderId} data-label="Id">
            <span className="quotation-id">
              {quotation.quotation_no || quotation.id}
            </span>
          </td>
          <td className="customer" data-label="Contact">
            <div className="avatar purple">{company.charAt(0)}</div>
            <div>
              <h5>{company}</h5>
              <p>{contact}</p>
            </div>
          </td>
          <td className="plan-info" data-label="Plan">
            <div className="plan-icon">
              <Image
                src="https://img.icons8.com/color/48/microsoft.png"
                alt="Plan"
                width={48}
                height={48}
                unoptimized
              />
            </div>
            <div>
              <h5>{getPlan(quotation) || "-"}</h5>
              <p className="plan-meta">
                {quotation.licenses != null && (
                  <span>{quotation.licenses} Licenses</span>
                )}
                {quotation.term && <span>{quotation.term}</span>}
                {getAmount(quotation) !== "" && (
                  <span>{getAmount(quotation)}</span>
                )}
                {quotation.discount != null && (
                  <span>{quotation.discount}</span>
                )}
              </p>
            </div>
          </td>
          <td className="status-col" data-label="Status">
            <span className={`badge ${getStatusClass(rowStatus)}`}>
              {rowStatus}
            </span>
          </td>
          {customerTab && (
            <td className="status-col" data-label="Invoice">
              {quotation.approved ? (
                <span className="badge approved">Approved</span>
              ) : (
                "—"
              )}
            </td>
          )}
          <td className="plan-action" data-label="Assigned To">
            <div className={styles.assignedUser}>
              <div className="user-info">
                <div className={styles.avatarFlex}>
                  <div className="mini-avatar primary">
                    {String(assignee).charAt(0)}
                  </div>
                  <h5>{assignee}</h5>
                </div>
                <small>{getFollowUp(quotation) || " "}</small>
              </div>
              <div className="actions">
                <button
                  className="action-btn"
                  type="button"
                  title="Quotation actions"
                  onClick={(event) => openQuotationMenu(quotation, event)}
                >
                  <LuChevronRight size={24} aria-hidden="true" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  const customerTab = view.activeTab === "customer";
  const tableClass = customerTab ? "es-quo-table" : "crm-quo-table";
  const activeQuotation = quotations.find(
    (quotation) => quotation.id === view.activeQuotationId,
  );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/">Dashboard</Link>
              <span>/</span>
            </p>
          </div>
          <h2>Quotations</h2>
        </div>
        <div className={styles.crmActions}>
          <Link
            href="/quotations/add-quotation"
            className={`${styles.crmActionBtn} ${styles.active}`}
          >
            <AiOutlineFileAdd size={20} />
            <span>Add Quotations</span>
          </Link>
        </div>
      </div>

      <section className="common-table-section crm-quo-list">
        <div className={styles.crmLeadTabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              href="#"
              role="tab"
              aria-selected={view.activeTab === tab.key}
              className={view.activeTab === tab.key ? styles.active : ""}
              onClick={(event) => {
                event.preventDefault();
                selectTab(tab.key);
                router?.push({
                  pathname: router?.pathname,
                  query: {
                    ...router?.query,
                    type: tab.key,
                    page_no: 1,
                    items_per_page: 10,
                  },
                });
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="common-table-card">
          <div
            className={`common-table-header ${
              customerTab ? "es" : "crm"
            }-quo-header`}
          >
            <div className={`${customerTab ? "es" : "crm"}-quo-title`}>
              <p>
                Showing <strong>{quotations.length}</strong> from{" "}
                <strong>{total}</strong> Quotations
              </p>
            </div>
            <form
              className="table-search"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="search"
                name="search"
                value={view.search}
                onChange={(event) => updateView({ search: event.target.value })}
                placeholder="Search by Quotation"
                autoComplete="off"
                className={styles.searchInput}
              />
              <LuSearch size={24} aria-hidden="true" />
            </form>
          </div>

          <div
            className="table-filter-wrap"
            id="filterPanel"
            style={{ display: view.filterOpen ? undefined : "none" }}
          >
            <div className="filter-grid">
              <div className="filter-group">
                <h6>Date Type :</h6>
                <div className="filter-options">
                  <select
                    value={view.dateType}
                    onChange={(event) =>
                      updateView({ dateType: event.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="created_at">Created Date</option>
                    <option value="sent">Shared Date</option>
                    <option value="follow_up">Follow Up Date</option>
                  </select>
                </div>
              </div>
              <div className="filter-group">
                <h6>Date Range :</h6>
                <div className="date-range">
                  <div className="date-input">
                    <input
                      aria-label="From date"
                      type="date"
                      value={view.from}
                      onChange={(event) =>
                        updateView({ from: event.target.value })
                      }
                    />
                  </div>
                  <div className="date-input">
                    <input
                      aria-label="To date"
                      type="date"
                      value={view.to}
                      onChange={(event) =>
                        updateView({ to: event.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="filter-group">
                <h6>
                  {view.activeTab === "discount"
                    ? "Discount Status :"
                    : "Status :"}
                </h6>
                <div className="filter-options">
                  <select
                    value={
                      view.activeTab === "discount"
                        ? view.discountFilter === "all"
                          ? ""
                          : view.discountFilter
                        : view.statusFilter[view.activeTab] || ""
                    }
                    onChange={(event) =>
                      view.activeTab === "discount"
                        ? updateView({
                            discountFilter: event.target.value || "all",
                          })
                        : updateView({
                            statusFilter: {
                              ...view.statusFilter,
                              [view.activeTab]: event.target.value,
                            },
                          })
                    }
                  >
                    <option value="">Select</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="table-filter">
            <div className="border-line"></div>
            <button
              className={`filter-btn ${view.filterOpen ? "is-open" : ""}`}
              type="button"
              onClick={() => updateView({ filterOpen: !view.filterOpen })}
            >
              <span>{view.filterOpen ? "Close" : "Filters"}</span>
            </button>
            {view.filterOpen && (
              <button
                className="filter-btn"
                type="button"
                onClick={resetFilters}
              >
                <LuRotateCcw size={15} aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {view.activeTab === "discount" && (
            <div className={styles.partnerTabsWrap}>
              <div className={styles.partnerTabs}>
                {DISCOUNT_TABS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.partnerTab} ${
                      view.discountFilter === key ? styles.active : ""
                    }`}
                    onClick={() => updateView({ discountFilter: key })}
                  >
                    {label} (
                    <span className="tab-count">
                      {key === "all"
                        ? total
                        : quotations.filter(
                            (quotation) => getDiscountStatus(quotation) === key,
                          ).length}
                    </span>
                    )
                  </button>
                ))}
              </div>
            </div>
          )}

          <table className={tableClass}>
            <thead>
              <tr className="table-head">
                <td className={styles.orderId}>Id</td>
                <td className={styles.orderId}>Contact Information</td>
                <td className={styles.orderId}>Plan</td>
                <td className="status-col">Status</td>
                {customerTab && <td className="status-col">Invoice</td>}
                <td className="status-col">Assigned To</td>
              </tr>
            </thead>
            <tbody className="table-body">{renderRows(customerTab)}</tbody>
          </table>

          <div className="table-pagination">{/* <Pagination /> */}</div>
        </div>
      </section>

      {activeQuotation && (
        <div
          className={styles.quotationPopup}
          style={{
            top: view.popupPosition.top,
            left: view.popupPosition.left,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.popupTitle}>Quotation</div>
          <div className={styles.popupActions}>
            <Link
              href={`/quotations/quotation-detail/${activeQuotation.id}`}
              className={styles.popupAction}
              onClick={() => updateView({ activeQuotationId: null })}
            >
              <LuEye size={19} />
              <span>View</span>
            </Link>
            <Link
              href={`/quotations/history`}
              className={styles.popupAction}
              onClick={() => updateView({ activeQuotationId: null })}
            >
              <LuHistory size={19} />
              <span>History</span>
            </Link>
            <Link
              href={`/`}
              className={styles.popupAction}
              onClick={() => updateView({ activeQuotationId: null })}
            >
              <LuPencil size={19} />
              <span>Edit</span>
            </Link>
            <Link
              href={`/`}
              className={styles.popupAction}
              onClick={() => updateView({ activeQuotationId: null })}
            >
              <LuDownload size={19} />
              <span>Download</span>
            </Link>
            <button
              type="button"
              className={styles.popupAction}
              onClick={() => updateView({ activeQuotationId: null })}
            >
              <LuMail size={19} />
              <span>Send</span>
            </button>
          </div>
          <button
            type="button"
            className={styles.discountBtn}
            onClick={() => updateView({ activeQuotationId: null })}
          >
            <LuCornerUpRight size={18} />
            <span>Send for more discount</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Quotation;
