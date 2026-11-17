"use client";

import React, { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "@/components/reports/employee-performance/EmployeePerformance.module.css";

const AVATAR_TONES = ["purple", "teal", "blue", "orange", "green", "pink"];

const employees = [
  {
    name: "Account Manager User",
    role: "Account Manager",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Darshan B",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Darshan B",
    role: "Product designer",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Darshan Bane",
    role: "Executive",
    leads: 4,
    calls: 4,
    followUps: 3,
    opportunities: 1,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Jane Smith",
    role: "User",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Janvi Singh",
    role: "Executive",
    leads: 2,
    calls: 3,
    followUps: 2,
    opportunities: 2,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Janvi Singh",
    role: "Sales Executive",
    leads: 2,
    calls: 3,
    followUps: 2,
    opportunities: 2,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "John Doe",
    role: "User",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Marketing Manager User",
    role: "Marketing Manager",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Pratik V",
    role: "Executive",
    leads: 2,
    calls: 8,
    followUps: 2,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Pratik Vardekar",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Regular User",
    role: "Customer support",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Saif Shaikh",
    role: "Customer support",
    leads: 1,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Sales Executive User",
    role: "Sales Executive",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Sales Manager User",
    role: "Sales Manager",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Sohail Shaikh",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Super Admin User",
    role: "Super Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "Support User",
    role: "Customer Support",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "darshan khan",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "dummy",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "dummy2",
    role: "Product designer",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "dummy3",
    role: "Admin",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "dummy8",
    role: "Executive",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "saif shaikh",
    role: "Admin",
    leads: 1,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
  {
    name: "test",
    role: "Account Manager",
    leads: 0,
    calls: 0,
    followUps: 0,
    opportunities: 0,
    wonDeals: 0,
    revenue: 0,
    conv: 0,
  },
];

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

const EmployeePerformance = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q),
    );
  }, [search]);

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
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              {filtered.map((emp, i) => (
                <tr key={`${emp.name}-${emp.role}-${i}`}>
                  <td>
                    <div className={styles.rptEmp}>
                      <span
                        className={`${styles.avatar} ${styles[AVATAR_TONES[i % AVATAR_TONES.length]]}`}
                      >
                        {emp.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h5>{emp.name}</h5>
                        <p>{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.leads}</td>
                  <td>{emp.calls}</td>
                  <td>{emp.followUps}</td>
                  <td>{emp.opportunities}</td>
                  <td>{emp.wonDeals}</td>
                  <td>₹{emp.revenue.toLocaleString("en-IN")}</td>
                  <td className="rpt-conv">{emp.conv}%</td>
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
