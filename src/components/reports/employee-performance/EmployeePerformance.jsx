"use client";

import React, { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "@/components/reports/employee-performance/EmployeePerformance.module.css";

const COLUMNS = [
  "Employee",
  "Leads",
  "Calls",
  "Follow-ups",
  "Opportunities",
  "Won Deals",
  "Revenue",
  "Conv %",
];

const EmployeePerformance = ({ employees = [] }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(query) ||
        employee.role?.toLowerCase().includes(query),
    );
  }, [employees, search]);

  return (
    <section className="common-table-section pt-3">
      <div className="common-table-card rpt-card">
        <div className={`common-table-header ${styles.header}`}>
          <div>
            <h3>Employee Performance</h3>
            <p className="rpt-sub">
              Individual sales and conversion contribution
            </p>
          </div>

          <form
            className={styles.searchWrap}
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="text"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Employee"
              className={styles.searchInput}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Search"
            >
              <FiSearch size={16} aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.rptEmpTable}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee, index) => (
                <tr key={`${employee.name}-${employee.role}-${index}`}>
                  <td data-label="Employee">
                    <div className={styles.rptEmp}>
                      <span
                        className={`${styles.avatar} ${styles[employee.color] || styles.blue}`}
                      >
                        {employee.name?.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h5>{employee.name}</h5>
                        <p>{employee.role}</p>
                      </div>
                    </div>
                  </td>
                  <td data-label="Leads">{employee.leads}</td>
                  <td data-label="Calls">{employee.calls}</td>
                  <td data-label="Follow-ups">{employee.followups}</td>
                  <td data-label="Opportunities">{employee.opps}</td>
                  <td data-label="Won Deals">{employee.won}</td>
                  <td data-label="Revenue">{employee.revenue}</td>
                  <td data-label="Conv %" className="rpt-conv">
                    {employee.conv}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr className={styles.emptyRow}>
                  <td colSpan={COLUMNS.length}>No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EmployeePerformance;
