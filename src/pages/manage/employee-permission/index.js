import React from "react";
import Layout from "@/components/layout/Layout";
import EmployeePermission from "@/components/manage/employee-permission/EmployeePermission";
import { FiArrowLeft, FiBell, FiShield, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import styles from "../employee/EmployeePage.module.css";

const sidePanelItems = [
  { label: "Employee", icon: FiUser, href: "/manage/employee" },
  {
    label: "Employee Permissions",
    icon: FiShield,
    href: "/manage/employee-permission",
    active: true,
  },
  { label: "Attendance Overview", icon: FiBell },
];

const EmployeePermissionPage = () => {
  const router = useRouter();

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
            {sidePanelItems.map(({ label, icon: Icon, active, href }) => (
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
              <strong>Employee Permissions</strong>
            </div>

            <div className={styles.headerRow}>
              <h1 className={styles.title}>Employee Permissions</h1>

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

          <EmployeePermission />
        </div>
      </div>
    </Layout>
  );
};

export default EmployeePermissionPage;
