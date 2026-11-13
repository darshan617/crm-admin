"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LuSearch, LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/router";
import styles from "@/components/follow-up/FollowUp.module.css";
import Pagination from "@/common-components/pagination/Pagination";
import { useDashboardQuery, useGetFollowUpsQuery } from "@/redux/apis/followUpApi";

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
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      setSearchInput(search);
    }
  }, [router.isReady, search]);

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
        search,
      },
      {
        skip: !router.isReady,
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

  const followups = useMemo(
    () => rawFollowups.map(normalizeFollowUp),
    [rawFollowups],
  );

  const pagination = response.pagination || response.meta || {};

  const total = Number(pagination.total ?? response.total ?? followups.length);

  const currentPage = Number(
    pagination.current_page ?? response.current_page ?? page,
  );

  const lastPage = Number(
    pagination.last_page ??
      response.last_page ??
      Math.max(1, Math.ceil(total / itemsPerPage)),
  );

  const from = Number(
    pagination.from ??
      response.from ??
      (followups.length ? (currentPage - 1) * itemsPerPage + 1 : 0),
  );

  const to = Number(
    pagination.to ??
      response.to ??
      (followups.length ? from + followups.length - 1 : 0),
  );

  // Update URL
  const updateURL = (updates) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${router.pathname}?${params.toString()}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  // Clear selection when data context changes
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

  // Tab switching
  const handleTabChange = (tab) => {
    if (activeTab === tab) return;

    setSelected([]);

    updateURL({
      filter: tab,
      page_no: 1,
      items_per_page: itemsPerPage,
    });
  };

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    setSelected([]);

    updateURL({
      filter: activeTab,
      page_no: 1,
      items_per_page: itemsPerPage,
      search: searchInput.trim(),
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

  const errorMessage =
    error?.data?.message || "Unable to load follow-ups. Please try again.";

  return (
    <main className="content">
      <div className="crm-page">
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

        <section className="common-table-section">
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

          <div className="common-table-card">
            {/* Table Header */}
            <div className="common-table-header crm-lead-header">
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
                className="table-search"
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

            {/* Filter */}
            <div className="table-filter">
              <div className="border-line"></div>

              <button className="filter-btn" id="toggleFilter" type="button">
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
                          value={f.id}
                          checked={selected.includes(f.id)}
                          onChange={() => toggleOne(f.id)}
                        />
                      </td>

                      {/* Customer */}
                      <td className="customer" data-label="Customer">
                        <div className="avatar primary">{f.letter}</div>

                        <div>
                          <h5>{f.company}</h5>

                          <p>
                            {f.contact}
                            {f.role && f.role !== "-" ? ` - ${f.role}` : ""}
                          </p>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="contact-info" data-label="Contact">
                        <div>
                          <h5>{f.email}</h5>
                          <p>{f.phone}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className={styles.statusCol} data-label="Status">
                        <span className={`badge ${f.status.type}`}>
                          {f.status.label}
                        </span>
                      </td>

                      {/* Follow Up Date */}
                      <td className="plan-action" data-label="Follow Up Date">
                        <div className={styles.assignedUser}>
                          <div className={styles.userInfo}>
                            <div className={styles.avatarFlex}>
                              <div className="mini-avatar primary">
                                {f.assignee.letter}
                              </div>

                              <h5>{f.assignee.name}</h5>
                            </div>

                            <small>
                              Follow up on&nbsp;
                              <strong>{f.date}</strong>
                            </small>
                          </div>

                          <div className="actions">
                            <button
                              type="button"
                              className="action-btn"
                              onClick={() => handleDetails(f.id)}
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

            <Pagination
              page={currentPage}
              totalPages={lastPage}
              onChange={handlePageChange}
              disabled={isFetching}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Followup;
