import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetEmployeesQuery } from "@/redux/apis/employeeApi";
import { FiSearch, FiSliders, FiEdit, FiEye, FiShield } from "react-icons/fi";
import Pagination, {
  usePageQuery,
} from "@/common-components/pagination/Pagination";

import styles from "./EmployeeTable.module.css";
const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin (Admin)", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Sales Executive", value: "sales_executive" },
  { label: "Marketing Manager", value: "marketing_manager" },
  { label: "Product Designer", value: "product_designer" },
  { label: "Customer Support", value: "customer_support" },
];

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

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

/* ---------- Avatar ---------- */
function EmployeeAvatar({ name, photo, tone = "green" }) {
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

  return (
    <div className={`${styles.avatar} ${styles[`avatar_${tone}`] || ""}`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

/* ---------- Filters ---------- */
function EmployeeFilters({ status, role, onChange, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGroup}>
            <h6>Status :</h6>
            <select
              value={status}
              onChange={(e) => onChange("status", e.target.value)}
              className={styles.select}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h6>Role :</h6>
            <select
              value={role}
              onChange={(e) => onChange("role", e.target.value)}
              className={styles.select}
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h6>Actions :</h6>
            <button type="button" onClick={onClear} className={styles.clearBtn}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className={styles.filterBar}>
        <div className={styles.borderLine} />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={styles.filterBtn}
        >
          <FiSliders size={12} />
          <span>Filters</span>
        </button>
      </div>
    </>
  );
}

/* ---------- Row ---------- */
function EmployeeTableRow({ employee }) {
  const isActive = employee?.status === "active";
  const photo = getAvatarUrl(employee?.avatar_url);

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <span className={styles.badgeId}>{employee?.id}</span>
      </td>

      <td className={styles.td}>
        <div className={styles.customer}>
          <EmployeeAvatar name={employee?.name} photo={photo} />
          <div>
            <h5 className={styles.customerName}>
              <Link href={`/employee/${employee?.id}/view`}>
                {employee?.name}
              </Link>
            </h5>
            <p className={styles.customerMeta}>
              {employee?.role}
              {employee?.leads_count !== null &&
                employee?.leads_count !== undefined && (
                  <>
                    {" · "}
                    <Link
                      href={{
                        pathname: "/leads",
                        query: { assigned_to: employee?.name },
                      }}
                    >
                      {employee?.leads_count} Leads
                    </Link>
                  </>
                )}
            </p>
          </div>
        </div>
      </td>

      <td className={styles.td}>{employee?.email}</td>
      <td className={styles.td}>{employee?.mobile}</td>

      <td className={styles.td}>
        <span
          className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeInactive}`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className={`${styles.td} ${styles.center}`}>
        <div className={styles.actions}>
          <Link
            href={`/manage/employee/edit/${employee?.id}`}
            title="Edit Employee"
            className={styles.actionBtn}
          >
            <FiEdit size={16} />
          </Link>
          <Link
            href={`/manage/employee/employee-details/${employee.id}`}
            title="View Employee Details"
            className={styles.actionBtn}
          >
            <FiEye size={16} />
          </Link>
          <Link
            href={{
              pathname: "/manage/employee-permission",
              query: {
                employee_id: employee.id,
                ...(employee?.role ? { role: employee.role } : {}),
              },
            }}
            title="Employee Permissions"
            className={styles.actionBtn}
          >
            <FiShield size={16} />
          </Link>
        </div>
      </td>
    </tr>
  );
}

/* ---------- Table (main component) ---------- */
export default function EmployeeTable({ from = "", to = "", onSummary }) {
  const [filters, setFilters] = useState({ search: "", status: "", role: "" });
  const { page, setPage, isReady } = usePageQuery("page");
  const datesReady = useRef(false);

  const { data, isLoading, isUninitialized, isError } = useGetEmployeesQuery(
    {
      search: filters.search?.trim(),
      status: filters.status,
      role: filters.role,
      from,
      to,
      page,
    },
    { skip: !isReady },
  );

  const employees = data?.data?.employees || [];
  const pagination = data?.data?.pagination;
  const totalCount = pagination?.total || 0;
  const totalPages = pagination?.last_page || 1;
  const currentPage = pagination?.current_page || page;
  const perPage = pagination?.per_page || 10;
  const startIndex = totalCount ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = totalCount ? Math.min(currentPage * perPage, totalCount) : 0;

  useEffect(() => {
    if (!isReady) return;

    if (!datesReady.current) {
      datesReady.current = true;
      return;
    }

    setPage(1, { replace: true });
  }, [from, to, isReady]);

  useEffect(() => {
    if (data?.data?.summary && onSummary) {
      onSummary(data.data.summary);
    }
  }, [data, onSummary]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1, { replace: true });
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "", role: "" });
    setPage(1, { replace: true });
  };

  return (
    <section className={styles.tableCard}>
      <div className={styles.tableTop}>
        <p className={styles.showing}>
          Showing <strong>{`${startIndex} - ${endIndex}`}</strong> from{" "}
          <strong>{totalCount}</strong> Employee
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.searchWrap}
        >
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search Employee..."
            className={styles.searchInput}
          />
          <FiSearch size={15} className={styles.searchIcon} />
        </form>
      </div>

      <EmployeeFilters
        status={filters.status}
        role={filters.role}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <div className="overflow-auto">
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Id</th>
              <th className={styles.th}>Customer Information</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.center}`}>Action</th>
            </tr>
          </thead>

          <tbody>
            {!isReady || isUninitialized || isLoading ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Loading employees...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Unable to fetch employees.
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeTableRow key={employee?.id} employee={employee} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No employee found.
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
        align="end"
      />
    </section>
  );
}
