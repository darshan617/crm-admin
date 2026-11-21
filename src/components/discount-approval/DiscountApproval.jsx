"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuRotateCcw, LuSearch, LuX } from "react-icons/lu";
import Pagination from "@/common-components/pagination/Pagination";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { useGetDiscountRequestsQuery } from "@/redux/apis/quotationApi";
import DiscountDecisionPopup from "./discount-decision-popup/DiscountDecisionPopup";
import styles from "./DiscountApproval.module.css";

const SKIP_FILTER_KEYS = new Set([
  "search",
  "name",
  "page",
  "page_no",
  "per_page",
  "item_per_page",
  "items_per_page",
]);

const FALLBACK_STATUSES = [
  { value: "pending", label: "Pending Requests" },
  { value: "approved", label: "Approved Requests" },
  { value: "rejected", label: "Rejected Requests" },
  { value: "all", label: "All Requests" },
];

const queryValue = (value) => {
  if (Array.isArray(value)) return value[0] == null ? "" : String(value[0]);
  return value == null ? "" : String(value);
};

const text = (value, fallback = "") => {
  if (value == null || value === "") return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
};

const personName = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.email || "";
};

const formatPercent = (value) => {
  if (value == null || value === "") return "-";
  return `${value}%`;
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const initialOf = (value) =>
  String(value || "")
    .trim()
    .charAt(0)
    .toUpperCase() || "-";

const toOption = (option) => {
  if (option == null || option === "") return null;

  if (typeof option !== "object") {
    return { value: String(option), label: String(option) };
  }

  const raw =
    option.value ?? option.key ?? option.id ?? option.name ?? option.label;

  if (raw == null || raw === "") return null;

  return {
    value: String(raw),
    label: String(option.label ?? option.name ?? raw),
  };
};

const uniqueOptions = (list) => {
  const seen = new Set();

  return (Array.isArray(list) ? list : []).reduce((options, item) => {
    const option = toOption(item);
    if (!option || seen.has(option.value)) return options;

    seen.add(option.value);
    options.push(option);
    return options;
  }, []);
};

const isSkippedFilter = (input) => {
  const key = String(input?.key || "").toLowerCase();
  const label = String(input?.label || "").toLowerCase();

  return (
    SKIP_FILTER_KEYS.has(key) ||
    key.includes("per_page") ||
    label.includes("per page")
  );
};

const fieldType = (input, options) => {
  const type = String(input?.type || "").toLowerCase();

  if (type === "date" || type === "datetime") return "date";
  if (type === "number") return "number";
  if (type === "text" && !options.length) return "text";
  return "select";
};

const buildFilterFields = (meta) => {
  const inputs = Array.isArray(meta?.inputs) ? meta.inputs : [];

  return inputs
    .filter((input) => input?.key && !isSkippedFilter(input))
    .map((input) => {
      const options = uniqueOptions(
        input.options || input.values || input.choices || meta?.[input.key],
      );

      return {
        key: input.key,
        label: input.label || input.key,
        type: fieldType(input, options),
        placeholder: input.placeholder || "",
        options,
      };
    });
};

const DiscountApproval = () => {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const { canView, canEdit } = usePermissions();
  const canSeeRequests = canView("discount_approval");
  const canEditRequests = canEdit("discount_approval");

  const searchTimer = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [decision, setDecision] = useState(null);

  const status = queryValue(router.query.status) || "pending";
  const search = queryValue(router.query.search).trim();
  const page = Math.max(1, Number(queryValue(router.query.page_no)) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, Number(queryValue(router.query.item_per_page)) || 10),
  );

  useEffect(() => {
    if (!router.isReady) return;
    setSearchInput(search);
  }, [router.isReady, search]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const updateQuery = (patch) => {
    const current = routerRef.current;
    if (!current.isReady) return;

    const next = {};

    Object.entries(current.query).forEach(([key, value]) => {
      const normalized = queryValue(value);
      if (normalized !== "") next[key] = normalized;
    });

    Object.entries(patch).forEach(([key, value]) => {
      if (value == null || value === "") delete next[key];
      else next[key] = String(value);
    });

    current.push({ pathname: current.pathname, query: next }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const reservedKeys = new Set([
    "status",
    "search",
    "page_no",
    "item_per_page",
  ]);

  const extraFilters = Object.fromEntries(
    Object.entries(router.query)
      .filter(([key]) => !reservedKeys.has(key))
      .map(([key, value]) => [key, queryValue(value)])
      .filter(([, value]) => value !== ""),
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDiscountRequestsQuery(
      {
        status,
        search,
        page_no: page,
        item_per_page: perPage,
        ...extraFilters,
      },
      { skip: !router.isReady || !canSeeRequests },
    );

  const payload = data?.data ?? {};
  const items = Array.isArray(payload.items) ? payload.items : [];
  const pagination = payload.pagination || {};
  const counts = payload.status_counts || null;
  const filterMeta = payload.filters || {};

  const apiFields = useMemo(() => buildFilterFields(filterMeta), [filterMeta]);

  const fields = apiFields.length
    ? apiFields
    : [
        {
          key: "status",
          label: "Status",
          type: "select",
          options: FALLBACK_STATUSES,
        },
      ];

  const statuses =
    uniqueOptions(filterMeta.statuses).length > 0
      ? uniqueOptions(filterMeta.statuses)
      : FALLBACK_STATUSES;

  const searchPlaceholder =
    filterMeta.inputs?.find((input) => input?.key === "search")?.placeholder ||
    "Quotation / company / email / employee";

  const total = Number(pagination.total ?? payload.count ?? items.length) || 0;
  const resolvedPerPage =
    Number(pagination.item_per_page || pagination.per_page) || perPage;
  const from = total ? (page - 1) * resolvedPerPage + 1 : 0;
  const to = total ? Math.min(page * resolvedPerPage, total) : 0;
  const lastPage = Number(pagination.last_page) || undefined;

  const handleSearchInput = (value) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const next = value.trim();
      if (next === search) return;
      updateQuery({ search: next, page_no: 1 });
    }, 400);
  };

  const handleFilterChange = (key, value) => {
    const nextValue = key === "status" ? value || "pending" : value;
    const currentValue =
      key === "status" ? status : queryValue(router.query[key]);

    if (nextValue === currentValue) return;

    updateQuery({ [key]: nextValue, page_no: 1 });
  };

  const resetFilters = () => {
    const current = routerRef.current;
    const next = { status: "pending", page_no: "1" };
    const currentPerPage = queryValue(current.query.item_per_page);

    if (currentPerPage) next.item_per_page = currentPerPage;

    setSearchInput("");
    current.push({ pathname: current.pathname, query: next }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const errorMessage =
    error?.data?.message ||
    data?.message ||
    "Unable to load discount requests. Please try again.";

  if (!canSeeRequests) return null;

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
            </p>
          </div>
          <h2>Discount Approval</h2>
        </div>
      </div>

      <section className="common-table-section">
        <div className={styles.tabs}>
          {statuses.map((item) => (
            <button
              key={item.value}
              type="button"
              className={status === item.value ? styles.active : ""}
              aria-pressed={status === item.value}
              onClick={() =>
                handleFilterChange("status", item.value || "pending")
              }
            >
              {item.label}
              <span className={styles.count}>
                ({counts?.[item.value] ?? 0})
              </span>
            </button>
          ))}
        </div>

        <div className="common-table-card">
          <div className={`common-table-header ${styles.header}`}>
            <p>
              Showing{" "}
              <strong>
                {from} - {to}
              </strong>{" "}
              from <strong>{total}</strong> Requests
            </p>

            <form
              className="table-search"
              onSubmit={(event) => {
                event.preventDefault();
                clearTimeout(searchTimer.current);
                const next = searchInput.trim();
                if (next !== search) {
                  updateQuery({ search: next, page_no: 1 });
                }
              }}
            >
              <input
                type="search"
                className={styles.searchInput}
                value={searchInput}
                placeholder={searchPlaceholder}
                aria-label="Search discount requests"
                onChange={(event) => handleSearchInput(event.target.value)}
              />
              <LuSearch
                className={styles.searchIcon}
                size={18}
                aria-hidden="true"
              />
            </form>
          </div>

          <div
            className={styles.panel}
            id="filterPanel"
            style={{ display: filterOpen ? undefined : "none" }}
          >
            <div className="filter-grid">
              {fields.map((field) => (
                <div className="filter-group" key={field.key}>
                  <h6>{field.label} :</h6>
                  <div className="filter-options">
                    {field.type === "select" ? (
                      <select
                        value={
                          field.key === "status"
                            ? status
                            : queryValue(router.query[field.key])
                        }
                        onChange={(event) =>
                          handleFilterChange(field.key, event.target.value)
                        }
                      >
                        {field.key !== "status" && (
                          <option value="">Select</option>
                        )}
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type}
                        value={queryValue(router.query[field.key])}
                        placeholder={field.placeholder || field.label}
                        aria-label={field.label}
                        onChange={(event) =>
                          handleFilterChange(field.key, event.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="table-filter">
            <div className="border-line"></div>
            {filterOpen ? (
              <>
                <button
                  className="filter-btn"
                  type="button"
                  onClick={() => setFilterOpen(false)}
                >
                  <LuX size={14} aria-hidden="true" />
                  <span>Close</span>
                </button>
                <button
                  className="filter-btn"
                  type="button"
                  onClick={resetFilters}
                >
                  <LuRotateCcw size={14} aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </>
            ) : (
              <button
                className="filter-btn"
                type="button"
                onClick={() => setFilterOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  aria-hidden="true"
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
            )}
          </div>

          <table className={styles.table}>
            <thead>
              <tr className="table-head">
                <td>Quotation</td>
                <td>Company</td>
                <td>Discount</td>
                <td>Status</td>
                <td>Requested By</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody className="table-body">
              {isLoading ? (
                <tr className="table-row">
                  <td className={styles.message}>
                    Loading discount requests...
                  </td>
                </tr>
              ) : isError ? (
                <tr className="table-row">
                  <td className={styles.message}>
                    <p>{errorMessage}</p>
                    <button
                      type="button"
                      className={styles.retry}
                      onClick={() => refetch()}
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr className="table-row">
                  <td className={styles.message}>
                    {data?.success === false
                      ? data?.message || "No discount requests found."
                      : "No discount requests found."}
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const company = text(item.company_name, "-");
                  const contact = text(item.name);
                  const email = text(item.email);
                  const requestedName =
                    personName(item.requested_by) || text(item.employee, "-");
                  const assigned =
                    personName(item.assigned_to) || text(item.assigned_to);
                  const employee = text(item.employee);
                  const decidedBy = personName(item.discount_decided_by);
                  const decidedAt = formatDate(item.discount_decided_at);
                  const createdAt = formatDate(item.created_at);
                  const statusKey = String(item.discount_status || "")
                    .toLowerCase()
                    .replace(/[\s_]+/g, "-");
                  const canDecide =
                    item.can_approve === true ||
                    item.can_approve === 1 ||
                    String(item.can_approve).toLowerCase() === "true" ||
                    statusKey === "pending" ||
                    statusKey === "";

                  return (
                    <tr className="table-row" key={item.id}>
                      <td data-label="Quotation">
                        <span className={styles.quoteNo}>
                          {item.quotation_no || item.id}
                        </span>
                      </td>

                      <td
                        className={`customer ${styles.contact}`}
                        data-label="Company"
                      >
                        <div className="avatar">{initialOf(company)}</div>
                        <div>
                          <h5>{company}</h5>
                          {contact && <p>{contact}</p>}
                          {email && <p className={styles.email}>{email}</p>}
                          {item.remark && (
                            <p className={styles.remark} title={item.remark}>
                              {item.remark}
                            </p>
                          )}
                        </div>
                      </td>

                      <td data-label="Discount">
                        <div className={styles.discounts}>
                          <p>
                            <span>Current:</span>
                            <strong>{formatPercent(item.discount)}</strong>
                          </p>
                          <p>
                            <span>Requested:</span>
                            <strong className={styles.requested}>
                              {formatPercent(item.requested_discount)}
                            </strong>
                          </p>
                          {/* <p>
                            <span>Approved:</span>
                            <strong
                              className={
                                item.approved_discount != null &&
                                item.approved_discount !== ""
                                  ? styles.approvedValue
                                  : undefined
                              }
                            >
                              {formatPercent(item.approved_discount)}
                            </strong>
                          </p> */}
                        </div>
                      </td>

                      <td className={styles.statusCol} data-label="Status">
                        <div className={styles.statusStack}>
                          {/* <span className={styles.requestedAbove}>
                            {formatPercent(item.requested_discount)}
                          </span> */}
                          <span
                            className={`badge ${styles.statusBadge} ${statusKey}`}
                          >
                            {item.discount_status_label ||
                              item.discount_status ||
                              "-"}
                          </span>
                        </div>
                      </td>

                      <td data-label="Requested By">
                        <div className={styles.person}>
                          <div className="mini-avatar primary">
                            {initialOf(requestedName)}
                          </div>
                          <div>
                            <h6>{requestedName}</h6>
                            {assigned && assigned !== requestedName && (
                              <small>Assigned to {assigned}</small>
                            )}
                            {employee && employee !== requestedName && (
                              <small>Employee {employee}</small>
                            )}
                            {createdAt && <small>Requested {createdAt}</small>}
                            {(decidedBy || decidedAt) && (
                              <small>
                                Decided {decidedAt}
                                {decidedBy ? ` by ${decidedBy}` : ""}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      {canEditRequests && (
                        <td data-label="Action">
                          {canDecide ? (
                            <div className={styles.rowActions}>
                              <button
                                type="button"
                                className={styles.approveBtn}
                                onClick={() =>
                                  setDecision({ item, action: "approve" })
                                }
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className={styles.rejectBtn}
                                onClick={() =>
                                  setDecision({ item, action: "reject" })
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="table-pagination">
            <Pagination
              page={
                Number(pagination.current_page || pagination.page_no) || page
              }
              total={total}
              perPage={resolvedPerPage}
              lastPage={lastPage}
              onChange={(nextPage) => updateQuery({ page_no: nextPage })}
              disabled={isLoading || isFetching}
            />
          </div>
        </div>
      </section>

      <DiscountDecisionPopup
        isOpen={Boolean(decision)}
        action={decision?.action}
        request={decision?.item}
        onClose={() => setDecision(null)}
      />
    </main>
  );
};

export default DiscountApproval;
