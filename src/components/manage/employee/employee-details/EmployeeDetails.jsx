import React, { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiClock,
  FiEdit2,
  FiFileText,
  FiLayers,
  FiPhone,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useGetEmployeeQuery } from "@/redux/apis/employeeApi";
import styles from "./EmployeeDetails.module.css";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin (Admin)",
  manager: "Manager",
  executive: "Executive",
  sales_executive: "Sales Executive",
  marketing_manager: "Marketing Manager",
  product_designer: "Product Designer",
  customer_support: "Customer Support",
};

const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string") return "";

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("blob:") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  if (!base) return "";

  return `${base}/${avatar.replace(/^\/+/, "")}`;
};

const displayValue = (value) => {
  if (value == null || value === "") return "—";
  return String(value);
};

const formatRole = (role) => {
  if (!role) return "—";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];

  return String(role)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(date);
};

const formatEmployeeId = (employee) => {
  const raw =
    employee?.employee_code || employee?.emp_id || employee?.employee_id;

  if (raw && String(raw).toUpperCase().startsWith("EMP")) {
    return String(raw).toUpperCase();
  }

  const id = raw ?? employee?.id;
  if (id == null || id === "") return "—";

  const numeric = String(id).replace(/\D/g, "");
  if (numeric && numeric === String(id)) {
    return `EMP${numeric.padStart(4, "0")}`;
  }

  return String(id);
};

const isActiveStatus = (status) => {
  const value = String(status || "").toLowerCase();
  return value === "active" || value === "1" || value === "true";
};

const formatStatus = (status) => {
  if (isActiveStatus(status)) return "Active";
  if (!status) return "Inactive";

  const value = String(status);
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatCount = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatConversion = (payload, employee, totalLeads, totalDeals) => {
  const explicit =
    payload?.conversion_rate ??
    payload?.conversion ??
    employee?.conversion_rate ??
    employee?.conversion;

  if (explicit != null && explicit !== "") {
    const text = String(explicit);
    return text.includes("%") ? text : `${text}%`;
  }

  if (!totalLeads) return "0%";

  return `${Math.round((totalDeals / totalLeads) * 100)}%`;
};

const getActivities = (payload, employee, isActive) => {
  const raw =
    payload?.recent_activities ||
    payload?.activities ||
    employee?.recent_activities ||
    employee?.activities;

  if (Array.isArray(raw) && raw.length) {
    return raw.map((item) => {
      if (typeof item === "string") return { title: item, time: "" };

      return {
        title: item?.title || item?.message || item?.activity || "Activity",
        time:
          formatRelativeTime(
            item?.time || item?.created_at || item?.created_on || item?.ago,
          ) || "",
      };
    });
  }

  return [
    {
      title: isActive ? "Employee Account Active" : "Employee Account Inactive",
      time: formatRelativeTime(
        employee?.last_activity_at ||
          employee?.updated_at ||
          employee?.created_at,
      ),
    },
  ];
};

function EmployeeAvatar({ name, src }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name || "Employee"}
        className={styles.avatarImg}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={styles.avatarFallback} aria-hidden="true">
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

const EmployeeDetails = ({ employeeId }) => {
  const { data, isLoading, isUninitialized, isError, isFetching } =
    useGetEmployeeQuery({ id: employeeId }, { skip: !employeeId });

  const payload =
    data?.data && !Array.isArray(data.data) ? data.data : data || {};
  const employee =
    payload?.employee && !Array.isArray(payload.employee)
      ? payload.employee
      : payload?.id != null
        ? payload
        : null;

  if (
    !employeeId ||
    isUninitialized ||
    isLoading ||
    (isFetching && !employee)
  ) {
    return <div className={styles.stateCard}>Loading employee...</div>;
  }

  if (isError || !employee) {
    return (
      <div className={styles.stateCard}>Unable to load employee details.</div>
    );
  }

  const isActive = isActiveStatus(employee.status);
  const statusLabel = formatStatus(employee.status);
  const totalLeads = formatCount(payload?.total_leads ?? employee?.total_leads);
  const totalCalls = formatCount(payload?.total_calls ?? employee?.total_calls);
  const totalDeals = formatCount(payload?.total_deals ?? employee?.total_deals);
  const conversionRate = formatConversion(
    payload,
    employee,
    totalLeads,
    totalDeals,
  );
  const createdOn = formatDate(
    employee?.created_on || employee?.created_at || employee?.created_date,
  );
  const lastActivity =
    employee?.last_activity ||
    employee?.last_active ||
    employee?.last_activity_at;
  const lastActivityLabel = lastActivity
    ? formatDate(lastActivity) || displayValue(lastActivity)
    : isActive
      ? "Recently Active"
      : "—";
  const activities = getActivities(payload, employee, isActive);
  const avatarSrc = getAvatarUrl(employee?.avatar_url || employee?.avatar);

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: FiLayers },
    { label: "Total Calls", value: totalCalls, icon: FiPhone },
    { label: "Total Deals", value: totalDeals, icon: FiFileText },
    { label: "Conversion Rate", value: conversionRate, icon: FiTrendingUp },
  ];

  const fields = [
    { label: "Name", value: displayValue(employee.name) },
    { label: "Account Owner", value: displayValue(employee.manager) },
    { label: "Designation", value: formatRole(employee.role) },
    { label: "Created on", value: createdOn || "—" },
    { label: "Contact No.", value: displayValue(employee.mobile) },
    { label: "Status", value: statusLabel },
    { label: "Email", value: displayValue(employee.email) },
    { label: "Last Activity", value: lastActivityLabel },
    { label: "Password", value: "hidden" },
    { label: "Employee ID", value: formatEmployeeId(employee) },
  ];

  const quickActions = [
    {
      label: "View Leads",
      icon: FiUsers,
      href: employee?.name
        ? { pathname: "/leads", query: { assigned_to: employee.name } }
        : "/leads",
    },
    { label: "View Follow-up", icon: FiClock, href: "/follow-up" },
    { label: "View Quotations", icon: FiFileText, href: "/quotations" },
  ];

  return (
    <div className={styles.frame}>
      <div className={styles.layout}>
        <section className={styles.profileCard}>
          <div className={styles.identity}>
            <EmployeeAvatar name={employee.name} src={avatarSrc} />
            <div>
              <h2>{displayValue(employee.name)}</h2>
              <p className={styles.role}>{formatRole(employee.role)}</p>
            </div>
          </div>

          <span
            className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeInactive}`}
          >
            {statusLabel}
          </span>
        </section>

        <section className={styles.stats} aria-label="Employee performance">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className={styles.statCard}>
              <span className={styles.statIcon}>
                <Icon size={20} />
              </span>
              <p className={styles.statLabel}>{label}</p>
              <h3 className={styles.statValue}>{value}</h3>
            </article>
          ))}
        </section>

        <section className={`${styles.sideCard} ${styles.quickCard}`}>
          <h3 className={styles.sideTitle}>Quick Action</h3>
          {quickActions.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} className={styles.actionLink}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </section>

        <section className={styles.overviewCard}>
          <h3 className={styles.sectionTitle}>
            <FiUser size={16} />
            Account Overview
          </h3>

          <div className={styles.overviewGrid}>
            {fields.map((field) => (
              <div key={field.label} className={styles.field}>
                <span className={styles.fieldLabel}>{field.label}</span>
                {field.label === "Password" ? (
                  <span
                    className={`${styles.fieldValue} ${styles.passwordMask}`}
                    aria-label="Password hidden"
                  >
                    ••••••••••
                  </span>
                ) : (
                  <span className={styles.fieldValue}>{field.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className={styles.cardActions}>
            <Link
              href={`/manage/employee/edit/${employee.id}`}
              className={styles.editButton}
            >
              <FiEdit2 size={15} />
              Edit Employee
            </Link>
            <Link href="/manage/employee" className={styles.listButton}>
              <FiArrowLeft size={15} />
              Back to List
            </Link>
          </div>
        </section>

        <section className={`${styles.sideCard} ${styles.activityCard}`}>
          <h3 className={styles.sideTitle}>Recent Activities</h3>
          <div className={styles.activityList}>
            {activities.map((activity, index) => (
              <article
                key={`${activity.title}-${index}`}
                className={styles.activity}
              >
                <span className={styles.activityDot} aria-hidden="true" />
                <div>
                  <p className={styles.activityTitle}>{activity.title}</p>
                  {activity.time ? (
                    <p className={styles.activityTime}>{activity.time}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeDetails;
