"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import {
  useDownloadInvoiceQuery,
  useGetAllQuotationsQuery,
  useLazyDownloadInvoiceQuery,
  useLazyDownloadQuotationQuery,
} from "@/redux/apis/quotationApi";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/constants/serviceConstant";
import SendQuotationPopup from "./send-quotation-popupo/SendQuotationPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

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

const isApproved = (quotation) =>
  String(getStatus(quotation, "")).toLowerCase() === "approved";

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
const getDiscountStatus = (quotation) =>
  quotation.discount_status || quotation.discount_request_status || "pending";

const Quotation = () => {
  const router = useRouter();
  const popupRef = useRef(null);

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
    sendQuotationId: null,
    sendMode: "quotation",
  });
  const { showToast } = useToast();

  const updateView = (updates) =>
    setView((current) => ({ ...current, ...updates }));

  const [downloadQuotation, { isFetching: isDownloading }] =
    useLazyDownloadQuotationQuery();

  const [downloadQInvoice] = useLazyDownloadInvoiceQuery();
  const handleDownload = async (quotationId) => {
    try {
      const res = await downloadQuotation({
        quotation_id: quotationId,
      }).unwrap();

      const { quotation_url } = res?.data || {};

      if (!quotation_url) {
        showToast("Download link not found", "error");
        return;
      }

      window.open(quotation_url, "_blank", "noopener,noreferrer");
      showToast(res?.message || "Quotation downloaded successfully", "success");
    } catch (error) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "Failed to download quotation",
        "error",
      );
    }
  };

  const handleInvoiceDownload = async (quotationId) => {
    try {
      const res = await downloadQInvoice({
        quotation_id: quotationId,
      }).unwrap();

      const { invoice_url, quotation_url } = res?.data || {};
      const fileUrl = invoice_url || quotation_url;

      if (!fileUrl) {
        showToast("Download link not found", "error");
        return;
      }

      window.open(fileUrl, "_blank", "noopener,noreferrer");
      showToast(res?.message || "Invoice downloaded successfully", "success");
    } catch (error) {
      showToast(
        error?.data?.message || error?.message || "Failed to download invoice",
        "error",
      );
    }
  };

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

  const customerTab = view.activeTab === "customer";
  const tableClass = customerTab ? "es-quo-table" : "crm-quo-table";
  const sendQuotation = quotations.find(
    (quotation) => quotation?.id === view.sendQuotationId,
  );

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
    setView((current) => ({
      ...current,
      activeQuotationId:
        current.activeQuotationId === quotation.id ? null : quotation.id,
    }));
  };

  const closeMenu = () => updateView({ activeQuotationId: null });

  useEffect(() => {
    if (view.activeQuotationId === null) return;

    const handleOutsideClick = (event) => {
      if (!popupRef.current?.contains(event.target)) {
        setView((current) =>
          current.activeQuotationId === null
            ? current
            : { ...current, activeQuotationId: null },
        );
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", handleOutsideClick);
  }, [view.activeQuotationId]);

  /* --------------------------- rows --------------------------- */

  const renderRows = () => {
    const columnCount = customerTab ? 6 : 5;

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
    if (quotations.length === 0) {
      return (
        <tr className="table-row">
          <td colSpan={columnCount}>No quotations found.</td>
        </tr>
      );
    }

    return quotations.map((quotation) => {
      const company = getCompany(quotation);
      const contact = getContact(quotation);
      const assignee = getAssignee(quotation);
      const rowStatus =
        view.activeTab === "discount"
          ? getDiscountStatus(quotation)
          : getStatus(quotation);
      const isMenuOpen = view.activeQuotationId === quotation?.id;
      const approved = isApproved(quotation);

      return (
        <tr
          key={quotation.id}
          className={`${customerTab ? "es" : "crm"}-quo-row table-row`}
          style={{ cursor: "pointer" }}
          onClick={() =>
            router.push(
              customerTab
                ? `/quotations/quotation-detail/${quotation.id}/activity`
                : `/quotations/quotation-detail/${quotation.id}`,
            )
          }
        >
          {/* Id */}
          <td className={styles.orderId} data-label="Id">
            <span className="quotation-id">
              {quotation.quotation_no || quotation.id}
            </span>
          </td>

          {/* Contact */}
          <td className="customer" data-label="Contact">
            <div className="avatar purple">{company.charAt(0)}</div>
            <div>
              <h5>{company}</h5>
              <p>{contact}</p>
            </div>
          </td>

          {/* Plan */}
          <td>
            <div className="plan-info" data-label="Plan">
              <div className="plan-icon">
                <span className={styles.iconCircle}>
                  {SIDEBAR_SERVICES_CONSTANTS?.find(
                    (menu) =>
                      menu?.id ===
                      Number(
                        quotation?.plans?.[0]?.provider_id ||
                          quotation?.provider_id,
                      ),
                  )?.image || "-"}
                </span>
              </div>
              <div>
                <h6>{quotation?.plans?.[0]?.name || "-"}</h6>
                <p className="plan-meta">
                  {quotation.licenses != null && (
                    <span>{quotation.licenses} Licenses</span>
                  )}
                  {quotation.term && <span>{quotation.term}</span>}
                  {getAmount(quotation) !== "" && (
                    <span>₹ {getAmount(quotation)}</span>
                  )}
                  {quotation.discount != null && (
                    <span>{quotation.discount}%</span>
                  )}
                </p>
              </div>
            </div>
            {quotation?.plans?.length > 1 && (
              <p className="plan-meta">
                + {quotation.plans.length - 1} more plans
              </p>
            )}
          </td>

          {/* Status */}
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
                  <h6 className="m-0">{assignee}</h6>
                </div>
                <small>{getFollowUp(quotation) || " "}</small>
              </div>

              <div
                className={`${styles.actionMenu} actions`}
                ref={isMenuOpen ? popupRef : null}
              >
                <button
                  className="action-btn"
                  type="button"
                  title="Quotation actions"
                  onClick={(event) => openQuotationMenu(quotation, event)}
                >
                  <LuChevronRight size={24} aria-hidden="true" />
                </button>

                {isMenuOpen && (
                  <div
                    className={styles.quotationPopup}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className={styles.popupTitle}>Quotation</div>
                    <div className={styles.popupActions}>
                      <Link
                        href={`/quotations/quotation-detail/${quotation.id}`}
                        className={styles.popupAction}
                        onClick={closeMenu}
                      >
                        <LuEye size={19} />
                        <span>View</span>
                      </Link>

                      <Link
                        href={`/quotations/history/${quotation.id}`}
                        className={styles.popupAction}
                        onClick={closeMenu}
                      >
                        <LuHistory size={19} />
                        <span>History</span>
                      </Link>
                      {approved && (
                        <Link
                          href={`/quotations/update-quotation?qid=${quotation.id}`}
                          className={styles.popupAction}
                          onClick={closeMenu}
                        >
                          <LuPencil size={19} />
                          <span>Edit</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        className={styles.popupAction}
                        disabled={isDownloading}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDownload(quotation.id);
                          closeMenu();
                        }}
                      >
                        <LuDownload size={19} />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        className={styles.popupAction}
                        onClick={(event) => {
                          event.stopPropagation();
                          updateView({
                            activeQuotationId: null,
                            sendQuotationId: quotation.id,
                            sendMode: "quotation",
                          });
                        }}
                      >
                        <LuMail size={19} />
                        <span>Send</span>
                      </button>
                    </div>

                    {approved && (
                      <div className={styles.quotationPopupInvoice}>
                        <div
                          className={`${styles.popupTitle} ${styles.invoiceTitle}`}
                        >
                          Invoice
                        </div>
                        <div
                          className={`${styles.popupActions} ${styles.invoiceActions}`}
                        >
                          <button
                            type="button"
                            className={styles.popupAction}
                            disabled={isDownloading}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleInvoiceDownload(quotation.id);
                              closeMenu();
                            }}
                          >
                            <LuDownload size={19} />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            className={styles.popupAction}
                            onClick={(event) => {
                              event.stopPropagation();
                              updateView({
                                activeQuotationId: null,
                                sendQuotationId: quotation.id,
                                sendMode: "invoice",
                              });
                            }}
                          >
                            <LuMail size={19} />
                            <span>Email</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {!approved && (
                      <button
                        type="button"
                        className={styles.discountBtn}
                        onClick={closeMenu}
                      >
                        <LuCornerUpRight size={18} />
                        <span>Send for more discount</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  /* ---------------------------- render ---------------------------- */

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
        {/* Tabs */}
        <div className={styles.crmLeadTabs} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={view.activeTab === tab.key}
              className={view.activeTab === tab.key ? styles.active : ""}
              onClick={() => {
                selectTab(tab.key);
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
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
          {/* Header + search */}
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

          {/* Filter panel */}
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

          {/* Filter toggle */}
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

          {/* Discount sub-tabs */}
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

          {/* Table */}
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
            <tbody className="table-body">{renderRows()}</tbody>
          </table>

          <div className="table-pagination">{/* <Pagination /> */}</div>
        </div>
      </section>

      <SendQuotationPopup
        isOpen={view.sendQuotationId !== null && Boolean(sendQuotation)}
        onClose={() =>
          updateView({ sendQuotationId: null, sendMode: "quotation" })
        }
        quotation={sendQuotation}
        mode={view.sendMode}
        title={view.sendMode === "invoice" ? "Send Invoice" : "Send Quotation"}
      />
    </div>
  );
};

export default Quotation;
