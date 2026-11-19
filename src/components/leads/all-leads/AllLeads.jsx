"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import styles from "@/components/leads/all-leads/AllLeads.module.css";
import { useRouter } from "next/router";
import Pagination from "@/common-components/pagination/Pagination";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const TABS = [
  { label: "All Leads", query: "all", moduleKey: "leads" },
  { label: "JD Leads", query: "justdial", moduleKey: "jd_leads" },
  {
    label: "Exhibition Leads",
    query: "exhibition",
    moduleKey: "exhibition_leads",
  },
];

const SKIP_FILTER_KEYS = new Set([
  "source",
  "page",
  "page_no",
  "per_page",
  "item_per_page",
  "items_per_page",
  "search",
]);

const isSkippedFilter = (input) => {
  const key = String(input?.key || "").toLowerCase();
  const label = String(input?.label || "").toLowerCase();

  return (
    SKIP_FILTER_KEYS.has(key) ||
    key.includes("per_page") ||
    label.includes("per page")
  );
};

const FALLBACK_SELECTS = [
  {
    label: "Date Type",
    keys: ["date_type"],
    optionsKeys: ["date_types"],
  },
  {
    label: "Status",
    keys: ["status", "lead_status"],
    optionsKeys: ["statuses", "lead_statuses"],
  },
  {
    label: "Employee",
    keys: ["employee_id", "employee", "assigned_to"],
    optionsKeys: ["employees"],
  },
  {
    label: "Lead Bifurcation",
    keys: ["lead_bifurcation", "bifurcation"],
    optionsKeys: ["bifurcations", "lead_bifurcations"],
  },
  {
    label: "Lead Priority",
    keys: ["priority", "lead_priority", "category"],
    optionsKeys: ["priorities", "categories", "lead_priorities"],
  },
];

const isOption = (option) => {
  if (option == null || option === "") return false;
  if (typeof option !== "object") return true;

  return ["key", "id", "value", "name", "label"].some(
    (field) => option[field] != null && option[field] !== "",
  );
};

const toOption = (option) => {
  if (typeof option !== "object") {
    return { value: String(option), label: String(option) };
  }

  const raw =
    option.key ?? option.value ?? option.id ?? option.name ?? option.label;

  return {
    value: String(raw),
    label: String(
      option.label ?? option.name ?? option.key ?? option.value ?? raw,
    ),
  };
};

const uniqueOptions = (list) => {
  const seen = new Set();

  return (Array.isArray(list) ? list : []).reduce((options, item) => {
    if (!isOption(item)) return options;

    const option = toOption(item);
    if (!option.value || seen.has(option.value)) return options;

    seen.add(option.value);
    options.push(option);
    return options;
  }, []);
};

const OPTION_LIST_KEYS = {
  date_type: ["date_types"],
  status: ["statuses", "lead_statuses"],
  lead_status: ["statuses", "lead_statuses"],
  employee: ["employees"],
  employee_id: ["employees"],
  assigned_to: ["employees"],
  bifurcation: ["bifurcations", "lead_bifurcations"],
  lead_bifurcation: ["bifurcations", "lead_bifurcations"],
  priority: ["priorities", "categories"],
  lead_priority: ["priorities", "categories"],
  category: ["categories", "priorities"],
  lead_source: ["sources"],
};

const collectionFor = (meta, key) => {
  if (!meta || !key) return [];

  const candidates = [
    ...(OPTION_LIST_KEYS[key] || []).map((name) => meta[name]),
    meta[key],
    meta[`${key}s`],
    meta[`${key}es`],
    key.endsWith("y") ? meta[`${key.slice(0, -1)}ies`] : null,
    meta[`${key}_options`],
  ];
  const match = candidates.find((item) => Array.isArray(item));

  return uniqueOptions(match);
};

const declaredKeys = (meta) =>
  new Set([
    ...Object.keys(meta?.params || {}),
    ...Object.keys(meta?.applied || {}),
    ...(Array.isArray(meta?.inputs)
      ? meta.inputs.map((input) => input?.key).filter(Boolean)
      : []),
  ]);

const chooseKey = (meta, candidates) => {
  const keys = declaredKeys(meta);
  if (!keys.size) return candidates[0];

  return candidates.find((key) => keys.has(key)) || candidates[0];
};

const isDateField = (key, type) => {
  const normalized = String(type || "").toLowerCase();

  return (
    normalized === "date" ||
    normalized === "datetime" ||
    ["from", "to", "date_from", "date_to"].includes(key)
  );
};

const optionsFromInput = (meta, input) => {
  const direct = uniqueOptions(input.options || input.values || input.choices);
  if (direct.length) return direct;

  const aliases = input.aliases;
  if (typeof aliases === "string" && Array.isArray(meta?.[aliases])) {
    return uniqueOptions(meta[aliases]);
  }

  if (Array.isArray(aliases)) {
    const named = aliases.find(
      (item) => typeof item === "string" && Array.isArray(meta?.[item]),
    );
    if (named) return uniqueOptions(meta[named]);
  }

  const fromKey = collectionFor(meta, input.key);
  if (fromKey.length) return fromKey;

  if (aliases && typeof aliases === "object" && !Array.isArray(aliases)) {
    return uniqueOptions(
      Object.entries(aliases).map(([key, label]) => ({
        key,
        label: typeof label === "string" ? label : label?.label || key,
      })),
    );
  }

  return Array.isArray(aliases) ? uniqueOptions(aliases) : [];
};

const buildLeadFilters = (meta) => {
  const inputs = Array.isArray(meta?.inputs)
    ? meta.inputs.filter((input) => input?.key && !isSkippedFilter(input))
    : [];

  if (inputs.length) {
    const fields = inputs.map((input) => ({
      key: input.key,
      label: input.label || input.key,
      type: isDateField(input.key, input.type) ? "date" : "select",
      options: optionsFromInput(meta, input),
    }));
    const keys = new Set(fields.map((field) => field.key));

    if (
      !keys.has("from") &&
      (meta?.params?.from || Object.hasOwn(meta?.applied || {}, "from"))
    ) {
      fields.splice(1, 0, {
        key: "from",
        label: "From",
        type: "date",
        options: [],
      });
    }

    if (
      !keys.has("to") &&
      (meta?.params?.to || Object.hasOwn(meta?.applied || {}, "to"))
    ) {
      const fromIndex = fields.findIndex((field) => field.key === "from");
      fields.splice(fromIndex + 1, 0, {
        key: "to",
        label: "To",
        type: "date",
        options: [],
      });
    }

    return fields;
  }

  const selects = FALLBACK_SELECTS.map((field) => {
    const optionsKey =
      field.optionsKeys.find((name) => Array.isArray(meta?.[name])) ||
      field.optionsKeys[0];

    return {
      key: chooseKey(meta, field.keys),
      label: field.label,
      type: "select",
      options: uniqueOptions(meta?.[optionsKey]),
    };
  });

  return [
    selects[0],
    {
      key: chooseKey(meta, ["from", "date_from"]),
      label: "From",
      type: "date",
      options: [],
    },
    {
      key: chooseKey(meta, ["to", "date_to"]),
      label: "To",
      type: "date",
      options: [],
    },
    ...selects.slice(1),
  ];
};

const TABLE_HEADINGS = [
  { label: "Customer Name", className: "" },
  { label: "Contact Information", className: "" },
  { label: "Status", className: styles.statusCol },
  { label: "Follow Up", className: "" },
];

function FilterSelect({ field, value, onChange }) {
  return (
    <div className={styles.filterGroup}>
      <h6>{field.label} :</h6>

      <div className={styles.filterOptions}>
        <select
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        >
          <option value="">Select</option>

          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AllLeads({
  allLeadsListData,
  filters = {},
  onFiltersChange,
  page = 1,
  onPageChange,
  search = "",
  onSearch,
}) {
  const router = useRouter();
  const { canView } = usePermissions();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const searchTimer = useRef(null);
  const visibleTabs = TABS.filter((tab) => canView(tab.moduleKey));
  const visibleTabKey = visibleTabs.map((tab) => tab.query).join(",");
  const paginationData = allLeadsListData?.data?.pagination || {};
  const leads = allLeadsListData?.data?.leads || [];
  const total = Number(paginationData.total ?? leads.length) || 0;
  const perPage =
    Number(
      paginationData.item_per_page ||
        paginationData.items_per_page ||
        paginationData.per_page,
    ) || 10;
  const rangeFrom = total
    ? Number(paginationData.from) || (page - 1) * perPage + 1
    : 0;
  const rangeTo = total
    ? Number(paginationData.to) || Math.min(page * perPage, total)
    : 0;
  const hasActiveFilters = Object.values(filters).some(
    (value) => value != null && value !== "",
  );
  const allSelected =
    leads.length > 0 && leads.every((lead) => selectedIds.includes(lead.id));
  const filterFields = useMemo(
    () => buildLeadFilters(allLeadsListData?.data?.filters),
    [allLeadsListData],
  );
  const fromField = filterFields.find(
    (field) => field.key === "from" || field.key === "date_from",
  );
  const toField = filterFields.find(
    (field) => field.key === "to" || field.key === "date_to",
  );
  const dateTypeField = filterFields.find((field) => field.key === "date_type");
  const otherFields = filterFields.filter(
    (field) =>
      field !== fromField && field !== toField && field !== dateTypeField,
  );

  const updateFilter = (key, value) => {
    onFiltersChange?.({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange?.({});
  };

  const submitSearch = (value) => {
    clearTimeout(searchTimer.current);
    onSearch?.(value);
  };

  const handleSearchInput = (value) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => onSearch?.(value), 400);
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : leads.map((lead) => lead.id));
  };

  useEffect(() => {
    if (!router.isReady || !visibleTabs.length) return;

    const currentType = router.query?.type;
    const isAllowed = visibleTabs.some((tab) => tab.query === currentType);

    if (!isAllowed) {
      router.replace({
        pathname: "/leads",
        query: {
          type: visibleTabs[0].query,
          page_no: "1",
        },
      });
    }
  }, [router, visibleTabKey]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, router.query?.type]);

  useEffect(() => {
    if (search) return;

    clearTimeout(searchTimer.current);
    setSearchInput("");
  }, [search]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  return (
    <section className={styles.commonTableSection}>
      <div className={styles.crmLeadTabs}>
        {visibleTabs.map((tab) => (
          <button
            key={tab.label}
            className={router?.query?.type === tab?.query ? styles.active : ""}
            onClick={() => {
              router?.push({
                pathname: "/leads",
                query: {
                  type: tab.query,
                  page_no: "1",
                },
              });
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="common-table-card">
        {/* Header */}
        <div className={`${styles.commonTableHeader} ${styles.crmLeadHeader}`}>
          <div className={styles.crmLeadTitle}>
            <p>
              Showing{" "}
              <strong>
                {rangeFrom} - {rangeTo}
              </strong>{" "}
              from <strong>{total}</strong> Customers
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

          <form
            className={`${styles.tableSearch} table-search`}
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(searchInput);
            }}
          >
            <input
              type="text"
              id="partnerSearch"
              placeholder="Search Leads"
              value={searchInput}
              onChange={(event) => handleSearchInput(event.target.value)}
              style={{ outline: "none" }}
            />

            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Search"
            >
              <CiSearch size={16} />
            </button>
          </form>
        </div>

        {/* Filter Panel */}
        <div
          className={`${styles.tableFilterWrap} ${
            showFilters ? styles.active : ""
          }`}
          id="filterPanel"
        >
          <div className={styles.filterGrid}>
            {dateTypeField && (
              <FilterSelect
                field={dateTypeField}
                value={filters[dateTypeField.key] || ""}
                onChange={updateFilter}
              />
            )}

            {(fromField || toField) && (
              <div className={styles.filterGroup}>
                <h6>Date Range :</h6>

                <div className={styles.dateRange}>
                  {[fromField, toField].filter(Boolean).map((field) => (
                    <div className={styles.dateInput} key={field.key}>
                      <input
                        type="date"
                        aria-label={field.label}
                        value={filters[field.key] || ""}
                        onChange={(event) =>
                          updateFilter(field.key, event.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherFields.map((field) =>
              field.type === "date" ? (
                <div className={styles.filterGroup} key={field.key}>
                  <h6>{field.label} :</h6>
                  <div className={styles.dateRange}>
                    <div className={styles.dateInput}>
                      <input
                        type="date"
                        aria-label={field.label}
                        value={filters[field.key] || ""}
                        onChange={(event) =>
                          updateFilter(field.key, event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <FilterSelect
                  key={field.key}
                  field={field}
                  value={filters[field.key] || ""}
                  onChange={updateFilter}
                />
              ),
            )}
          </div>
        </div>

        {/* Filter Button */}
        <div className={`table-filter ${styles.filterActions}`}>
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

          {(showFilters || hasActiveFilters) && (
            <button
              className={`filter-btn ${styles.clearFilterBtn}`}
              type="button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
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
            {leads.length === 0 && (
              <tr className={`${styles.emptyRow} table-row`}>
                <td className={styles.empty}>No leads found</td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                className={`${styles.crmLeadRow} crm-lead-row table-row`}
                key={lead.id}
              >
                {/* Checkbox */}
                <td className="select-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead?.id)}
                    onChange={() => toggleOne(lead?.id)}
                  />
                </td>

                {/* Customer */}
                <td className={styles.customer}>
                  <div className={`avatar ${lead?.avatarColor}`}>
                    {lead?.company_name?.charAt(0) || "-"}
                  </div>

                  <div>
                    <h5>{lead?.company_name || "-"}</h5>
                    <p>{lead?.name || "-"}</p>
                  </div>
                </td>

                {/* Contact */}
                <td className={styles.contactInfo}>
                  <div>
                    <h5>{lead?.email || "-"}</h5>
                    <p>{lead?.mobile || "-"}</p>
                  </div>
                </td>

                {/* Status */}
                <td className={styles.statusCol}>
                  <span className={`badge ${styles.statusText} ${lead?.lead_status}`}>
                    {lead?.lead_status || "-"}
                  </span>
                </td>

                {/* Plan / Assigned User */}
                <td className="plan-action">
                  <div className={styles.assignedUser}>
                    <div className="user-info">
                      <div className={styles.avatarFlex}>
                        <div className="mini-avatar primary">
                          {lead?.assigned_to?.charAt(0) || "-"}
                        </div>

                        <h5>{lead?.assigned_to || "-"}</h5>
                      </div>

                      <small>
                        Follow up on&nbsp;
                        <strong>{lead?.follow_up_date || "-"}</strong>
                      </small>
                    </div>

                        <div className="actions">
                          <button
                            onClick={() =>
                              router?.push(`/leads/leads-details/${lead?.id}`)
                            }
                            className={styles.viewLeadBtn}
                          >
                            <HiChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          page={Number(paginationData.page_no) || page}
          total={total}
          perPage={perPage}
          lastPage={paginationData.last_page}
          onChange={onPageChange}
        />
      </div>
    </section>
  );
}
