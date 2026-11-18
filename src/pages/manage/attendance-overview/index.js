import React from "react";
import Layout from "@/components/layout/Layout";
import AttendanceOverview from "@/components/manage/attendance-overview/AttendanceOverview";
import { FiArrowLeft, FiBell, FiShield, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import styles from "../employee/EmployeePage.module.css";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const sidePanelItems = [
  {
    label: "Employee",
    icon: FiUser,
    href: "/manage/employee",
    moduleKey: "employees",
  },
  {
    label: "Employee Permissions",
    icon: FiShield,
    href: "/manage/employee-permission",
    moduleKey: "employee_permissions",
  },
  {
    label: "Attendance Overview",
    icon: FiBell,
    href: "/manage/attendance-overview",
    active: true,
    moduleKey: "employees",
  },
];

const AttendanceOverviewPage = () => {
  const router = useRouter();
  const { canView, ready } = usePermissions();
  const canSeeEmployees = ready && canView("employees");
  const visibleNav = sidePanelItems.filter((item) => canView(item.moduleKey));

  if (!canSeeEmployees) {
    return <Layout />;
  }

  return (
    <Layout>
      <div className={`${styles.pageShell} content`}>
        <aside className={styles.sidePanel}>
          <div className={styles.sideTitle}>
            Manage employees &amp; assignments
          </div>

          <nav
            className={styles.sideNav}
            aria-label="Employee management navigation"
          >
            {visibleNav.map(({ label, icon: Icon, active, href }) => (
              <button
                type="button"
                key={label}
                className={`${styles.sideNavItem} ${active ? styles.sideNavItemActive : ""}`}
                onClick={() => {
                  if (href && !active) router.push(href);
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
              <strong>Attendance Overview</strong>
            </div>

            <div className={styles.headerRow}>
              <h1 className={styles.title}>Login Overview</h1>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => router.push("/manage/employee")}
              >
                <FiArrowLeft size={16} />
                Back
              </button>
            </div>
          </header>

          <AttendanceOverview />
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceOverviewPage;
