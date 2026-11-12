import Layout from "@/components/layout/Layout";
import EmployeeSummary from "@/components/manage/employee/employee-summary/EmployeeSummary";
import EmployeeTable from "@/components/manage/employee/employee-table/EmployeeTable";
import React, { useMemo, useState } from "react";
import { FiBell, FiPlus, FiShield, FiUser } from "react-icons/fi";
import styles from "./EmployeePage.module.css";
import { useRouter } from "next/router";

const employees = [
  {
    id: "EMP0023",
    code: "EMP0023",
    name: "Pratik Vardekar",
    role: "admin",
    roleLabel: "Admin (Admin)",
    email: "pratikvardekar@gmail.com",
    phone: "8956489854",
    status: "active",
    tone: "green",
    leads: null,
  },
  {
    id: "EMP0024",
    code: "EMP0024",
    name: "Janvi Singh",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "janvisingh06827@gmail.com",
    phone: "911207567",
    status: "active",
    tone: "orange",
    leads: 5,
  },
  {
    id: "EMP0025",
    code: "EMP0025",
    name: "Rahul Sharma",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "rahul.sharma@gmail.com",
    phone: "9898234567",
    status: "active",
    tone: "teal",
    leads: 3,
  },
  {
    id: "EMP0026",
    code: "EMP0026",
    name: "Neha Verma",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "neha.verma@gmail.com",
    phone: "9988776655",
    status: "inactive",
    tone: "green",
    leads: 1,
  },
  {
    id: "EMP0027",
    code: "EMP0027",
    name: "Amit Patel",
    role: "admin",
    roleLabel: "Admin (Admin)",
    email: "amit.patel@gmail.com",
    phone: "9123456789",
    status: "active",
    tone: "orange",
    leads: 2,
  },
  {
    id: "EMP0028",
    code: "EMP0028",
    name: "Ishita Roy",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "ishita.roy@gmail.com",
    phone: "9012345678",
    status: "active",
    tone: "green",
    leads: 4,
  },
  {
    id: "EMP0029",
    code: "EMP0029",
    name: "Rohit Kumar",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "rohit.kumar@gmail.com",
    phone: "9876543210",
    status: "inactive",
    tone: "teal",
    leads: 0,
  },
  {
    id: "EMP0030",
    code: "EMP0030",
    name: "Meera Joshi",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "meera.joshi@gmail.com",
    phone: "9345678901",
    status: "active",
    tone: "orange",
    leads: 3,
  },
  {
    id: "EMP0031",
    code: "EMP0031",
    name: "Vikram Singh",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "vikram.singh@gmail.com",
    phone: "9654321987",
    status: "active",
    tone: "green",
    leads: 2,
  },
  {
    id: "EMP0032",
    code: "EMP0032",
    name: "Sonia Kapoor",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "sonia.kapoor@gmail.com",
    phone: "9234567890",
    status: "active",
    tone: "orange",
    leads: 6,
  },
  {
    id: "EMP0033",
    code: "EMP0033",
    name: "Harsh Mehta",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "harsh.mehta@gmail.com",
    phone: "9178654321",
    status: "active",
    tone: "teal",
    leads: 1,
  },
  {
    id: "EMP0034",
    code: "EMP0034",
    name: "Kavya Nair",
    role: "sales_executive",
    roleLabel: "Sales Executive",
    email: "kavya.nair@gmail.com",
    phone: "9871234567",
    status: "active",
    tone: "green",
    leads: 4,
  },
];

const summary = {
  total: 12,
  active: 11,
  total_leads_assigned: 3,
  pending_tasks: 0,
};

const pageSize = 10;

const sidePanelItems = [
  { label: "Employee", icon: FiUser, active: true },
  { label: "Employee Permissions", icon: FiShield },
  { label: "Attendance Overview", icon: FiBell },
];

const Employee = () => {
  const router = useRouter();
  const [from, setFrom] = useState("2026-11-02");
  const [to, setTo] = useState("2026-11-12");
  const [filters, setFilters] = useState({ search: "", status: "", role: "" });
  const [page, setPage] = useState(1);

  const filteredEmployees = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !search ||
        employee.name.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.code.toLowerCase().includes(search);

      const matchesStatus =
        !filters.status || employee.status === filters.status;

      const matchesRole = !filters.role || employee.role === filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const pagedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "", role: "" });
    setPage(1);
  };

  const startIndex = filteredEmployees.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const endIndex = Math.min(currentPage * pageSize, filteredEmployees.length);

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

          <EmployeeTable
            employees={pagedEmployees}
            showingRange={`${startIndex} - ${endIndex}`}
            totalCount={filteredEmployees.length || employees.length}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Employee;
