import Layout from "@/components/layout/Layout";
import EmployeeSummary from "@/components/manage/employee/employee-summary/EmployeeSummary";
import EmployeeTable from "@/components/manage/employee/employee-table/EmployeeTable";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React, { useState } from "react";
import { FiBell, FiPlus, FiShield, FiUser } from "react-icons/fi";
import styles from "./EmployeePage.module.css";
import { useRouter } from "next/router";

const sidePanelItems = [
  {
    label: "Employee",
    icon: FiUser,
    active: true,
    moduleKey: "employees",
  },
  {
    label: "Employee Permissions",
    icon: FiShield,
    moduleKey: "employee_permissions",
  },
  {
    label: "Attendance Overview",
    icon: FiBell,
    moduleKey: "employees",
  },
];

const Employee = () => {
  const router = useRouter();
  const { canView, canAdd, ready } = usePermissions();
  const canSeeEmployees = ready && canView("employees");
  const canCreateEmployee = ready && canAdd("employees");
  const visibleNav = sidePanelItems.filter((item) => canView(item.moduleKey));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [summary, setSummary] = useState({});

  if (!canSeeEmployees) {
    return <Layout />;
  }

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
            {visibleNav.map(({ label, icon: Icon, active }) => (
              <button
                type="button"
                key={label}
                className={`${styles.sideNavItem} ${active ? styles.sideNavItemActive : ""}`}
                onClick={() => {
                  if (label === "Employee Permissions") {
                    router.push("/manage/employee-permission");
                  }
                  if (label === "Attendance Overview") {
                    router.push("/manage/attendance-overview");
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

              {canCreateEmployee && (
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => router?.push("/manage/employee/create")}
                >
                  <FiPlus size={15} />
                  Add Employee
                </button>
              )}
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
