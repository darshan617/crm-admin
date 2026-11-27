"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LuSearch,
  LuChevronRight,
  LuCalendarDays,
  LuX,
  LuRotateCcw,
} from "react-icons/lu";
import { useRouter } from "next/router";
import styles from "@/components/follow-up/FollowUp.module.css";
import Pagination from "@/common-components/pagination/Pagination";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import {
  useAssignFollowUpsMutation,
  useDeleteFollowUpsMutation,
  useGetFollowUpAssignOptionsQuery,
  useDownloadFollowUpsMutation,
  useGetFollowUpsQuery,
} from "@/redux/apis/followUpApi";

const TABS = [
  { label: "All Follow-Ups", value: "all" },
  { label: "Overdue", value: "overdue" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
];

const DEFAULT_PER_PAGE = 10;

const getInitial = (value) =>
  String(value ?? "")
    .trim()
    .charAt(0)
    .toUpperCase() || "-";

const getText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return fallback;
  }

  return String(value);
};

const getStatus = (value) => {
  const status =
    typeof value === "object" && value !== null
      ? value.label || value.name || value.status || ""
      : value || "";

  const normalized = String(status).toLowerCase();

  if (normalized.includes("approv")) {
    return { label: status, type: "new" };
  }

  if (normalized.includes("quote") || normalized.includes("quotation")) {
    return {
      label: status,
      type: "quotation-sent",
    };
  }

  if (normalized.includes("contact")) {
    return {
      label: status,
      type: "contacted",
    };
  }

  return {
    label: getText(status, "New"),
    type: "new",
  };
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return getText(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const normalizeFollowUp = (item, index) => {
  const customer = item.customer || item.lead || {};
  const assigned = item.assignee || item.assigned_to || item.user || {};

  const company = getText(
    item.company_name ||
      item.company ||
      customer.company_name ||
      customer.company ||
      item.customer_name,
  );

  const contact = getText(
    item.contact_name ||
      item.contact_person ||
      item.contact ||
      customer.contact_name ||
      customer.name ||
      item.name,
  );

  const assigneeName =
    typeof assigned === "string"
      ? assigned
      : assigned.name || assigned.full_name || item.assigned_to_name || "-";

  return {
    id: item.id ?? item.followup_id ?? index,
    letter: getInitial(company),
    company,
    contact,
    salutation: item.salutation || customer.salutation || "",
    role: getText(item.role || item.designation || customer.designation, ""),
    email: getText(item.email || customer.email),
    phone: getText(
      item.phone || item.mobile || customer.phone || customer.mobile,
    ),
    status: getStatus(item.status || item.lead_status),
    assignee: {
      name: getText(assigneeName),
      letter: getInitial(assigneeName),
    },
    date: formatDate(
      item.follow_up_date ||
        item.followup_date ||
        item.follow_up_at ||
        item.date,
    ),
  };
};

const Followup = () => {
  const router = useRouter();
  const { canView } = usePermissions();
  const canSeeFollowUps = canView("follow_ups");

  // URL-driven state
  const activeTab = router.isReady
    ? TABS.some((tab) => tab.value === router.query.filter)
      ? router.query.filter
      : "all"
    : "all";

  const page = router.isReady
    ? Math.max(1, Number(router.query.page_no) || 1)
    : 1;

  const itemsPerPage = router.isReady
    ? Math.max(1, Number(router.query.items_per_page) || DEFAULT_PER_PAGE)
    : DEFAULT_PER_PAGE;

  const search = router.isReady ? String(router.query.search || "") : "";

  const [searchInput, setSearchInput] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const { showToast } = useToast();
  const {
    data: assignOptionsResponse,
    isLoading: isLoadingAssignOptions,
    isError: isAssignOptionsError,
    refetch: refetchAssignOptions,
  } = useGetFollowUpAssignOptionsQuery(undefined, {
    skip: !assignOpen,
  });
  const [assignFollowUps, { isLoading: isAssigningFollowUps }] =
    useAssignFollowUpsMutation();
  const [deleteFollowUps, { isLoading: isDeletingFollowUps }] =
    useDeleteFollowUpsMutation();
  const [downloadFollowUps, { isLoading: isDownloadingFollowUps }] =
    useDownloadFollowUpsMutation();

  useEffect(() => {
    if (!router.isReady) return;
    setSearchInput(search);
    setQuerySearch(search);
  }, [router.isReady, search]);

  useEffect(() => {
    if (!router.isReady) return undefined;

    const value = searchInput.trim();
    if (value === search) return undefined;

    const timer = setTimeout(() => {
      setQuerySearch(value);
      updateURL({
        filter: activeTab,
        page_no: 1,
        items_per_page: itemsPerPage,
        search: value,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, router.isReady, search, activeTab, itemsPerPage]);

  // Ensure URL contains default parameters
  useEffect(() => {
    if (!router.isReady) return;

    const { filter, page_no, items_per_page } = router.query;

    if (
      filter !== undefined &&
      page_no !== undefined &&
      items_per_page !== undefined
    ) {
      return;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          filter: activeTab,
          page_no: page,
          items_per_page: itemsPerPage,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
  }, [
    router.isReady,
    router.query,
    router.pathname,
    activeTab,
    page,
    itemsPerPage,
  ]);

  // API integration
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetFollowUpsQuery(
      {
        filter: activeTab,
        page,
        items_per_page: itemsPerPage,
        search: querySearch.trim(),
      },
      {
        skip: !router.isReady || !canSeeFollowUps,
      },
    );

  const response = data?.data ?? data ?? {};

  const rawFollowups = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.followups)
        ? response.followups
        : Array.isArray(response.items)
          ? response.items
          : Array.isArray(response.results)
            ? response.results
            : [];

  const pagination = response.pagination || response.meta || {};

  const total =
    Number(pagination.total ?? response.total ?? rawFollowups.length) || 0;

  const apiLastPage = Number(pagination.last_page ?? response.last_page) || 0;
  const returnedWholeList =
    rawFollowups.length > itemsPerPage &&
    (apiLastPage <= 1 || rawFollowups.length >= total);

  const followups = useMemo(() => {
    const start = returnedWholeList ? (page - 1) * itemsPerPage : 0;
    return rawFollowups
      .slice(start, start + itemsPerPage)
      .map(normalizeFollowUp);
  }, [rawFollowups, returnedWholeList, page, itemsPerPage]);

  const employeeOptions = useMemo(() => {
    const source = data?.data ?? data ?? {};
    const list = Array.isArray(source?.filters?.employees)
      ? source?.filters?.employees
      : Array.isArray(source?.employees)
        ? source?.employees
        : [];

    return (
      list
        ?.map((employee) => {
          if (typeof employee === "string") {
            return { value: employee, label: employee };
          }

          const label = employee?.name || employee?.label || "";
          if (!label) return null;

          const id = employee?.id ?? employee?.value;
          return {
            value:
              id === null || id === undefined || id === "" ? label : String(id),
            label,
          };
        })
        ?.filter(Boolean) ?? []
    );
  }, [data]);

  const statusOptions = useMemo(() => {
    const source = data?.data ?? data ?? {};
    const list =
      source?.filters?.inputs?.statuses ??
      source?.filters?.statuses ??
      source?.statuses ??
      [];

    if (!Array.isArray(list)) return [];

    return (
      list
        ?.map((status) => {
          if (typeof status === "string" || typeof status === "number") {
            return { value: String(status), label: String(status) };
          }

          const label = status?.label || status?.name || status?.status || "";
          if (!label) return null;

          const value = status?.value ?? status?.id ?? label;
          return { value: String(value), label: String(label) };
        })
        ?.filter(Boolean) ?? []
    );
  }, [data]);

  const perPage = itemsPerPage;
  const currentPage = page;
  const lastPage = Math.max(1, Math.ceil(total / perPage) || 1);
  const from = followups.length ? (currentPage - 1) * perPage + 1 : 0;
  const to = followups.length ? from + followups.length - 1 : 0;

  // Update URL
  const updateURL = (updates) => {
    const query = { ...router.query };

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        delete query[key];
      } else {
        query[key] = String(value);
      }
    });

    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  useEffect(() => {
    setSelected([]);
  }, [activeTab, page, search]);

  const visibleIds = followups.map((item) => item.id);

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleTabChange = (tab) => {
    if (activeTab === tab) return;

    setSelected([]);

    updateURL({
      filter: tab,
      page_no: 1,
      items_per_page: itemsPerPage,
    });
  };

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setEmployeeFilter("");
  };

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchInput.trim();
    setSearchInput(value);
    setQuerySearch(value);
    setSelected([]);

    updateURL({
      filter: activeTab,
      page_no: 1,
      items_per_page: itemsPerPage,
      search: value,
    });
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > lastPage || newPage === page) {
      return;
    }

    setSelected([]);

    updateURL({
      filter: activeTab,
      page_no: newPage,
      items_per_page: itemsPerPage,
    });
  };

  // Follow-up details
  const handleDetails = (id) => {
    router.push(`/follow-up/follow-up-details?id=${encodeURIComponent(id)}`);
  };

  const assignEmployees = Array.isArray(
    assignOptionsResponse?.data?.employees,
  )
    ? assignOptionsResponse.data.employees
    : [];

  const closeAssignPopup = () => {
    setAssignOpen(false);
    setSelectedEmployee(null);
  };

  const openAssignPopup = () => {
    setSelectedEmployee(null);
    setAssignOpen(true);
  };

  const handleAssignFollowUps = async () => {
    if (!selectedEmployee || !selected.length) return;

    try {
      const response = await assignFollowUps({
        body: {
          assigned_to: selectedEmployee.name,
          lead_ids: selected,
        },
      }).unwrap();

      if (response?.success === false) {
        showToast(
          response?.message || "Unable to assign follow-ups.",
          "error",
        );
        return;
      }

      showToast(
        response?.message || "Follow-ups assigned successfully.",
        "success",
      );
      closeAssignPopup();
      setSelected([]);
    } catch (error) {
      showToast(
        error?.data?.message || "Unable to assign follow-ups.",
        "error",
      );
    }
  };

  const handleDeleteFollowUps = async () => {
    if (!selected.length) return;

    try {
      const response = await deleteFollowUps({
        body: { lead_ids: selected },
      }).unwrap();

      if (response?.success === false) {
        showToast(
          response?.message || "Unable to delete selected follow-ups.",
          "error",
        );
        return;
      }

      showToast(
        response?.message || "Selected follow-ups deleted successfully.",
        "success",
      );
      setSelected([]);
      setDeleteOpen(false);
    } catch (error) {
      showToast(
        error?.data?.message || "Unable to delete selected follow-ups.",
        "error",
      );
    }
  };

  const downloadSelected = async () => {
    try {
      const response = await downloadFollowUps({
        body: { lead_ids: selected },
      }).unwrap();

      if (response?.success === false || !(response?.blob instanceof Blob)) {
        showToast(
          response?.message || "Unable to download selected follow-ups.",
          "error",
        );
        return;
      }

      const url = URL.createObjectURL(response.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.filename || "selected-follow-ups";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast(
        error?.data?.message || "Unable to download selected follow-ups.",
        "error",
      );
    }
  };

  const errorMessage =
    error?.data?.message || "Unable to load follow-ups. Please try again.";

  if (!canSeeFollowUps) return null;

  return (
    <main className="content">
      <div className={`crm-page ${styles.followupPage}`}>
        {/* Page Header */}
        <div className="page-header">
          <div className="">
            <div className="breadcrumb welcome-text">
              <p>
                <a href="/dashboard">Dashboard</a>
                <span>/</span>{" "}
              </p>
            </div>

            <h2>Follow-Ups</h2>
          </div>
        </div>

        <section className={`common-table-section ${styles.followupSection}`}>
          {/* Tabs */}
          <div className={styles.crmLeadTabs}>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={activeTab === tab.value ? styles.active : ""}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={`common-table-card ${styles.followupCard}`}>
            {/* Table Header */}
            <div className={`common-table-header crm-lead-header ${styles.followupHeader}`}>
              <div className={styles.crmLeadTitle}>
                <p>
                  Showing{" "}
                  <strong>
                    {from} - {to}
                  </strong>{" "}
                  from <strong>{total}</strong> Follow-Ups
                </p>

                <span className="header-divider"></span>

                <label className={styles.itemsSelected}>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={!followups.length}
                  />

                  <div>
                    <span id="selectedLeadCount">{selected.length}</span>/
                    {followups.length} Items Selected
                  </div>
                </label>
              </div>

              {/* Search */}
              <form
                method="GET"
                action="#"
                className={`table-search ${styles.followupSearch}`}
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  id="partnerSearch"
                  name="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Follow-Ups"
                />

                <button
                  type="submit"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-label="Search follow-ups"
                >
                  <LuSearch
                    size={24}
                    aria-hidden="true"
                    className="lucide lucide-search"
                  />
                </button>
              </form>
            </div>

            {filterOpen && (
              <div className={styles.filterPanel} id="filterPanel">
                <div className={styles.filterGrid}>
                  <div className={styles.filterGroup}>
                    <h6>Follow Up Date :</h6>
                    <div className={styles.dateRange}>
                      <div className={styles.dateInput}>
                        <input
                          type="date"
                          aria-label="Follow up from date"
                          value={dateFrom}
                          onChange={(event) => setDateFrom(event.target.value)}
                          className={dateFrom ? "" : styles.dateEmpty}
                        />
                        {!dateFrom && (
                          <span className={styles.datePlaceholder}>
                            dd-mm-yyyy
                          </span>
                        )}
                        <LuCalendarDays size={16} aria-hidden="true" />
                      </div>
                      <div className={styles.dateInput}>
                        <input
                          type="date"
                          aria-label="Follow up to date"
                          value={dateTo}
                          onChange={(event) => setDateTo(event.target.value)}
                          className={dateTo ? "" : styles.dateEmpty}
                        />
                        {!dateTo && (
                          <span className={styles.datePlaceholder}>
                            dd-mm-yyyy
                          </span>
                        )}
                        <LuCalendarDays size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.filterGroup}>
                    <h6>Status :</h6>
                    <div className={styles.filterOptions}>
                      <select
                        aria-label="Status"
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {statusOptions?.map((option) => (
                          <option key={option?.value} value={option?.value}>
                            {option?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.filterGroup}>
                    <h6>Employee :</h6>
                    <div className={styles.filterOptions}>
                      <select
                        aria-label="Employee"
                        value={employeeFilter}
                        onChange={(event) =>
                          setEmployeeFilter(event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {employeeOptions?.map((option) => (
                          <option key={option?.value} value={option?.value}>
                            {option?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`table-filter ${styles.filterBar}`}>
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
                  id="toggleFilter"
                  type="button"
                  onClick={() => setFilterOpen(true)}
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
              )}
            </div>

            {/* Table */}
            <div className={styles.tableResponsive}>
              <table className="crm-lead-table">
                <thead>
                  <tr className="table-head">
                    <td className="select-col">
                      <input
                        type="checkbox"
                        id="selectAllTable"
                        checked={allSelected}
                        onChange={toggleAll}
                        disabled={!followups.length}
                      />
                    </td>

                    <td>Customer Name</td>
                    <td>Contact Information</td>
                    <td className={styles.statusCol}>Status</td>
                    <td>Follow Up Date</td>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        Loading follow-ups...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        <p>{errorMessage}</p>

                        <button type="button" onClick={refetch}>
                          Try Again
                        </button>
                      </td>
                    </tr>
                  ) : followups.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        No follow-ups found.
                      </td>
                    </tr>
                  ) : (
                    followups.map((f) => (
                      <tr
                        key={f.id}
                        className="crm-lead-row table-row"
                        style={{ cursor: "pointer" }}
                      >
                        {/* Checkbox */}
                        <td className="select-col" data-label="">
                          <input
                            type="checkbox"
                            name="selected_leads[]"
                            value={f?.id}
                            checked={selected.includes(f?.id)}
                            onChange={() => toggleOne(f?.id)}
                          />
                        </td>

                        {/* Customer */}
                        <td className="customer" data-label="Customer">
                          <div className="avatar primary">{f?.letter}</div>

                          <div>
                            <h5>{f?.company}</h5>

                            <p>
                              {f?.salutation ? `${f.salutation}. ` : ""}
                              {f?.contact || "-"}
                              {f?.role && f.role !== "-" ? ` - ${f.role}` : ""}
                            </p>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className={styles.contactInfo} data-label="Contact">
                          <div>
                            <h5>{f?.email}</h5>
                            <p>{f?.phone}</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className={styles.statusCol} data-label="Status">
                          <span className={`badge ${f?.status?.type}`}>
                            {f?.status?.label}
                          </span>
                        </td>

                        {/* Follow Up Date */}
                        <td className="plan-action" data-label="Follow Up Date">
                          <div className={styles.assignedUser}>
                            <div className={styles.userInfo}>
                              <div className={styles.avatarFlex}>
                                <div className="mini-avatar primary">
                                  {f?.assignee?.letter}
                                </div>

                                <h5>{f?.assignee?.name}</h5>
                              </div>

                              <small>
                                Follow up on&nbsp;
                                <strong>{f?.date}</strong>
                              </small>
                            </div>

                            <div className="actions">
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() => handleDetails(f?.id)}
                                aria-label="View follow-up details"
                              >
                                <LuChevronRight
                                  size={24}
                                  aria-hidden="true"
                                  className="lucide lucide-chevron-right"
                                />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              page={currentPage}
              total={total}
              perPage={perPage}
              lastPage={lastPage}
              onChange={handlePageChange}
              disabled={isLoading || isFetching}
            />

            {selected.length > 0 && (
              <div className={styles.selectionActionBar} role="toolbar">
                <button
                  type="button"
                  className={styles.selectionAction}
                  onClick={openAssignPopup}
                >
                  Assign Employee
                </button>
                <button
                  type="button"
                  className={styles.selectionAction}
                  onClick={downloadSelected}
                  disabled={isDownloadingFollowUps}
                >
                  {isDownloadingFollowUps ? "Downloading..." : "Download List"}
                </button>
                <button
                  type="button"
                  className={styles.selectionAction}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete Follow-Ups
                </button>
              </div>
            )}

            <CustomPopup
              isOpen={assignOpen}
              onClose={closeAssignPopup}
              closeIcon={false}
              maxWidth="760px"
              className={styles.assignPopup}
            >
              <div className={styles.assignModal}>
                <h2>Assign Employee to Selected Follow-Ups</h2>
                <button
                  type="button"
                  className={styles.assignModalClose}
                  onClick={closeAssignPopup}
                  aria-label="Close"
                >
                  ×
                </button>

                <div className={styles.employeeGrid} role="radiogroup">
                  {isLoadingAssignOptions ? (
                    <div className={styles.employeeLoading}>
                      Loading employees...
                    </div>
                  ) : isAssignOptionsError ? (
                    <div className={styles.employeeLoading}>
                      <div>
                        <p>Unable to load employees.</p>
                        <button
                          type="button"
                          className={styles.retryAssignOptions}
                          onClick={refetchAssignOptions}
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  ) : assignEmployees.length === 0 ? (
                    <div className={styles.employeeLoading}>
                      No employees available.
                    </div>
                  ) : (
                    assignEmployees.map((employee, index) => {
                      const active =
                        selectedEmployee?.id === employee.id ||
                        selectedEmployee?.name === employee.name;
                      const colors = [
                        "#6b55a5",
                        "#377c91",
                        "#b28d25",
                        "#2876a8",
                        "#a3326b",
                      ];

                      return (
                        <button
                          key={employee.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={`${styles.employeeCard} ${
                            active ? styles.employeeCardActive : ""
                          }`}
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <span
                            className={styles.employeeAvatar}
                            style={{ background: colors[index % colors.length] }}
                          >
                            {String(employee.name || "-")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <span className={styles.employeeName}>
                            {employee.name || "-"}
                          </span>
                          <span className={styles.employeeCount}>
                            {Number(employee.followup_count) || 0}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className={styles.assignModalFooter}>
                  <button
                    type="button"
                    className={styles.confirmAssign}
                    onClick={handleAssignFollowUps}
                    disabled={
                      !selectedEmployee ||
                      isAssigningFollowUps ||
                      isLoadingAssignOptions
                    }
                  >
                    {isAssigningFollowUps ? "Assigning..." : "Confirm"}
                  </button>
                </div>
              </div>
            </CustomPopup>

            <CustomPopup
              isOpen={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              closeIcon={false}
              maxWidth="440px"
              className={styles.assignPopup}
            >
              <div className={styles.deleteModal}>
                <button
                  type="button"
                  className={styles.assignModalClose}
                  onClick={() => setDeleteOpen(false)}
                  aria-label="Close"
                  disabled={isDeletingFollowUps}
                >
                  ×
                </button>
                <h2>Delete selected follow-ups?</h2>
                <p>
                  This will permanently delete {selected.length} selected{" "}
                  {selected.length === 1 ? "follow-up" : "follow-ups"}.
                </p>
                <div className={styles.deleteModalActions}>
                  <button
                    type="button"
                    className={styles.cancelDelete}
                    onClick={() => setDeleteOpen(false)}
                    disabled={isDeletingFollowUps}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.confirmDelete}
                    onClick={handleDeleteFollowUps}
                    disabled={isDeletingFollowUps}
                  >
                    {isDeletingFollowUps ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </CustomPopup>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Followup;
