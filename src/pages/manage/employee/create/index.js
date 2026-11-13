import React from "react";
import Layout from "@/components/layout/Layout";
import { FiArrowLeft, FiBell, FiShield, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import styles from "../EmployeePage.module.css";
import CreateEmployeeForm from "@/components/manage/employee/create-employee/CreateEmployeeForm";

const sidePanelItems = [
  { label: "Employee", icon: FiUser, active: true },
  { label: "Employee Permissions", icon: FiShield },
  { label: "Attendance Overview", icon: FiBell },
];

const CreateEmployee = () => {
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
            {sidePanelItems.map(({ label, icon: Icon, active }) => (
              <button
                type="button"
                key={label}
                className={`${styles.sideNavItem} ${active ? styles.sideNavItemActive : ""}`}
                onClick={() => {
                  if (label === "Employee") router.push("/manage/employee");
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
              <h1 className={styles.title}>Add Employee</h1>

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

          <CreateEmployeeForm />
        </div>
      </div>
    </Layout>
  );
};

export default CreateEmployee;
