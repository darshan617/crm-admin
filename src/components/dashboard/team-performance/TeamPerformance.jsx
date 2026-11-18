import React from "react";
import Link from "next/link";

import { IoIosAdd } from "react-icons/io";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { LuFilePlus2 } from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";

import styles from "@/components/dashboard/team-performance/TeamPerformance.module.css";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

// Used only if the API doesn't send period_options
const FALLBACK_PERIODS = [
  { id: "today", name: "Today" },
  { id: "7d", name: "Last 7 days" },
  { id: "month", name: "Last Month" },
];

const TeamPerformance = ({
  team,
  filters = {},
  periodOptions = [],
  onPeriodChange,
}) => {
  const { canAdd, canView } = usePermissions();

  const quickActions = [
    {
      href: "/leads/add-new-leads",
      icon: IoIosAdd,
      label: "Add Leads",
      moduleKey: "leads",
    },
    {
      href: "/leads/upload-leads",
      icon: BsFileEarmarkArrowUp,
      label: "Upload Leads",
      moduleKey: "import_leads",
    },
    {
      href: "/quotations/add-quotation",
      icon: LuFilePlus2,
      label: "Add Quotation",
      moduleKey: "quotations",
    },
    {
      href: "/manage/employee/create",
      icon: FiUserPlus,
      label: "Add Employee",
      moduleKey: "employees",
    },
  ].filter((action) => canAdd(action.moduleKey));

  const periods = periodOptions.length ? periodOptions : FALLBACK_PERIODS;

  const teamMembers = (Array.isArray(team) ? team : []).map((m) => ({
    name: m?.name ?? "Unknown",
    role: m?.role ?? "",
    leads: m?.leads ?? 0,
    calling: m?.calling ?? 0,
    deals: m?.deals ?? 0,
    conv: m?.conversion ?? 0,
  }));

  const stats = [
    { label: "LEADS", key: "leads" },
    { label: "CALLING", key: "calling" },
    { label: "DEALS", key: "deals" },
    { label: "CONV", key: "conv" },
  ];

  const showTeam = canView("reports") || canView("employees");

  return (
    <>
      {quickActions.length > 0 && (
        <div className={styles.newQuickActions}>
          {quickActions.map(({ href, icon: Icon, label }) => (
            <Link key={label} href={href} className={styles.quickBtn}>
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}

      {showTeam && (
        <section className={styles.commonTableSection}>
          <div className={styles.commonTableCard}>
            <div className={styles.commonTableHeader}>
              <div>
                <h3>TEAM PERFORMANCE</h3>
              </div>

              <div className={styles.salesFilter}>
                {periods?.slice(0, 3)?.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={
                      filters.period === p.id ? styles.active : undefined
                    }
                    onClick={() => onPeriodChange?.(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <table className={styles.teamTable}>
                <tbody className={styles.tableBody}>
                  {teamMembers?.slice(0, 5)?.map((member, index) => (
                    <tr
                      key={`${member.name}-${index}`}
                      className={`${styles.teamPrRow} ${styles.tableRow}`}
                    >
                      <td className={styles.customer}>
                        <div className={styles.avatar}>
                          {member?.name?.[0] || "U"}
                        </div>

                        <div>
                          <h5>{member?.name}</h5>
                          <p>{member?.role}</p>
                        </div>
                      </td>

                      {stats.map((s) => (
                        <td key={s.key} className={styles.teamNum}>
                          <small>{s.label}</small>
                          <strong>{member[s.key]}</strong>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {canView("reports") && (
                <Link href="/reports" className={styles.viewAll}>
                  View All
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default TeamPerformance;
