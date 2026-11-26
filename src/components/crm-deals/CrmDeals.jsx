"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/crm-deals/CrmDeals.module.css";
import { FiSend } from "react-icons/fi";
import { IoEyeOutline, IoSearch } from "react-icons/io5";
import { useCrmDealsQuery } from "@/redux/apis/crmDeals";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/constants/serviceConstant";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import Pagination from "@/common-components/pagination/Pagination";
import SendQuotationPopup from "@/components/quotation/send-quotation-popupo/SendQuotationPopup";

const FILTER_DEFAULTS = {
  status: "",
  deal_type: "",
  assigned_to: "",
  po_status: "",
  date_type: "",
  from: "",
  to: "",
  sort: "created_at",
  sort_dir: "desc",
};

const FALLBACK_OPTIONS = {
  status: [{ value: "pending", label: "Pending" }],
  deal_type: [{ value: "new", label: "New" }],
  po_status: [{ value: "pending", label: "Pending" }],
  date_type: [{ value: "created", label: "Created Date" }],
  sort: [{ value: "created_at", label: "Created Date" }],
  sort_dir: [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ],
};

const toOptions = (list) => {
  if (!Array.isArray(list)) return [];

  const seen = new Set();

  return list.reduce((options, item) => {
    if (item == null || item === "") return options;

    if (typeof item !== "object") {
      const value = String(item);
      if (!seen.has(value)) {
        seen.add(value);
        options.push({ value, label: value });
      }
      return options;
    }

    const raw = item.key ?? item.value ?? item.id ?? item.name ?? item.label;
    if (raw == null || raw === "") return options;

    const value = String(raw);
    if (seen.has(value)) return options;

    seen.add(value);
    options.push({
      value,
      label: String(item.label ?? item.name ?? item.key ?? item.value ?? raw),
    });
    return options;
  }, []);
};

const firstList = (meta, keys) =>
  keys
    .map((key) => meta?.[key])
    .find((list) => Array.isArray(list) && list.length);

const personOptions = (list) =>
  toOptions(
    (Array.isArray(list) ? list : []).map((item) => {
      if (!item || typeof item !== "object") return item;
      const name = item.name ?? item.label;
      if (!name) return item;
      return { value: name, label: String(name) };
    }),
  );

const optionList = (meta, keys, fallback, extra = []) => {
  const fromMeta = toOptions(firstList(meta, keys));
  if (fromMeta.length) return fromMeta;

  const merged = toOptions([...fallback, ...extra]);
  return merged.length ? merged : fallback;
};

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="filter-group">
      <h6>{label} :</h6>
      <div className="filter-options">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function CrmDeals() {
  const router = useRouter();
  const { canView, loginAs, ready } = usePermissions();
  const canSeeDeals = canView("crm_deals");
  const canSendInvoices =
    ready &&
    String(loginAs || "")
      .trim()
      .toLowerCase() === "account manager";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [invoiceDeal, setInvoiceDeal] = useState(null);
  const [invoiceType, setInvoiceType] = useState("proforma");
  const searchTimer = useRef(null);
  const actionMenuRef = useRef(null);
  const actionTriggerRef = useRef(null);
  const page = Math.max(1, Number(router.query.page_no) || 1);

  const setPage = (nextPage) => {
    if (!router.isReady) return;

    const pageNumber = Math.max(1, Number(nextPage) || 1);
    const current = Math.max(1, Number(router.query.page_no) || 1);

    if (pageNumber === current && router.query.page_no) return;

    router.push(
      {
        pathname: "/crm-deals",
        query: {
          ...router.query,
          page_no: String(pageNumber),
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  useEffect(() => {
    if (!router.isReady || router.query.page_no) return;

    router.replace(
      {
        pathname: "/crm-deals",
        query: {
          ...router.query,
          page_no: "1",
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [router, router.isReady, router.query.page_no]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  useEffect(() => {
    if (!openActionMenu) return undefined;

    const closeOnOutsideClick = (event) => {
      if (
        actionMenuRef.current?.contains(event.target) ||
        actionTriggerRef.current?.contains(event.target)
      ) {
        return;
      }

      setOpenActionMenu(null);
    };
    const closeMenu = () => setOpenActionMenu(null);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [openActionMenu]);

  const { data, isLoading, isError } = useCrmDealsQuery(
    {
      search,
      ...filters,
      page_no: page,
      item_per_page: 10,
    },
    { skip: !canSeeDeals },
  );

  const deals = data?.data?.deals ?? [];
  const pagination = data?.data?.pagination || {};
  const filtersMeta = data?.data?.filters || data?.filters || {};
  const total = Number(pagination.total ?? deals.length) || 0;
  const perPage = Number(pagination.item_per_page || pagination.per_page) || 10;
  const currentPage =
    Number(pagination.page_no || pagination.current_page) || page;
  const rangeFrom = total
    ? Number(pagination.from) || (currentPage - 1) * perPage + 1
    : 0;
  const rangeTo = total
    ? Number(pagination.to) || Math.min(currentPage * perPage, total)
    : 0;

  const statusOptions = optionList(
    filtersMeta,
    ["statuses", "status"],
    FALLBACK_OPTIONS.status,
    deals.map((deal) => deal?.status).filter(Boolean),
  );
  const dealTypeOptions = optionList(
    filtersMeta,
    ["deal_types", "deal_type"],
    FALLBACK_OPTIONS.deal_type,
    deals
      .filter((deal) => deal?.deal_type)
      .map((deal) => ({
        value: deal.deal_type,
        label: deal.deal_type_label || deal.deal_type,
      })),
  );
  const assigneeSource = firstList(filtersMeta, [
    "employees",
    "assignees",
    "assigned_to",
  ]);
  const assigneeOptions = assigneeSource
    ? personOptions(assigneeSource)
    : optionList(
        null,
        [],
        [],
        deals.map((deal) =>
          typeof deal?.assigned_to === "object"
            ? deal.assigned_to?.name
            : deal?.assigned_to,
        ),
      );
  const poStatusOptions = optionList(
    filtersMeta,
    ["po_statuses", "po_status"],
    FALLBACK_OPTIONS.po_status,
    deals.map((deal) => deal?.po_status).filter(Boolean),
  );
  const dateTypeOptions = optionList(
    filtersMeta,
    ["date_types", "date_type"],
    FALLBACK_OPTIONS.date_type,
  );
  const sortOptions = optionList(
    filtersMeta,
    ["sorts", "sort"],
    FALLBACK_OPTIONS.sort,
  );
  const sortDirOptions = optionList(
    filtersMeta,
    ["sort_dirs", "sort_directions"],
    FALLBACK_OPTIONS.sort_dir,
  );
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (!value) return false;
    if (key === "sort") return value !== FILTER_DEFAULTS.sort;
    if (key === "sort_dir") return value !== FILTER_DEFAULTS.sort_dir;
    return true;
  });

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(FILTER_DEFAULTS);
    setPage(1);
  };

  const toggleActionMenu = (deal, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 210;
    const left = Math.max(
      8,
      Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
    );
    const openUp = window.innerHeight - rect.bottom < 112 && rect.top > 112;

    actionTriggerRef.current = event.currentTarget;
    setOpenActionMenu((current) =>
      String(current?.dealId) === String(deal.id)
        ? null
        : {
            dealId: deal.id,
            left,
            top: openUp ? rect.top - 104 : rect.bottom + 6,
          },
    );
  };

  const openInvoicePopup = (type) => {
    const deal = deals.find(
      (item) => String(item?.id) === String(openActionMenu?.dealId),
    );
    if (deal) {
      setInvoiceDeal(deal);
      setInvoiceType(type);
    }
    setOpenActionMenu(null);
  };

  const applySearch = (value) => {
    const next = String(value || "").trim();
    clearTimeout(searchTimer.current);
    if (next === search) return;

    setSearch(next);
    setPage(1);
  };

  if (!canSeeDeals) return null;

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span> CRM Deals
            </p>
          </div>
          <h2>CRM Deals</h2>
        </div>
      </div>

      <section className="common-table-section crm-quo-list">
        <div className="common-table-card">
          <div className="common-table-header crm-quo-header">
            <div className="crm-quo-title">
              <p>
                Showing{" "}
                <strong>
                  {rangeFrom} - {rangeTo}
                </strong>{" "}
                from <strong>{total}</strong> deals
              </p>
            </div>

            <form
              className="table-search"
              onSubmit={(event) => {
                event.preventDefault();
                applySearch(searchInput);
              }}
            >
              <input
                type="text"
                name="search"
                value={searchInput}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchInput(value);
                  clearTimeout(searchTimer.current);
                  searchTimer.current = setTimeout(
                    () => applySearch(value),
                    400,
                  );
                }}
                placeholder="Search company, quote, employee"
                autoComplete="off"
              />
              <button
                type="submit"
                className={styles.searchButton}
                aria-label="Search"
              >
                <IoSearch />
              </button>
            </form>
          </div>

          <div
            className="table-filter-wrap"
            id="filterPanel"
            style={{ display: filtersOpen ? undefined : "none" }}
          >
            <div className="filter-grid">
              <FilterSelect
                label="Date Type"
                value={filters.date_type}
                options={dateTypeOptions}
                onChange={(value) => updateFilter("date_type", value)}
              />

              <div className="filter-group">
                <h6>Date Range :</h6>
                <div className="date-range">
                  <div className="date-input">
                    <input
                      aria-label="From date"
                      type="date"
                      value={filters.from}
                      onChange={(event) =>
                        updateFilter("from", event.target.value)
                      }
                    />
                  </div>
                  <div className="date-input">
                    <input
                      aria-label="To date"
                      type="date"
                      value={filters.to}
                      onChange={(event) =>
                        updateFilter("to", event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <FilterSelect
                label="Status"
                value={filters.status}
                options={statusOptions}
                onChange={(value) => updateFilter("status", value)}
              />
              <FilterSelect
                label="Deal Type"
                value={filters.deal_type}
                options={dealTypeOptions}
                onChange={(value) => updateFilter("deal_type", value)}
              />
              <FilterSelect
                label="Assigned To"
                value={filters.assigned_to}
                options={assigneeOptions}
                onChange={(value) => updateFilter("assigned_to", value)}
              />
              <FilterSelect
                label="PO Status"
                value={filters.po_status}
                options={poStatusOptions}
                onChange={(value) => updateFilter("po_status", value)}
              />
              <FilterSelect
                label="Sort"
                value={filters.sort}
                options={sortOptions}
                onChange={(value) => updateFilter("sort", value)}
              />
              <FilterSelect
                label="Sort Direction"
                value={filters.sort_dir}
                options={sortDirOptions}
                onChange={(value) => updateFilter("sort_dir", value)}
              />
            </div>
          </div>

          <div className="table-filter">
            <div className="border-line"></div>
            <button
              className="filter-btn"
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <span>{filtersOpen ? "Close" : "Filters"}</span>
            </button>
            {(filtersOpen || hasActiveFilters) && (
              <button
                className="filter-btn"
                type="button"
                onClick={clearFilters}
              >
                <span>Clear</span>
              </button>
            )}
          </div>

          <table className="crm-quo-table">
            <thead>
              <tr className="table-head">
                <td className="order-id">Id</td>
                <td className="order-id">Contact Information</td>
                <td className="order-id">Plan</td>
                <td className="status-col text-center">Status</td>
                <td className="status-col">Assigned To</td>
              </tr>
            </thead>

            <tbody className="table-body">
              {isLoading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5}>Failed to load deals.</td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={5}>No deals found.</td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr className="crm-quo-row table-row" key={deal?.id}>
                    <td className="order-id" data-label="Id">
                      <Link
                        href={`/crm/quotations/${deal?.id}`}
                        className="quotation-id"
                      >
                        {deal?.quotation_no}
                      </Link>
                    </td>

                    <td className="customer" data-label="Contact">
                      <div className="avatar blue">
                        {deal?.company_name?.charAt(0)}
                      </div>

                      <div>
                        <h5>{deal?.company_name}</h5>
                        <p>
                          {deal?.contact_name} · Deal #{deal?.id}
                        </p>
                      </div>
                    </td>

                    <td className="plan-info" data-label="Plan">
                      <div className="plan-icon">
                        {SIDEBAR_SERVICES_CONSTANTS?.find(
                          (menu) =>
                            menu?.id ===
                            Number(deal?.provider_id?.[0] || deal?.provider_id),
                        )?.image || "-"}
                      </div>

                      <div>
                        <h5>{deal?.plan_name}</h5>

                        <p className="plan-meta">
                          <span>{deal?.deal_type_label}</span>
                          <span>{deal?.quantity} Licenses</span>
                          <span>{deal?.quotation_period}</span>
                          <span>
                            ₹{" "}
                            {Number(deal?.total_amount).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                    </td>

                    <td className="status-col text-center" data-label="Status">
                      <span
                        className={`badge ${deal?.status_label === "Active" ? "approved" : "pending"} mb-1 me-2`}
                      >
                        {deal?.status_label}
                      </span>{" "}
                      <span className="badge grayBadge">
                        {deal?.crm_order_no}
                      </span>
                    </td>

                    <td className="plan-action" data-label="Assigned To">
                      <div className={styles.assignedUser}>
                        <div className="user-info">
                          <div className={styles.avatarFlex}>
                            <div className="mini-avatar primary">
                              {deal?.assigned_to?.charAt(0)}
                            </div>

                            <h5>{deal?.assigned_to}</h5>
                          </div>

                          <small>Added {deal?.created_at}</small>
                        </div>

                        <div className={styles.rowActions}>
                          {canSendInvoices && (
                            <button
                              type="button"
                              className="action-btn"
                              title="Invoice actions"
                              aria-label="Invoice actions"
                              aria-haspopup="menu"
                              aria-expanded={
                                String(openActionMenu?.dealId) ===
                                String(deal?.id)
                              }
                              onClick={(event) => toggleActionMenu(deal, event)}
                            >
                              <FiSend />
                            </button>
                          )}
                          <Link
                            href={`/crm-deals/${deal?.id}`}
                            className="action-btn"
                            title="View order"
                          >
                            <IoEyeOutline />
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            page={currentPage}
            total={total}
            perPage={perPage}
            lastPage={pagination.last_page}
            onChange={setPage}
          />
        </div>
      </section>

      {canSendInvoices &&
        openActionMenu &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={actionMenuRef}
            className={styles.sendMenu}
            role="menu"
            style={{
              left: openActionMenu.left,
              top: openActionMenu.top,
            }}
          >
            <button
              type="button"
              role="menuitem"
              className={styles.sendMenuButton}
              onClick={() => openInvoicePopup("proforma")}
            >
              Send Proforma Invoice
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.sendMenuButton}
              onClick={() => openInvoicePopup("tax")}
            >
              Text Invoice
            </button>
          </div>,
          document.body,
        )}

      <SendQuotationPopup
        isOpen={canSendInvoices && Boolean(invoiceDeal)}
        onClose={() => setInvoiceDeal(null)}
        quotation={invoiceDeal}
        mode="invoice"
        title={
          invoiceType === "proforma"
            ? "Send Proforma Invoice"
            : "Send Tax Invoice"
        }
        dealInvoiceType={invoiceType}
      />
    </section>
  );
}
