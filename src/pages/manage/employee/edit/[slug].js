import React from "react";
import Layout from "@/components/layout/Layout";
import { FiArrowLeft, FiBell, FiShield, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import styles from "../EmployeePage.module.css";
import CreateEmployeeForm from "@/components/manage/employee/create-employee/CreateEmployeeForm";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const sidePanelItems = [
  { label: "Employee", icon: FiUser, active: true, moduleKey: "employees" },
  {
    label: "Employee Permissions",
    icon: FiShield,
    moduleKey: "employee_permissions",
  },
  { label: "Attendance Overview", icon: FiBell, moduleKey: "employees" },
];

const EditEmployee = () => {
  const router = useRouter();
  const { canView, canEdit, ready } = usePermissions();
  const canEditEmployee = ready && canEdit("employees");
  const visibleNav = sidePanelItems.filter((item) => canView(item.moduleKey));
  const employeeId = router.isReady ? router.query.slug : "";

  if (!canEditEmployee) {
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
            {visibleNav.map(({ label, icon: Icon, active }) => (
              <button
                type="button"
                key={label}
                className={`${styles.sideNavItem} ${active ? styles.sideNavItemActive : ""}`}
                onClick={() => {
                  if (label === "Employee") router.push("/manage/employee");
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
              <h1 className={styles.title}>Edit Employee</h1>

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

          {employeeId ? (
            <CreateEmployeeForm employeeId={employeeId} />
          ) : (
            <p className={styles.breadcrumbs}>Loading employee...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditEmployee;
