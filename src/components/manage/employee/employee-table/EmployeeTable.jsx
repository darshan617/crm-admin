import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiSliders,
  FiEdit,
  FiEye,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import styles from "./EmployeeTable.module.css";
const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "admin" },
  { label: "Sales Executive", value: "sales_executive" },
];

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
  const isActive = employee.status === "active";

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <span className={styles.badgeId}>{employee.code}</span>
      </td>

      <td className={styles.td}>
        <div className={styles.customer}>
          <EmployeeAvatar
            name={employee.name}
            photo={employee.photo}
            tone={employee.tone}
          />
          <div>
            <h5 className={styles.customerName}>
              <Link href={`/employee/${employee.id}/view`}>
                {employee.name}
              </Link>
            </h5>
            <p className={styles.customerMeta}>
              {employee.roleLabel}
              {employee.leads !== null && employee.leads !== undefined && (
                <>
                  {" · "}
                  <Link
                    href={{
                      pathname: "/leads",
                      query: { assigned_to: employee.name },
                    }}
                  >
                    {employee.leads} Leads
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </td>

      <td className={styles.td}>{employee.email}</td>
      <td className={styles.td}>{employee.phone}</td>

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
            href={`/employee/${employee.id}/edit`}
            title="Edit Employee"
            className={styles.actionBtn}
          >
            <FiEdit size={16} />
          </Link>
          <Link
            href={`/employee/${employee.id}/view`}
            title="View Employee Details"
            className={styles.actionBtn}
          >
            <FiEye size={16} />
          </Link>
          <Link
            href={{
              pathname: "/employee/permissions",
              query: { employee_id: employee.id },
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

/* ---------- Pagination ---------- */
function EmployeePagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        className={styles.pageBtn}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}

/* ---------- Table (main component) ---------- */
export default function EmployeeTable({
  employees = [],
  showingRange = "0 - 0",
  totalCount = 0,
  filters = { search: "", status: "", role: "" },
  onFilterChange = () => {},
  onClearFilters = () => {},
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
}) {
  const safeFilters = filters ?? { search: "", status: "", role: "" };

  return (
    <section className={styles.tableCard}>
      <div className={styles.tableTop}>
        <p className={styles.showing}>
          Showing <strong>{showingRange}</strong> from{" "}
          <strong>{totalCount}</strong> Employee
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.searchWrap}
        >
          <input
            type="text"
            value={safeFilters.search ?? ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search Employee..."
            className={styles.searchInput}
          />
          <FiSearch size={15} className={styles.searchIcon} />
        </form>
      </div>

      <EmployeeFilters
        status={safeFilters.status ?? ""}
        role={safeFilters.role ?? ""}
        onChange={onFilterChange}
        onClear={onClearFilters}
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
            {employees.length > 0 ? (
              employees.map((employee) => (
                <EmployeeTableRow key={employee.id} employee={employee} />
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

      <EmployeePagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </section>
  );
}
