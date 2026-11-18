import { useMemo, useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiSearch, FiSliders } from "react-icons/fi";
import Pagination, {
  usePageQuery,
} from "@/common-components/pagination/Pagination";
import { useGetEmployeeAttendanceQuery } from "@/redux/apis/employeeApi";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import styles from "./AttendanceOverview.module.css";

const AVATAR_TONES = ["purple", "blue", "pink", "teal", "orange", "indigo"];

const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string") return "";

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("blob:") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  if (!base) return "";

  return `${base}/${avatar.replace(/^\/+/, "")}`;
};

const formatRole = (role) => {
  if (!role) return "—";

  return String(role)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatLoginDate = (value) => {
  if (!value) return "";
  if (/[A-Za-z]/.test(String(value)) && !String(value).includes("T")) {
    return String(value);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLoginTime = (value) => {
  if (!value) return "";
  if (/am|pm/i.test(String(value)) && !String(value).includes("T")) {
    return String(value);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatAgo = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatLoginDate(date);
};

const pick = (...values) =>
  values.find((value) => value != null && value !== "");

const asText = (value) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const mapRow = (item) => {
  const employee =
    item?.employee && typeof item.employee === "object" ? item.employee : item;
  const login =
    item?.last_login && typeof item.last_login === "object"
      ? item.last_login
      : item?.login && typeof item.login === "object"
        ? item.login
        : null;

  return {
    id: pick(employee?.id, item?.id, item?.employee_id),
    name: pick(employee?.name, item?.employee_name, item?.name) || "—",
    avatar: pick(
      employee?.avatar_url,
      employee?.avatar,
      item?.avatar_url,
      item?.photo,
    ),
    role: pick(
      employee?.role_name,
      employee?.role_label,
      item?.role_name,
      employee?.role,
      item?.role,
    ),
    status: pick(
      employee?.account_status,
      employee?.status,
      item?.account_status,
      item?.status,
    ),
    loginAt: asText(
      pick(
        item?.logged_in_at,
        item?.login_at,
        item?.last_login_at,
        typeof item?.last_login === "string" ? item.last_login : "",
        login?.logged_in_at,
        login?.at,
        login?.datetime,
      ),
    ),
    loginDate: asText(
      pick(item?.login_date, item?.last_login_date, login?.date, login?.login_date),
    ),
    loginTime: asText(
      pick(item?.login_time, item?.last_login_time, login?.time, login?.login_time),
    ),
    relative: asText(
      pick(
        item?.login_ago,
        item?.last_login_human,
        item?.time_ago,
        login?.ago,
        login?.human,
      ),
    ),
    ip: asText(
      pick(item?.ip_address, item?.ip, item?.last_login_ip, login?.ip_address, login?.ip),
    ),
  };
};

const unwrapAttendance = (data) => {
  const root =
    data?.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? data.data
      : data || {};

  const list =
    root.attendance ||
    root.attendances ||
    root.logins ||
    root.records ||
    root.employees ||
    root.data ||
    [];

  const rows = Array.isArray(list) ? list : list?.data || [];
  const listPagination = Array.isArray(list)
    ? null
    : list?.pagination ||
      list?.meta ||
      (list?.current_page != null || list?.total != null ? list : null);
  const pagination =
    root.pagination ||
    listPagination ||
    root.meta ||
    (root.current_page != null || root.total != null ? root : {});

  const filterOptions = root.filter_options || {};

  return {
    rows: rows.map(mapRow),
    pagination,
    showing: root.showing || {},
    filterOptions: {
      roles: Array.isArray(filterOptions.roles) ? filterOptions.roles : [],
      employees: Array.isArray(filterOptions.employees)
        ? filterOptions.employees
        : [],
      statuses: Array.isArray(filterOptions.statuses)
        ? filterOptions.statuses
        : [],
    },
  };
};

const toOption = (item) => {
  if (typeof item === "string" || typeof item === "number") {
    return { value: String(item), label: formatRole(item) };
  }

  const value = item?.id ?? item?.value ?? item?.name;
  if (value == null || value === "") return null;

  return {
    value: String(value),
    label: String(item?.name || item?.label || formatRole(value)),
  };
};

function EmployeeAvatar({ name, photo }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={36}
        height={36}
        unoptimized
        className={styles.avatarImg}
      />
    );
  }

  const tone = AVATAR_TONES[String(name || "?").charCodeAt(0) % AVATAR_TONES.length];

  return (
    <div className={`${styles.avatar} ${styles[`avatar_${tone}`]}`}>
      {String(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function AttendanceOverview() {
  const { canView, ready } = usePermissions();
  const canSeeEmployees = ready && canView("employees");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    employeeId: "",
    status: "",
    from: "",
    to: "",
  });
  const { page, setPage, isReady } = usePageQuery("page");

  const { data, isLoading, isUninitialized, isError, error } =
    useGetEmployeeAttendanceQuery(
      {
        search: filters.search.trim(),
        role: filters.role,
        employeeId: filters.employeeId,
        status: filters.status,
        from: filters.from,
        to: filters.to,
        page,
      },
      { skip: !isReady || !canSeeEmployees },
    );

  const attendance = useMemo(() => unwrapAttendance(data), [data]);
  const rows = attendance.rows;
  const pagination = attendance.pagination;
  const showing = attendance.showing || {};
  const filterOptions = attendance.filterOptions;

  const totalCount = Number(showing?.total ?? pagination?.total ?? rows.length) || 0;
  const totalPages = pagination?.last_page || 1;
  const currentPage = pagination?.current_page || page;
  const perPage = pagination?.per_page || 10;
  const startIndex =
    showing?.from ??
    pagination?.from ??
    (totalCount ? (currentPage - 1) * perPage + 1 : 0);
  const endIndex =
    showing?.to ??
    pagination?.to ??
    (totalCount ? Math.min(currentPage * perPage, totalCount) : 0);

  const roleOptions = useMemo(
    () => filterOptions.roles.map(toOption).filter(Boolean),
    [filterOptions.roles],
  );
  const employeeOptions = useMemo(
    () => filterOptions.employees.map(toOption).filter(Boolean),
    [filterOptions.employees],
  );
  const statusOptions = useMemo(
    () => filterOptions.statuses.map(toOption).filter(Boolean),
    [filterOptions.statuses],
  );

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1, { replace: true });
  };

  if (!canSeeEmployees) return null;

  return (
    <section className={styles.card}>
      <div className={styles.tableTop}>
        <p className={styles.showing}>
          Showing <strong>{`${startIndex} - ${endIndex}`}</strong> from{" "}
          <strong>{totalCount}</strong>{" "}
          {totalCount === 1 ? "employee" : "employees"}
        </p>

        <form
          className={styles.searchWrap}
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="text"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
            placeholder="Search employees"
            className={styles.searchInput}
            aria-label="Search employees"
          />
          <FiSearch size={15} className={styles.searchIcon} />
        </form>
      </div>

      <div
        id="attendance-filters"
        className={`${styles.filtersWrap} ${filtersOpen ? styles.filtersOpen : ""}`}
        inert={filtersOpen ? undefined : true}
      >
        <div className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="attendance-role">Role:</label>
          <select
            id="attendance-role"
            className={`${styles.select} ${filters.role ? styles.filled : ""}`}
            value={filters.role}
            onChange={(event) => handleFilterChange("role", event.target.value)}
          >
            <option value="">All roles</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="attendance-employee">Employee:</label>
          <select
            id="attendance-employee"
            className={`${styles.select} ${filters.employeeId ? styles.filled : ""}`}
            value={filters.employeeId}
            onChange={(event) =>
              handleFilterChange("employeeId", event.target.value)
            }
          >
            <option value="">All employees</option>
            {employeeOptions.map((employee) => (
              <option key={employee.value} value={employee.value}>
                {employee.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="attendance-status">Account Status:</label>
          <select
            id="attendance-status"
            className={`${styles.select} ${filters.status ? styles.filled : ""}`}
            value={filters.status}
            onChange={(event) => handleFilterChange("status", event.target.value)}
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="attendance-from">Login Date:</label>
          <div className={styles.dateRow}>
            <input
              id="attendance-from"
              type="date"
              className={`${styles.dateInput} ${filters.from ? styles.filled : ""}`}
              value={filters.from}
              onChange={(event) => handleFilterChange("from", event.target.value)}
              aria-label="Login date from"
            />
            <input
              type="date"
              className={`${styles.dateInput} ${filters.to ? styles.filled : ""}`}
              value={filters.to}
              onChange={(event) => handleFilterChange("to", event.target.value)}
              aria-label="Login date to"
            />
          </div>
        </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.borderLine} />
        <button
          type="button"
          className={styles.filterBtn}
          aria-expanded={filtersOpen}
          aria-controls="attendance-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <FiSliders size={14} />
          Filters
          <FiChevronDown
            size={16}
            className={`${styles.chevron} ${filtersOpen ? styles.chevronUp : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Employee</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Login Date</th>
              <th className={styles.th}>Login Time</th>
              <th className={styles.th}>IP Address</th>
              <th className={styles.th}>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {!isReady || isUninitialized || isLoading ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Loading attendance...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  {error?.data?.message || "Unable to load attendance."}
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row, index) => {
                const hasLogin = Boolean(row.loginAt || row.loginDate || row.loginTime);
                const statusValue = String(row.status || "").toLowerCase();
                const statusLabel =
                  statusOptions.find((option) => option.value === statusValue)
                    ?.label || (statusValue ? formatRole(statusValue) : "");
                const hasStatus = Boolean(statusLabel);
                const dateLabel = formatLoginDate(row.loginDate || row.loginAt);
                const timeLabel = formatLoginTime(row.loginTime || row.loginAt);
                const agoLabel = row.relative || formatAgo(row.loginAt);

                return (
                  <tr key={row.id ?? `${row.name}-${index}`} className={styles.row}>
                    <td className={styles.td}>
                      <div className={styles.employee}>
                        <EmployeeAvatar
                          name={row.name}
                          photo={getAvatarUrl(row.avatar)}
                        />
                        <span className={styles.name}>{row.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>{formatRole(row.role)}</td>
                    <td className={styles.td}>
                      {hasLogin && dateLabel ? (
                        dateLabel
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      {hasLogin ? (
                        <span>
                          <span className={styles.timePrimary}>
                            {timeLabel || "—"}
                          </span>
                          {agoLabel ? (
                            <span className={styles.timeAgo}>{agoLabel}</span>
                          ) : null}
                        </span>
                      ) : (
                        <span className={styles.muted}>Never logged in</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      {row.ip || <span className={styles.muted}>—</span>}
                    </td>
                    <td className={styles.td}>
                      {hasStatus ? (
                        <span
                          className={`${styles.badge} ${
                            statusValue === "active"
                              ? styles.badgeActive
                              : statusValue === "suspended"
                                ? styles.badgeSuspended
                                : styles.badgeInactive
                          }`}
                        >
                          {statusLabel}
                        </span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
        align="center"
      />
    </section>
  );
}

