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
        <div className="common-table-header">
          <div>
            <h3>Employee Performance</h3>
            <p className="rpt-sub">
              Individual sales and conversion contribution
            </p>
          </div>

          <form
            className="search-box rpt-search"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="text"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Employee"
            />
            <button type="submit" aria-label="Search">
              <FiSearch size={24} aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="crm-lead-table-wrap">
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
                  <td>
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
                  <td>{employee.leads}</td>
                  <td>{employee.calls}</td>
                  <td>{employee.followups}</td>
                  <td>{employee.opps}</td>
                  <td>{employee.won}</td>
                  <td>{employee.revenue}</td>
                  <td className="rpt-conv">{employee.conv}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
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
