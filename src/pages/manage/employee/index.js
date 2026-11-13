import Layout from "@/components/layout/Layout";
import EmployeeSummary from "@/components/manage/employee/employee-summary/EmployeeSummary";
import EmployeeTable from "@/components/manage/employee/employee-table/EmployeeTable";
import React, { useState } from "react";
import { FiBell, FiPlus, FiShield, FiUser } from "react-icons/fi";
import styles from "./EmployeePage.module.css";
import { useRouter } from "next/router";

const sidePanelItems = [
  { label: "Employee", icon: FiUser, active: true },
  { label: "Employee Permissions", icon: FiShield },
  { label: "Attendance Overview", icon: FiBell },
];

const Employee = () => {
  const router = useRouter();
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-11-13");
  const [summary, setSummary] = useState({});

  return (
    <Layout>
      <div className={`${styles.pageShell} content `}>
        <aside className={styles.sidePanel}>
          <div className={styles.sideTitle}>
            Manage employees &amp; assignments
          </div>

          <nav
            className={styles.sideNav}
            aria-label="Employee management navigation"
          >
            {sidePanelItems.map(({ label, icon: Icon, active }) => (
              <button
                type="button"
                key={label}
                className={`${styles.sideNavItem} ${active ? styles.sideNavItemActive : ""}`}
                onClick={() => {
                  if (label === "Employee Permissions") {
                    router.push("/manage/employee-permission");
                  }
                }}
              >
                <span className={styles.navIconWrap}>
                  <Icon size={18} />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles.page}>
          <header className={styles.pageHeader}>
            <div className={styles.breadcrumbs}>
              Dashboard / Manage / Employee Management /{" "}
              <strong>Employee</strong>
            </div>

            <div className={styles.headerRow}>
              <h1 className={styles.title}>Employee</h1>

              <button
                type="button"
                className={styles.addButton}
                onClick={() => router?.push("/manage/employee/create")}
              >
                <FiPlus size={15} />
                Add Employee
              </button>
            </div>
          </header>

          <EmployeeSummary
            summary={summary}
            from={from}
            to={to}
            onChange={(key, value) => {
              if (key === "from") setFrom(value);
              if (key === "to") setTo(value);
            }}
          />

          <EmployeeTable from={from} to={to} onSummary={setSummary} />
        </div>
      </div>
    </Layout>
  );
};

export default Employee;
